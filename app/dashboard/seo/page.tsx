import type { Metadata } from "next";
import { generateBrief } from "@/app/dashboard/projects/[id]/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Opportunities" };

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function intentTone(intent: string) {
  if (intent === "commercial") return "brand" as const;
  if (intent === "informational") return "info" as const;
  if (intent === "transactional") return "success" as const;
  return "neutral" as const;
}

function difficultyDot(difficulty: string) {
  if (difficulty === "low") return "bg-success";
  if (difficulty === "medium") return "bg-warning";
  return "bg-error";
}

type OppRow = {
  id: string;
  title: string;
  reason: string;
  opportunity_score: number;
  search_intent: string;
  funnel_stage: string;
  difficulty: string;
  projects: { id: string; name: string } | null;
};

export default async function SeoPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("content_opportunities")
    .select(
      "id, title, reason, opportunity_score, search_intent, funnel_stage, difficulty, projects ( id, name )"
    )
    .order("opportunity_score", { ascending: false })
    .limit(25);

  const rows = (data ?? []).map((row) => ({
    ...row,
    projects: row.projects?.[0] ?? null,
  })) as OppRow[];

  return (
    <div className="min-w-0">
      <PageHeader
        title="Opportunities"
        description="Your highest-scoring content opportunities across all projects."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing ranked yet"
          message="Run a website analysis and your opportunities will be ranked here."
        />
      ) : (
        <section className="mt-8 min-w-0 rounded-card border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-muted">
                  <th className="px-5 py-3 font-medium">Topic</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Intent</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Difficulty</th>
                  <th className="hidden px-3 py-3 font-medium lg:table-cell">Funnel</th>
                  <th className="px-3 py-3 font-medium">Score</th>
                  <th className="hidden px-3 py-3 font-medium xl:table-cell">Why it matters</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-surface-subtle">
                    <td className="max-w-65 px-5 py-3">
                      <p className="truncate font-medium text-ink">{o.title}</p>
                      <p className="truncate text-xs text-ink-muted">{o.projects?.name}</p>
                    </td>
                    <td className="hidden px-3 py-3 md:table-cell">
                      <Badge tone={intentTone(o.search_intent)}>{o.search_intent}</Badge>
                    </td>
                    <td className="hidden px-3 py-3 md:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
                        <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot(o.difficulty)}`} />
                        {cap(o.difficulty)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 lg:table-cell">
                      <Badge tone="neutral">{o.funnel_stage}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone="brand">{o.opportunity_score}</Badge>
                    </td>
                    <td className="hidden max-w-60 px-3 py-3 xl:table-cell">
                      <p className="truncate text-xs text-ink-secondary" title={o.reason}>
                        {o.reason}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <form action={generateBrief} className="inline">
                        <input type="hidden" name="projectId" value={o.projects?.id ?? ""} />
                        <input type="hidden" name="opportunityId" value={o.id} />
                        <button type="submit" className="text-xs font-medium text-brand hover:underline">
                          Generate brief
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-xs text-ink-muted">
            Score reflects relevance, impact, and feasibility from the AI analysis.
          </p>
        </section>
      )}
    </div>
  );
}