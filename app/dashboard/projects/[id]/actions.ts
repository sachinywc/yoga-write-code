"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchWebsiteText } from "@/lib/ai/extract";
import { getAIProvider } from "@/lib/ai/provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

type ServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function loadProject(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  if (!project) redirect("/dashboard");
  return { supabase, project: project as Project };
}

function fail(projectId: string, message: string): never {
  redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
}

async function buildContext(supabase: ServerClient, projectId: string, opportunityId: string) {
  const { data: opp } = await supabase
    .from("content_opportunities")
    .select("*")
    .eq("id", opportunityId)
    .single();
  if (!opp) fail(projectId, "Selected opportunity not found.");

  const { data: analysis } = await supabase
    .from("website_analyses")
    .select("*")
    .eq("project_id", projectId)
    .limit(1)
    .maybeSingle();

  return {
    opportunityTitle: String(opp.title),
    opportunityDescription: String(opp.description),
    companySummary: String(analysis?.company_summary ?? ""),
    targetAudience: String(analysis?.target_audience ?? ""),
  };
}

export async function analyzeWebsite(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase, project } = await loadProject(projectId);

  const { data: existing } = await supabase
    .from("website_analyses")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length > 0) {
    revalidatePath(`/dashboard/projects/${projectId}`);
    return;
  }

  const websiteText = await fetchWebsiteText(project.website_url);

  let result;
  try {
    result = await getAIProvider().analyzeWebsite({
      websiteUrl: project.website_url,
      websiteText,
    });
  } catch {
    fail(projectId, "We couldn't analyze this website right now. Try again.");
  }

  const { error: analysisError } = await supabase.from("website_analyses").insert({
    project_id: projectId,
    company_summary: result.companySummary,
    product_category: result.productCategory,
    target_audience: result.targetAudience,
    positioning: result.positioning,
    raw_data: { website_url: project.website_url, mode: process.env.AI_MODE ?? "mock" },
  });
  if (analysisError) fail(projectId, "Could not save the analysis. Try again.");

  const { error: oppError } = await supabase.from("content_opportunities").insert(
    result.opportunities.map((o) => ({
      project_id: projectId,
      title: o.title,
      description: o.description,
      opportunity_score: o.opportunityScore,
      difficulty: o.difficulty,
      business_relevance: o.businessRelevance,
      search_intent: o.searchIntent,
      funnel_stage: o.funnelStage,
      reason: o.reason,
    }))
  );
  if (oppError) fail(projectId, "Analysis saved but opportunities failed. Try again.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);

  const { data: existing } = await supabase
    .from("topic_clusters")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length > 0) {
    revalidatePath(`/dashboard/projects/${projectId}`);
    return;
  }

  const ctx = {
    ...(await buildContext(supabase, projectId, opportunityId)),
    websiteUrl: project.website_url,
  };

  let result;
  try {
    result = await getAIProvider().generateCluster(ctx);
  } catch {
    fail(projectId, "We couldn't generate the cluster right now. Try again.");
  }

  const { error } = await supabase.from("topic_clusters").insert({
    project_id: projectId,
    pillar_topic: result.pillarTopic,
    supporting_topics: result.supportingTopics,
    search_intent: result.searchIntent,
    priority: result.priority,
    internal_linking_suggestions: result.internalLinkingSuggestions,
  });
  if (error) fail(projectId, "Could not save the cluster. Try again.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function generateBrief(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);

  const { data: existing } = await supabase
    .from("seo_briefs")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length > 0) {
    revalidatePath(`/dashboard/projects/${projectId}`);
    return;
  }

  const ctx = {
    ...(await buildContext(supabase, projectId, opportunityId)),
    websiteUrl: project.website_url,
  };

  let result;
  try {
    result = await getAIProvider().generateBrief(ctx);
  } catch {
    fail(projectId, "We couldn't generate the brief right now. Try again.");
  }

  const { error } = await supabase.from("seo_briefs").insert({
    project_id: projectId,
    primary_keyword: result.primaryKeyword,
    search_intent: result.searchIntent,
    target_audience: result.targetAudience,
    suggested_headings: result.suggestedHeadings,
    questions_to_answer: result.questionsToAnswer,
    entities_to_mention: result.entitiesToMention,
    competitor_insights: result.competitorInsights,
  });
  if (error) fail(projectId, "Could not save the brief. Try again.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function generateOutline(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);

  const { data: existing } = await supabase
    .from("article_outlines")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length > 0) {
    revalidatePath(`/dashboard/projects/${projectId}`);
    return;
  }

  const ctx = {
    ...(await buildContext(supabase, projectId, opportunityId)),
    websiteUrl: project.website_url,
  };

  let result;
  try {
    result = await getAIProvider().generateOutline(ctx);
  } catch {
    fail(projectId, "We couldn't generate the outline right now. Try again.");
  }

  const { error } = await supabase.from("article_outlines").insert({
    project_id: projectId,
    title: result.title,
    h1: result.h1,
    sections: result.sections,
  });
  if (error) fail(projectId, "Could not save the outline. Try again.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}