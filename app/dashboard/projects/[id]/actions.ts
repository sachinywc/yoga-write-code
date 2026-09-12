"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
    
  if (!project) {
    redirect("/dashboard?error=" + encodeURIComponent("Project not found."));
  }

  const url = project.website_url;

  const prompt = `You are an expert SaaS content strategist. Analyze this website and provide insights.

Website URL: ${url}

Provide your analysis in this exact JSON format:
{
  "company_summary": "Brief description of what this company does",
  "product_category": "Their product category",
  "target_audience": "Who they serve",
  "positioning": "How they differentiate",
  "content_opportunities": [
    {
      "title": "Content topic title",
      "description": "What this covers",
      "reason": "Why this matters",
      "opportunity_score": 85,
      "search_intent": "informational",
      "funnel_stage": "top",
      "difficulty": "medium"
    }
  ]
}

Generate 3-5 real, specific content opportunities based on their actual business.`;

  try {
    const result = await invokeBedrock(prompt, 3000);
    
    // Try to extract JSON from the response
    let parsed;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(result);
      }
    } catch (parseError) {
      console.error("[JSON Parse Error]", parseError, "Raw result:", result);
      throw new Error("AI returned invalid format. Try again.");
    }

    // Insert analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: parsed.company_summary || "",
        product_category: parsed.product_category || "",
        target_audience: parsed.target_audience || "",
        positioning: parsed.positioning || "",
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("[Analysis Insert Error]", analysisError);
      throw new Error("Failed to save analysis.");
    }

    // Insert opportunities if they exist
    if (parsed.content_opportunities && Array.isArray(parsed.content_opportunities)) {
      const opportunities = parsed.content_opportunities.map((opp: {
        title?: string;
        description?: string;
        reason?: string;
        opportunity_score?: number;
        search_intent?: string;
        funnel_stage?: string;
        difficulty?: string;
      }) => ({
        project_id: projectId,
        analysis_id: analysis.id,
        title: opp.title || "",
        description: opp.description || "",
        reason: opp.reason || "",
        opportunity_score: opp.opportunity_score || 50,
        search_intent: opp.search_intent || "informational",
        funnel_stage: opp.funnel_stage || "top",
        difficulty: opp.difficulty || "medium",
      }));

      const { error: oppError } = await supabase
        .from("content_opportunities")
        .insert(opportunities);

      if (oppError) {
        console.error("[Opportunities Insert Error]", oppError);
      }
    }

  } catch (error) {
    console.error("[Analyze Website Error]", error);
    const message = error instanceof Error ? error.message : "Analysis failed. Try again.";
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent(message));
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: opportunity } = await supabase
    .from("content_opportunities")
    .select("title, description")
    .eq("id", opportunityId)
    .single();

  if (!opportunity) {
    redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
  }

  const prompt = `Create a topic cluster for: ${opportunity.title}

Return JSON:
{
  "pillar_topic": "Main comprehensive topic",
  "supporting_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "internal_linking_suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

  try {
    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: parsed.pillar_topic || "",
      supporting_topics: parsed.supporting_topics || [],
      internal_linking_suggestions: parsed.internal_linking_suggestions || [],
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Cluster Error]", error);
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Cluster generation failed."));
  }
}

export async function generateBrief(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: opportunity } = await supabase
    .from("content_opportunities")
    .select("title, description")
    .eq("id", opportunityId)
    .single();

  if (!opportunity) {
    redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
  }

  const prompt = `Create an SEO brief for: ${opportunity.title}

Return JSON:
{
  "primary_keyword": "main keyword",
  "search_intent": "What searcher wants",
  "target_audience": "Who should read this",
  "suggested_headings": ["H2 1", "H2 2", "H2 3"],
  "questions_to_answer": ["Question 1", "Question 2"],
  "entities_to_mention": ["Entity 1", "Entity 2"],
  "competitor_insights": "How to differentiate"
}`;

  try {
    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: parsed.primary_keyword || "",
      search_intent: parsed.search_intent || "",
      target_audience: parsed.target_audience || "",
      suggested_headings: parsed.suggested_headings || [],
      questions_to_answer: parsed.questions_to_answer || [],
      entities_to_mention: parsed.entities_to_mention || [],
      competitor_insights: parsed.competitor_insights || "",
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Brief Error]", error);
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Brief generation failed."));
  }
}

export async function generateOutline(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: brief } = await supabase
    .from("seo_briefs")
    .select("primary_keyword, suggested_headings, questions_to_answer")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const prompt = `Create an editorial outline.

Keyword: ${brief?.primary_keyword ?? "topic"}
Headings: ${brief?.suggested_headings?.join(", ") ?? "none"}
Questions: ${brief?.questions_to_answer?.join(", ") ?? "none"}

Return JSON:
{
  "h1": "Article title",
  "sections": [
    {
      "heading": "H2 heading",
      "purpose": "What this section does",
      "points": ["Point 1", "Point 2"]
    }
  ]
}`;

  try {
    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: parsed.h1 || "",
      sections: parsed.sections || [],
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Outline Error]", error);
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Outline generation failed."));
  }
}