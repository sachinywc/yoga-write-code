import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const rows = [
    { label: "Account", value: data.user?.email ?? "Unknown" },
    { label: "Plan", value: "Free" },
    { label: "AI provider", value: process.env.AI_MODE ?? "mock" },
    { label: "AI region", value: process.env.AI_MODE === "bedrock" ? (process.env.AWS_REGION ?? "us-east-1") : "—" },
  ];

  return (
    <>
      <PageHeader title="Settings" description="Your account and workspace configuration." />
      <section className="mt-8 max-w-xl">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-stone-400">
          Workspace
        </h2>
        <dl className="mt-3 divide-y divide-stone-200 border-y border-stone-200">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between py-4">
              <dt className="text-sm text-stone-600">{row.label}</dt>
              <dd className="text-sm font-medium text-stone-900">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-stone-500">Editing arrives with a future update.</p>
      </section>
    </>
  );
}