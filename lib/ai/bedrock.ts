import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import type { ZodType } from "zod";
import { extractWebsiteSignals } from "./extract";
import { AIError, type AIProvider, type AnalysisInput, type OpportunityContext } from "./provider";
import {
  ArticleOutlineSchema,
  SeoBriefSchema,
  TopicClusterSchema,
  WebsiteAnalysisSchema,
  type ArticleOutlineResult,
  type SeoBriefResult,
  type TopicClusterResult,
  type WebsiteAnalysisResult,
} from "./schemas";

// Keep the provider self-contained so it does not depend on an optional prompts module.
const SYSTEM_PROMPT =
  "Return only valid JSON matching the requested schema. Do not include markdown or explanatory text.";

const json = (value: unknown) => JSON.stringify(value);

const websiteAnalysisPrompt = (websiteUrl: string, signals: unknown) =>
  `Analyze this website and return the requested JSON result.\nWebsite: ${websiteUrl}\nSignals: ${json(signals)}`;

const topicClusterPrompt = (input: OpportunityContext, signals: unknown) =>
  `Generate a topic cluster and return the requested JSON result.\nContext: ${json(input)}\nSignals: ${json(signals)}`;

const seoBriefPrompt = (input: OpportunityContext, signals: unknown) =>
  `Generate an SEO brief and return the requested JSON result.\nContext: ${json(input)}\nSignals: ${json(signals)}`;

const articleOutlinePrompt = (input: OpportunityContext, signals: unknown) =>
  `Generate an article outline and return the requested JSON result.\nContext: ${json(input)}\nSignals: ${json(signals)}`;

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export async function generateWithBedrock(params: {
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const modelId = process.env.BEDROCK_MODEL_ID;
  if (!modelId) {
    throw new AIError("AI_PROVIDER_ERROR", "BEDROCK_MODEL_ID is not set in .env.local.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await client.send(
      new ConverseCommand({
        modelId,
        system: [{ text: SYSTEM_PROMPT }],
        messages: [{ role: "user", content: [{ text: params.user }] }],
        inferenceConfig: {
          maxTokens: params.maxTokens ?? 4000,
          temperature: params.temperature ?? 0.8,
        },
      }),
      { abortSignal: controller.signal }
    );

    const text =
      response.output?.message?.content
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) throw new AIError("AI_EMPTY_RESPONSE", "Bedrock returned no text.");
    return text;
  } catch (e) {
    if (e instanceof AIError) throw e;
    if (e instanceof Error && e.name === "AbortError") {
      throw new AIError("AI_TIMEOUT", "Bedrock timed out after 60s.");
    }
    const name = (e as { name?: string }).name ?? "";
    if (name === "ThrottlingException" || name === "TooManyRequestsException") {
      throw new AIError("AI_RATE_LIMIT", "Bedrock throttled the request. Wait a moment and retry.");
    }
    if (name === "AccessDeniedException") {
      throw new AIError(
        "AI_PROVIDER_ERROR",
        "Bedrock access denied — enable the model in AWS console → Bedrock → Model access."
      );
    }
    console.error("[bedrock]", name, e instanceof Error ? e.message : e);
    throw new AIError("AI_PROVIDER_ERROR", "Bedrock request failed.");
  } finally {
    clearTimeout(timer);
  }
}

const stripFences = (s: string) => s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

async function structured<T>(schema: ZodType<T>, prompt: string, maxTokens: number): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await generateWithBedrock({ user: prompt, maxTokens });

    let unknown: unknown;
    try {
      unknown = JSON.parse(stripFences(raw));
    } catch {
      console.error("[bedrock] invalid JSON:", raw.slice(0, 300));
      if (attempt === 0) continue;
      throw new AIError("AI_VALIDATION_ERROR", "Bedrock returned invalid JSON.");
    }

    const result = schema.safeParse(unknown);
    if (result.success) return result.data;

    console.error("[bedrock] schema mismatch:", result.error.issues.slice(0, 3));
    if (attempt === 0) continue;
    throw new AIError("AI_VALIDATION_ERROR", "Bedrock output failed validation.");
  }
  throw new AIError("AI_VALIDATION_ERROR", "Bedrock output failed validation.");
}

export class BedrockAIProvider implements AIProvider {
  async analyzeWebsite(input: AnalysisInput): Promise<WebsiteAnalysisResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(WebsiteAnalysisSchema, websiteAnalysisPrompt(input.websiteUrl, signals), 4000);
  }

  async generateCluster(input: OpportunityContext): Promise<TopicClusterResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(TopicClusterSchema, topicClusterPrompt(input, signals), 2000);
  }

  async generateBrief(input: OpportunityContext): Promise<SeoBriefResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(SeoBriefSchema, seoBriefPrompt(input, signals), 3000);
  }

  async generateOutline(input: OpportunityContext): Promise<ArticleOutlineResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(ArticleOutlineSchema, articleOutlinePrompt(input, signals), 3000);
  }
}