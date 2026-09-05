"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[login]", error.message);
    redirect("/login?error=" + encodeURIComponent(error.message)); // TEMP DEBUG
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    redirect("/signup?error=" + encodeURIComponent("Password must be at least 6 characters."));
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("[signup]", error.message);
    redirect("/signup?error=" + encodeURIComponent(error.message)); // TEMP DEBUG
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}