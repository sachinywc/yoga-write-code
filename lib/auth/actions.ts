"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Keep your existing login/signup/signOut actions here.

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();

  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=" + encodeURIComponent("Could not start Google sign in."));
  }

  redirect(data.url);
}