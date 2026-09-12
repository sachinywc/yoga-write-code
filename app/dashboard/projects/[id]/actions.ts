"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).single();
  if (!project) redirect("/dashboard?error=" + encodeURIComponent("Project not found."));

  const url = project.website_url;

  const prompt = `Analyze this SaaS website and extract actionable insights.

Website: ${url}

Extract and return as JSON:
{
  "company_summary": "2-3 sentence summary of what this company does and who it serves",
  "product_category": "Specific SaaS category (e.g., 'Developer tools', 'Sales automation', 'Project management')",
  "target_audience": "Primary user persona with role and pain points",
  "positioning": "How they differentiate from competitors",
  "content_opportunities": [
    {
      "title": "Specific content topic title",
      "description": "What this content would cover",
      "reason": "Why this matters for their specific audience and business goals",
      "opportunity_score": 0-100,
      "search_intent": "informational" | "commercial" | "transactional",
      "funnel_stage": "top" | "middle" | "bottom",
      "difficulty": "low" | "medium" | "high"
    }
  ]
}

Rules:
- Generate 3-5 high-value content opportunities
- Be specific to their actual product and audience (not generic "blog about industry trends")
- Scores should reflect real business impact
- Reasons should explain why this content drives their specific goals`;

  try {
    const result = await invokeBedrock(prompt, 3000);
    const parsed = JSON.parse(result);

    const { data: analysis } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: parsed.company_summary,
        product_category: parsed.product_category,
        target_audience: parsed.target_audience,
        positioning: parsed.positioning,
      })
      .select("id")
      .single();

    if (parsed.content_opportunities?.length) {
      await supabase.from("content_opportunities").insert(
        parsed.content_opportunities.map((opp: any) => ({
          project_id: projectId,
          analysis_id: analysis.id,
          title: opp.title,
          description: opp.description,
          reason: opp.reason,
          opportunity_score: opp.opportunity_score,
          search_intent: opp.search_intent,
          funnel_stage: opp.funnel_stage,
          difficulty: opp.difficulty,
        }))
      );
    }

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Analysis failed. Try again."));
  }
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

  if (!opportunity) redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));

  const prompt = `Create a topic cluster for this content opportunity.

Opportunity: ${opportunity.title}
Description: ${opportunity.description}

Return JSON:
{
  "pillar_topic": "The main comprehensive topic",
  "supporting_topics": ["3-5 specific subtopics that support the pillar"],
  "internal_linking_suggestions": ["2-3 concrete internal linking strategies"]
}

Make the pillar broad enough to be comprehensive but specific enough to be useful.`;

  try {
    const result = await invokeBedrock(prompt);
    const parsed = JSON.parse(result);

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: parsed.pillar_topic,
      supporting_topics: parsed.supporting_topics,
      internal_linking_suggestions: parsed.internal_linking_suggestions,
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
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

  if (!opportunity) redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));

  const prompt = `Create an SEO brief for this content.

Topic: ${opportunity.title}
Context: ${opportunity.description}

Return JSON:
{
  "primary_keyword": "The main target keyword",
  "search_intent": "What the searcher actually wants",
  "target_audience": "Who should read this",
  "suggested_headings": ["5-7 H2/H3 headings that structure the article"],
  "questions_to_answer": ["4-6 specific questions the article must address"],
  "entities_to_mention": ["3-5 specific tools, concepts, or companies to reference"],
  "competitor_insights": "2-3 sentences about what competitors are doing and how to differentiate"
}

Be specific and actionable. The brief should guide a writer to create genuinely useful content.`;

  try {
    const result = await invokeBedrock(prompt);
    const parsed = JSON.parse(result);

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: parsed.primary_keyword,
      search_intent: parsed.search_intent,
      target_audience: parsed.target_audience,
      suggested_headings: parsed.suggested_headings,
      questions_to_answer: parsed.questions_to_answer,
      entities_to_mention: parsed.entities_to_mention,
      competitor_insights: parsed.competitor_insights,
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
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

  const prompt = `Create an editorial article outline.

Primary keyword: ${brief?.primary_keyword ?? "not specified"}
Suggested headings: ${brief?.suggested_headings?.join(", ") ?? "none"}
Questions to answer: ${brief?.questions_to_answer?.join(", ") ?? "none"}

Return JSON:
{
  "h1": "Compelling article title",
  "sections": [
    {
      "heading": "H2 heading",
      "purpose": "What this section accomplishes",
      "points": ["3-5 specific points or subheadings for this section"]
    }
  ]
}

Create 4-6 H2 sections that flow logically. Each section should have clear purpose and concrete points.`;

  try {
    const result = await invokeBedrock(prompt);
    const parsed = JSON.parse(result);

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: parsed.h1,
      sections: parsed.sections,
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Outline generation failed."));
  }
}