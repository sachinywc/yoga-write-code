"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateSection } from "@/lib/ai/sections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ArticleDraft = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DraftSection = {
  heading: string;
  purpose: string;
  points: string[];
  content: string;
};

async function authProject(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).single();
  if (!project) redirect("/dashboard");
  return { supabase, project };
}

export async function createDraft(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase } = await authProject(projectId);

  const { data: outline } = await supabase
    .from("article_outlines")
    .select("*")
    .eq("project_id", projectId)
    .limit(1)
    .maybeSingle();

  const title = String(outline?.title ?? "Untitled draft");
  const outlineSections = (outline?.sections ?? []) as { heading: string; purpose: string; points: string[] }[];

  const sections: DraftSection[] = outlineSections.map((s) => ({
    heading: s.heading,
    purpose: s.purpose,
    points: s.points,
    content: "",
  }));

  const { error } = await supabase.from("article_drafts").insert({
    project_id: projectId,
    title,
    content: JSON.stringify({ sections }),
  });

  if (error) {
    redirect(`/dashboard/projects/${projectId}/editor?error=` + encodeURIComponent("Could not create the draft."));
  }

  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  revalidatePath("/dashboard/content");
  redirect(`/dashboard/projects/${projectId}/editor`);
}

export async function saveDraft(formData: FormData) {
  const draftId = String(formData.get("draftId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const title = String(formData.get("title") ?? "").trim() || "Untitled draft";

  const { supabase } = await authProject(projectId);

  let sections: DraftSection[] = [];
  try {
    const meta = JSON.parse(String(formData.get("meta") ?? "[]")) as {
      heading: string;
      purpose: string;
      points: string[];
    }[];
    sections = meta.map((m, i) => ({
      heading: m.heading,
      purpose: m.purpose,
      points: m.points,
      content: String(formData.get(`section-${i}`) ?? ""),
    }));
  } catch {
    sections = [];
  }

  const { error } = await supabase
    .from("article_drafts")
    .update({ title, content: JSON.stringify({ sections }) })
    .eq("id", draftId)
    .eq("project_id", projectId);

  if (error) {
    redirect(`/dashboard/projects/${projectId}/editor?error=` + encodeURIComponent("Could not save the draft."));
  }

  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  revalidatePath("/dashboard/content");
  redirect(`/dashboard/projects/${projectId}/editor?saved=1`);
}

export async function deleteDraft(formData: FormData) {
  const draftId = String(formData.get("draftId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase } = await authProject(projectId);
  await supabase.from("article_drafts").delete().eq("id", draftId).eq("project_id", projectId);
  revalidatePath("/dashboard/content");
  redirect("/dashboard/content");
}

export async function draftSection(
  formData: FormData
): Promise<{ ok: boolean; text?: string; error?: string }> {
  const projectId = String(formData.get("projectId") ?? "");
  const { project } = await authProject(projectId);

  const input = {
    websiteUrl: String(project.website_url),
    heading: String(formData.get("heading") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    points: JSON.parse(String(formData.get("points") ?? "[]")) as string[],
    mode: "draft" as const,
  };

  try {
    const text = await generateSection(input);
    return { ok: true, text };
  } catch {
    return { ok: false, error: "Couldn't draft this section right now. Try again." };
  }
}

export async function improveSection(
  formData: FormData
): Promise<{ ok: boolean; text?: string; error?: string }> {
  const projectId = String(formData.get("projectId") ?? "");
  const { project } = await authProject(projectId);

  const input = {
    websiteUrl: String(project.website_url),
    heading: String(formData.get("heading") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    points: JSON.parse(String(formData.get("points") ?? "[]")) as string[],
    current: String(formData.get("current") ?? ""),
    mode: "improve" as const,
  };

  try {
    const text = await generateSection(input);
    return { ok: true, text };
  } catch {
    return { ok: false, error: "Couldn't rewrite this section right now. Try again." };
  }
}