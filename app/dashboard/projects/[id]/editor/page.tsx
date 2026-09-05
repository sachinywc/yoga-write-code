import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenerateButton } from "@/components/dashboard/generate-button";
import { FormError } from "@/components/form";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createDraft, type ArticleDraft } from "./actions";

export const metadata: Metadata = { title: "Editor" };

type EditorSection = {
  heading: string;
  purpose: string;
  points: string[];
  content: string;
};

function SectionEditor({
  initialTitle,
  sections,
}: {
  draftId: string;
  projectId: string;
  initialTitle: string;
  sections: EditorSection[];
}) {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-stone-900">{initialTitle}</h2>
      {sections.map((section, index) => (
        <section key={`${section.heading}-${index}`} className="space-y-2">
          <h3 className="text-lg font-medium text-stone-900">{section.heading}</h3>
          {section.purpose ? <p className="text-sm text-stone-500">{section.purpose}</p> : null}
          <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">{section.content}</p>
        </section>
      ))}
    </div>
  );
}

function parseSections(content: string): EditorSection[] {
  try {
    const doc = JSON.parse(content) as { sections?: EditorSection[] };
    if (Array.isArray(doc.sections) && doc.sections.length > 0) return doc.sections;
  } catch {
    // legacy plain-text draft
  }
  return [{ heading: "Full draft", purpose: "", points: [], content }];
}

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase.from("projects").select("name").eq("id", id).single();
  if (!project) notFound();

  const { data: draft } = await supabase
    .from("article_drafts")
    .select("*")
    .eq("project_id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: outline } = await supabase
    .from("article_outlines")
    .select("id")
    .eq("project_id", id)
    .limit(1)
    .maybeSingle();

  return (
    <>
      <PageHeader
        title={`Editor — ${project.name}`}
        description="Draft each section yourself or with AI — everything saves to your database."
      />
      <FormError message={error} />
      {saved ? (
        <p className="mt-4 border-l-2 border-green-700 pl-3 text-sm text-green-700">Draft saved.</p>
      ) : null}

      {draft ? (
        <SectionEditor
          draftId={(draft as ArticleDraft).id}
          projectId={id}
          initialTitle={(draft as ArticleDraft).title}
          sections={parseSections((draft as ArticleDraft).content)}
        />
      ) : outline ? (
        <div className="mt-8">
          <GenerateButton
            action={createDraft}
            label="Create draft from outline"
            pendingLabel="Creating draft…"
            hiddenFields={{ projectId: id }}
          />
        </div>
      ) : (
        <p className="mt-8 text-sm text-stone-500">
          Generate an outline first (project page, Step 5), then come back to create a draft.
        </p>
      )}
    </>
  );
}