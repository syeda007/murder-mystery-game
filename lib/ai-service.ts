// Dual-provider AI abstraction layer.
//
// Both Gemini and OpenAI are wired up behind a single interface so the rest
// of the app (server.ts, api/index.ts) never has to know which provider is
// active. Switch providers by setting AI_PROVIDER=gemini|openai in the env.
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Provider-agnostic schema vocabulary, mirroring Gemini's `Type` enum values.
// Callers describe the desired JSON shape once with these constants; each
// provider implementation translates it into whatever format it needs.
export const SchemaType = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
} as const;

export interface JsonSchema {
  type: (typeof SchemaType)[keyof typeof SchemaType];
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
}

export interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: JsonSchema;
}

export interface AIResponse {
  text: string;
}

export interface IAIService {
  readonly provider: "gemini" | "openai";
  generateResponse(prompt: string, options?: GenerateOptions): Promise<AIResponse>;
}

const GEMINI_MODEL = "gemini-3.7-flash";
const OPENAI_MODEL = "gpt-4o";

class GeminiAIService implements IAIService {
  readonly provider = "gemini" as const;
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  async generateResponse(prompt: string, options: GenerateOptions = {}): Promise<AIResponse> {
    const response = await this.client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        ...(options.responseSchema
          ? { responseMimeType: "application/json", responseSchema: options.responseSchema as any }
          : {}),
      },
    });

    return { text: response.text || "" };
  }
}

class OpenAIService implements IAIService {
  readonly provider = "openai" as const;
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(prompt: string, options: GenerateOptions = {}): Promise<AIResponse> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options.systemInstruction) {
      messages.push({ role: "system", content: options.systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const response = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      ...(options.responseSchema
        ? {
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "response",
                schema: toJsonSchema(options.responseSchema),
              },
            },
          }
        : {}),
    });

    return { text: response.choices[0]?.message?.content || "" };
  }
}

// Converts our Gemini-style schema (upper-case type constants) into the
// standard lower-case JSON Schema OpenAI expects.
function toJsonSchema(schema: JsonSchema): Record<string, any> {
  const jsonSchema: Record<string, any> = {
    type: schema.type.toLowerCase(),
  };
  if (schema.description) jsonSchema.description = schema.description;
  if (schema.properties) {
    jsonSchema.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, toJsonSchema(value)])
    );
    jsonSchema.additionalProperties = false;
    jsonSchema.required = schema.required || Object.keys(schema.properties);
  }
  if (schema.items) {
    jsonSchema.items = toJsonSchema(schema.items);
  }
  return jsonSchema;
}

let cachedService: IAIService | null | undefined;

// Lazily builds (and caches) the active AI client based on AI_PROVIDER.
// Returns null when the selected provider has no API key configured, so
// callers can fall back to their existing procedural/offline behavior.
export function getAIService(): IAIService | null {
  if (cachedService !== undefined) return cachedService;

  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    cachedService = apiKey ? new OpenAIService(apiKey) : null;
  } else {
    const apiKey = process.env.GEMINI_API_KEY;
    cachedService = apiKey ? new GeminiAIService(apiKey) : null;
  }

  console.log(
    cachedService
      ? `[ai-service] Using AI provider: ${cachedService.provider}`
      : `[ai-service] AI_PROVIDER=${provider} but no matching API key was found; AI features will use offline fallbacks.`
  );

  return cachedService;
}

// Optional fallback: try the primary provider, and if it throws, retry once
// against the other provider (only when that provider's key is configured).
// Enable with AI_FALLBACK=true.
export async function generateWithFallback(
  prompt: string,
  options?: GenerateOptions
): Promise<AIResponse> {
  const primary = getAIService();
  if (!primary) throw new Error("No AI provider configured");

  try {
    return await primary.generateResponse(prompt, options);
  } catch (error) {
    if (process.env.AI_FALLBACK !== "true") throw error;

    const fallbackProvider = primary.provider === "gemini" ? "openai" : "gemini";
    const fallbackKey =
      fallbackProvider === "openai" ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;
    if (!fallbackKey) throw error;

    console.error(
      `[ai-service] ${primary.provider} request failed, falling back to ${fallbackProvider}:`,
      error
    );
    const fallback =
      fallbackProvider === "openai" ? new OpenAIService(fallbackKey) : new GeminiAIService(fallbackKey);
    return fallback.generateResponse(prompt, options);
  }
}
