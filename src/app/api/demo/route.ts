import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/aiPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-4-7";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY is not configured. Set it in your Vercel project settings → Environment Variables, then redeploy.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let input = "";
  try {
    const body = (await req.json()) as { input?: unknown };
    if (typeof body.input === "string") input = body.input.trim();
  } catch {
    /* fall through to validation below */
  }

  if (!input) {
    return new Response(JSON.stringify({ error: "Missing 'input' field." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (input.length > 8000) {
    return new Response(
      JSON.stringify({ error: "Input too long (max 8000 characters)." }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const liveStream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          thinking: { type: "adaptive" },
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [
            {
              role: "user",
              content: `Analyze this inbound from a Merchants customer or rep. Produce the five-section structured analysis as defined.\n\n---\n${input}\n---`,
            },
          ],
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
