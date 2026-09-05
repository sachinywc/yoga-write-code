import type { Metadata } from "next";
import Link from "next/link";
import { createDraft, deleteDraft } from "@/app/dashboard/projects/[id]/editor/actions";
import { DocEditor, type DocSection } from "@/components/dashboard/doc-editor";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Content" };

type DraftRow = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  updated_at: string;
  projects: { id: string; name: string } | null;
};

type OutlineProject = { id: string; name: string; article_outlines: { id: string }[] };

function parseSections(content: string): DocSection[] {
  try {
    const doc = JSON.parse(content) as { sections?: DocSection[] };
    if (Array.isArray(doc.sections) && doc.sections.length > 0) return doc.sections;
  } catch {
    // legacy plain-text draft
  }
  return [{ heading: "Full draft", purpose: "", points: [], content }];
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft: draftId } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("article_drafts")
    .select("*, projects ( id, name )")
    .order("updated_at", { ascending: false });

  const drafts = (data ?? []) as DraftRow[];
  const selected = drafts.find((d) => d.id === draftId) ?? drafts[0] ?? null;

  const { data: projectsData } = await supabase
    .from("projects")
    .select("id, name, article_outlines ( id )")
    .order("updated_at", { ascending: false });

  const withOutlines = ((projectsData ?? []) as OutlineProject[]).filter(
    (p) => (p.article_outlines ?? []).length > 0
  );

  return (
    <div className="min-w-0">
      <PageHeader
        title="Drafts & Editor"
        description="Your drafts, edited like documents — AI inside, publish-ready out."
      />

      {drafts.length === 0 ? (
        <section className="mt-8 rounded-card border border-dashed border-line-strong bg-surface px-8 py-10">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            No drafts yet
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-ink-secondary">
            Create a draft from any project that already has an AI outline — it opens here as a
            document.
          </p>
          {withOutlines.length > 0 ? (
            <form action={createDraft} className="mt-6 flex items-center gap-3">
              <select
                name="projectId"
                className="h-10 rounded-field border border-line bg-surface px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft"
              >
                {withOutlines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Create draft
              </button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-ink-muted">
              No outlines yet — open a project and run Steps 1–5 first, then come back.
            </p>
          )}
        </section>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Drafts</p>
            <ul className="mt-3 space-y-1">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/dashboard/content?draft=${d.id}`}
                    className={
                      selected?.id === d.id
                        ? "block rounded-control bg-brand-soft px-3 py-2 text-sm font-medium text-brand"
                        : "block rounded-control px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
                    }
                  >
                    <span className="block truncate">{d.title}</span>
                    <span className="block truncate text-xs opacity-70">
                      {d.projects?.name ?? "Unknown project"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {selected ? (
              <form action={deleteDraft} className="mt-4">
                <input type="hidden" name="draftId" value={selected.id} />
                <input type="hidden" name="projectId" value={selected.project_id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-error underline underline-offset-4"
                >
                  Delete this draft
                </button>
              </form>
            ) : null}
          </aside>

          <div className="min-w-0">
            {selected ? (
              <DocEditor
                draftId={selected.id}
                projectId={selected.project_id}
                initialTitle={selected.title}
                sections={parseSections(selected.content)}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}