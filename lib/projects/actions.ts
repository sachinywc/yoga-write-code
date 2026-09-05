"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Enter a project name."),
  website_url: z.string().trim().url("Enter a valid URL, e.g. https://acme.com"),
});

export async function createProject(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    website_url: formData.get("website_url"),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect("/dashboard/projects/new?error=" + encodeURIComponent(message));
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userData.user.id,
      name: parsed.data.name,
      website_url: parsed.data.website_url,
    })
    .select("id")
    .single();

  if (error) {
    redirect("/dashboard/projects/new?error=" + encodeURIComponent("Could not save the project. Try again."));
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${data.id}`);
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userData.user.id);

  if (error) {
    redirect("/dashboard?error=" + encodeURIComponent("Could not delete the project."));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/content");
  revalidatePath("/dashboard/seo");
  redirect("/dashboard");
}