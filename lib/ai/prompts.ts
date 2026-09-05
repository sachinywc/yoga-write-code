export const PROMPT_VERSION = "2026-08-22";

const JSON_RULE =
  "Respond ONLY with valid JSON matching the requested shape. No markdown, no HTML, no commentary.";

export function websiteAnalysisPrompt(url: string, websiteText: string | null) {
  return `You are an SEO strategist. Website: ${url}.
${websiteText ? `Extracted page text (truncated): ${websiteText}` : "No extracted text available; infer from the URL and domain only."}
Return JSON: { companySummary, productCategory, targetAudience, positioning, opportunities: [{ title, description, opportunityScore (0-100), difficulty, businessRelevance, searchIntent, funnelStage, reason }] }.
${JSON_RULE}`;
}

export function topicClusterPrompt(ctx: { opportunityTitle: string; companySummary: string }) {
  return `Opportunity: ${ctx.opportunityTitle}. Company: ${ctx.companySummary}.
Return JSON: { pillarTopic, supportingTopics[], searchIntent, priority, internalLinkingSuggestions[] }.
${JSON_RULE}`;
}

export function seoBriefPrompt(ctx: { opportunityTitle: string; targetAudience: string }) {
  return `Article opportunity: ${ctx.opportunityTitle}. Audience: ${ctx.targetAudience}.
Return JSON: { primaryKeyword, searchIntent, targetAudience, suggestedHeadings[], questionsToAnswer[], entitiesToMention[], competitorInsights[] }.
${JSON_RULE}`;
}

export function articleOutlinePrompt(ctx: { opportunityTitle: string }) {
  return `Write an article outline for: ${ctx.opportunityTitle}.
Return JSON: { title, h1, sections: [{ heading, purpose, points[] }] }.
${JSON_RULE}`;
}   