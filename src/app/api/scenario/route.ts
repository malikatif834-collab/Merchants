import Anthropic from "@anthropic-ai/sdk";
import { SCENARIO_SYSTEM_PROMPT } from "@/lib/scenarioPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-6";

const adviceStep = {
  type: "object",
  additionalProperties: false,
  required: ["next", "why"],
  properties: {
    next: { type: "string" },
    why: { type: "string" },
  },
} as const;

const SCENARIO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "prNo",
    "customerName",
    "customerContact",
    "customerType",
    "customerCreditRating",
    "customerArStatus",
    "inboundChannel",
    "inboundSummary",
    "inboundBody",
    "productDescription",
    "productQty",
    "productUom",
    "estimatedValue",
    "marginTargetPct",
    "isStockMatch",
    "stockSku",
    "stockOnHand",
    "alternativeSku",
    "arRisk",
    "arDecision",
    "isSpecialOrder",
    "supplierQuotes",
    "recommendedSupplier",
    "marginAfterSourcingPct",
    "negotiationAttempted",
    "negotiationRound",
    "finalSupplierPrice",
    "customerResponse",
    "finalOutcome",
    "finalRevenue",
    "finalMarginDollars",
    "advice",
  ],
  properties: {
    prNo: { type: "string" },
    customerName: { type: "string" },
    customerContact: { type: "string" },
    customerType: {
      type: "string",
      enum: [
        "hospitality",
        "manufacturing",
        "healthcare",
        "education",
        "retail",
        "office",
        "automotive",
        "food_service",
      ],
    },
    customerCreditRating: { type: "string", enum: ["A", "B", "C", "D"] },
    customerArStatus: { type: "string" },
    inboundChannel: {
      type: "string",
      enum: ["email", "portal", "phone", "walkup", "customer_pdf"],
    },
    inboundSummary: { type: "string" },
    inboundBody: { type: "string" },
    productDescription: { type: "string" },
    productQty: { type: "number" },
    productUom: { type: "string" },
    estimatedValue: { type: "number" },
    marginTargetPct: { type: "number" },
    isStockMatch: { type: "boolean" },
    stockSku: { type: ["string", "null"] },
    stockOnHand: { type: ["number", "null"] },
    alternativeSku: { type: ["string", "null"] },
    arRisk: { type: "string", enum: ["low", "medium", "high", "critical"] },
    arDecision: {
      type: "string",
      enum: [
        "proceed",
        "hold_pending_review",
        "prepay_required",
        "decline",
      ],
    },
    isSpecialOrder: { type: "boolean" },
    supplierQuotes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "unitPrice", "totalPrice", "leadDays", "note"],
        properties: {
          name: { type: "string" },
          unitPrice: { type: "number" },
          totalPrice: { type: "number" },
          leadDays: { type: "number" },
          note: { type: "string" },
        },
      },
    },
    recommendedSupplier: { type: ["string", "null"] },
    marginAfterSourcingPct: { type: "number" },
    negotiationAttempted: { type: "boolean" },
    negotiationRound: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          required: ["ask", "response", "savings"],
          properties: {
            ask: { type: "string" },
            response: { type: "string" },
            savings: { type: "number" },
          },
        },
      ],
    },
    finalSupplierPrice: { type: ["number", "null"] },
    customerResponse: {
      type: "string",
      enum: ["accepted", "declined", "negotiating", "silent"],
    },
    finalOutcome: { type: "string", enum: ["won", "lost"] },
    finalRevenue: { type: "number" },
    finalMarginDollars: { type: "number" },
    advice: {
      type: "object",
      additionalProperties: false,
      required: ["onIntake", "onStock", "onAR", "onSourcing", "onQuote", "onClose"],
      properties: {
        onIntake: adviceStep,
        onStock: adviceStep,
        onAR: adviceStep,
        onSourcing: adviceStep,
        onQuote: adviceStep,
        onClose: adviceStep,
      },
    },
  },
} as const;

interface ScenarioBody {
  clientKey?: unknown;
  hint?: unknown;
  seed?: unknown;
}

export async function POST(req: Request) {
  let body: ScenarioBody = {};
  try {
    body = (await req.json()) as ScenarioBody;
  } catch {
    /* allow empty */
  }

  const clientKey =
    typeof body.clientKey === "string" ? body.clientKey.trim() : "";
  const hint = typeof body.hint === "string" ? body.hint.slice(0, 400) : "";
  const seed =
    typeof body.seed === "string" || typeof body.seed === "number"
      ? String(body.seed)
      : String(Math.floor(Math.random() * 1_000_000));

  const apiKey = process.env.ANTHROPIC_API_KEY || clientKey;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "No API key. Paste your Anthropic key into the orange setup banner.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic({ apiKey });

  const userMsg = `Generate ONE fresh procurement scenario. Vary it from anything you'd default to.
Seed (for variety): ${seed}
${hint ? `Hint from operator: ${hint}` : ""}

Return only the JSON object.`;

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: "disabled" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCENARIO_SCHEMA },
      },
      system: [
        {
          type: "text",
          text: SCENARIO_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMsg }],
    });

    // Extract the text block
    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return new Response(
        JSON.stringify({ error: "No text response from model." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: `Model returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
          raw: textBlock.text.slice(0, 600),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `AI error ${err.status}: ${err.message}`
        : `AI error: ${err instanceof Error ? err.message : String(err)}`;
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
