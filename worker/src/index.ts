import catalogueData from "../../catalogue.json";

const ALLOWED_ORIGINS = new Set([
  "https://pabloarellano.org",
  "https://www.pabloarellano.org"
]);

const INTENTS = [
  "sleep", "anxiety", "calm", "overactive", "relax", "stress", "nature", "ground",
  "meditate", "peace", "heart", "quiet", "focus", "bliss", "slow", "mind", "mantra",
  "learn", "journey", "practice", "spiritual", "daily", "harmony"
] as const;

type Intent = typeof INTENTS[number];
type Duration = "short" | "medium" | "long";
type Format = "any" | "music" | "meditation" | "course";
type CatalogueItem = {
  id: string;
  title: string;
  type: Exclude<Format, "any">;
  duration: Duration[];
  intents: string[];
  description: string;
  href: string;
  action: string;
};

const catalogue = catalogueData as CatalogueItem[];

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "vary": "Origin"
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers["access-control-allow-origin"] = origin;
  return headers;
}

function json(data: unknown, status: number, origin: string | null): Response {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}

function isAllowedOrigin(origin: string | null): boolean {
  return origin === null || ALLOWED_ORIGINS.has(origin);
}

async function readLimitedJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Request body is required");

  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) {
      await reader.cancel("Request body too large");
      throw new Error("Request body is too large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function parseInput(value: unknown): { text: string; duration: Duration; format: Format } {
  if (!value || typeof value !== "object") throw new Error("Invalid request");
  const body = value as Record<string, unknown>;
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const duration = body.duration;
  const format = body.format;

  if (!text || text.length > 280) throw new Error("Please use between 1 and 280 characters");
  if (duration !== "short" && duration !== "medium" && duration !== "long") {
    throw new Error("Invalid duration");
  }
  if (format !== "any" && format !== "music" && format !== "meditation" && format !== "course") {
    throw new Error("Invalid format");
  }
  return { text, duration, format };
}

function fallbackIntents(text: string): Intent[] {
  const normalized = text.toLowerCase();
  const synonyms: Partial<Record<Intent, string[]>> = {
    sleep: ["sleep", "asleep", "bed", "night", "tired", "insomnia", "rest"],
    anxiety: ["anxious", "anxiety", "worried", "worry", "tense", "overwhelmed"],
    stress: ["stress", "stressed", "pressure"],
    overactive: ["busy mind", "thoughts", "overthinking", "overactive", "cannot stop", "can't stop"],
    focus: ["focus", "work", "study", "concentrate", "creative"],
    meditate: ["meditate", "meditation", "mindful", "stillness", "present"],
    mantra: ["mantra", "affirmation", "i am", "daily practice"],
    ground: ["ground", "grounded", "nature", "river", "unsettled"],
    peace: ["peace", "calm", "quiet", "relax", "soft", "gentle"],
    heart: ["heart", "grief", "sad", "emotion", "love"],
    spiritual: ["spiritual", "inner", "self", "meaning", "connection"]
  };

  return INTENTS.filter((intent) => synonyms[intent]?.some((phrase) => normalized.includes(phrase)));
}

async function interpretWithAi(env: Env, text: string): Promise<Intent[]> {
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
    messages: [
      {
        role: "system",
        content: "Classify the user's wellbeing intent. Do not give advice. Select only from the allowed intent labels."
      },
      { role: "user", content: text }
    ],
    temperature: 0,
    max_tokens: 80,
    response_format: {
      type: "json_schema",
      json_schema: {
        type: "object",
        properties: {
          intents: {
            type: "array",
            items: { type: "string", enum: [...INTENTS] },
            maxItems: 4
          }
        },
        required: ["intents"],
        additionalProperties: false
      }
    }
  });

  const raw = response.response;
  const value = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!value || typeof value !== "object" || !("intents" in value) || !Array.isArray(value.intents)) {
    throw new Error("AI returned an invalid classification");
  }
  return value.intents.filter((intent: unknown): intent is Intent =>
    typeof intent === "string" && (INTENTS as readonly string[]).includes(intent)
  );
}

function recommend(intents: Intent[], duration: Duration, format: Format): CatalogueItem[] {
  return catalogue
    .map((item) => {
      let score = item.intents.filter((intent) => intents.includes(intent as Intent)).length * 4;
      if (item.duration.includes(duration)) score += 2;
      if (format === "any" || item.type === format) score += 3;
      if (intents.length === 0 && item.intents.includes("peace")) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ item }) => item);
}

export default {
  async fetch(request, env): Promise<Response> {
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin)) return json({ error: "Origin not allowed" }, 403, origin);

    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      const headers = new Headers(corsHeaders(origin));
      headers.set("access-control-allow-methods", "POST, OPTIONS");
      headers.set("access-control-allow-headers", "content-type");
      headers.set("access-control-max-age", "86400");
      return new Response(null, { status: 204, headers });
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true }, 200, origin);
    }
    if (request.method !== "POST" || url.pathname !== "/recommend") {
      return json({ error: "Not found" }, 404, origin);
    }
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ error: "Content type must be application/json" }, 415, origin);
    }

    try {
      const input = parseInput(await readLimitedJson(request));
      let intents: Intent[];
      let mode: "ai" | "fallback" = "ai";
      try {
        intents = await interpretWithAi(env, input.text);
      } catch (error) {
        mode = "fallback";
        intents = fallbackIntents(input.text);
        console.warn(JSON.stringify({ event: "ai_fallback", reason: String(error) }));
      }

      return json({
        intents,
        matches: recommend(intents, input.duration, input.format),
        mode
      }, 200, origin);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Invalid request" }, 400, origin);
    }
  }
} satisfies ExportedHandler<Env>;
