import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/aiPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sonnet 4.6: snappy first-token + plenty smart for this structured-extraction
// task. Bump to "claude-opus-4-7" + thinking={type:"adaptive"} for production.
const MODEL = "claude-sonnet-4-6";

const MAX_PDF_BYTES = 3_000_000; // ~3MB raw → ~4MB base64; stays under Vercel limits

interface DemoRequest {
  input?: unknown;
  clientKey?: unknown;
  pdfBase64?: unknown;
  pdfName?: unknown;
  pdfDirection?: unknown;
}

export async function POST(req: Request) {
  let body: DemoRequest = {};
  try {
    body = (await req.json()) as DemoRequest;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";
  const clientKey =
    typeof body.clientKey === "string" ? body.clientKey.trim() : "";
  const pdfBase64 =
    typeof body.pdfBase64 === "string" ? body.pdfBase64.trim() : "";
  const pdfName =
    typeof body.pdfName === "string" ? body.pdfName.trim() : "uploaded.pdf";
  const pdfDirection =
    body.pdfDirection === "supplier" ? "supplier" : "customer";

  // Need either text input or a PDF.
  if (!input && !pdfBase64) {
    return new Response(
      JSON.stringify({ error: "Missing 'input' field or 'pdfBase64' field." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (input.length > 8000) {
    return new Response(
      JSON.stringify({ error: "Text input too long (max 8000 characters)." }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }
  if (pdfBase64) {
    const approxBytes = Math.floor((pdfBase64.length * 3) / 4);
    if (approxBytes > MAX_PDF_BYTES) {
      return new Response(
        JSON.stringify({
          error: `PDF too large (${(approxBytes / 1_000_000).toFixed(1)} MB). Max 3 MB.`,
        }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Resolve the API key. Prefer server-side env (production path); fall back
  // to a client-supplied key for the demo workflow when the env var path
  // can't be configured in time.
  const apiKey = process.env.ANTHROPIC_API_KEY || clientKey;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "No API key available. Either configure ANTHROPIC_API_KEY in Vercel, or paste your key into the panel (it stays in your browser).",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  // Build the user message — may include a PDF document block.
  const userContent: Anthropic.Messages.ContentBlockParam[] = [];
  if (pdfBase64) {
    userContent.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: pdfBase64,
      },
    });
  }
  const directionHint =
    pdfDirection === "supplier"
      ? `(This PDF is an INBOUND SUPPLIER QUOTE — parse it as a vendor response during the sourcing step of MWI-0703-02.)`
      : pdfBase64
        ? `(This PDF is an INBOUND CUSTOMER REQUEST — RFQ, PO, or spec sheet — that triggers the procurement workflow.)`
        : "";
  const textPart = [
    `Analyze this inbound for Merchants Paper. Produce the five-section structured analysis exactly as defined in your instructions.`,
    pdfName && pdfBase64 ? `PDF attached: ${pdfName}` : "",
    directionHint,
    input ? `Additional notes / message:\n---\n${input}\n---` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  userContent.push({ type: "text", text: textPart });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const liveStream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          thinking: { type: "disabled" },
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userContent }],
        });

        for await (const event of liveStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `[AI error ${err.status}: ${err.message}]`
            : `[AI error: ${err instanceof Error ? err.message : String(err)}]`;
        controller.enqueue(encoder.encode("\n\n" + message));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
