import { BedrockAIProvider } from "./bedrock";
import { MockAIProvider } from "./mock";
import type {
  ArticleOutlineResult,
  SeoBriefResult,
  TopicClusterResult,
  WebsiteAnalysisResult,
} from "./schemas";

export class AIError extends Error {
  code: "AI_PROVIDER_ERROR" | "AI_VALIDATION_ERROR" | "AI_RATE_LIMIT" | "AI_TIMEOUT" | "AI_EMPTY_RESPONSE";
  constructor(code: AIError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export interface AnalysisInput {
  websiteUrl: string;
  websiteText: string | null;
}

export interface OpportunityContext {
  websiteUrl: string;
  opportunityTitle: string;
  opportunityDescription: string;
  companySummary: string;
  targetAudience: string;
}

export interface AIProvider {
  analyzeWebsite(input: AnalysisInput): Promise<WebsiteAnalysisResult>;
  generateCluster(input: OpportunityContext): Promise<TopicClusterResult>;
  generateBrief(input: OpportunityContext): Promise<SeoBriefResult>;
  generateOutline(input: OpportunityContext): Promise<ArticleOutlineResult>;
}

export function getAIProvider(): AIProvider {
  const mode = process.env.AI_MODE ?? "mock";
  if (mode === "bedrock") return new BedrockAIProvider();
  return new MockAIProvider();
}