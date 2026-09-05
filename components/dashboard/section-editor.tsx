"use client";

import { useState, useTransition } from "react";
import { draftSection, improveSection, saveDraft } from "@/app/dashboard/projects/[id]/editor/actions";
import { inputClass } from "@/components/form";

export type EditorSection = {
  heading: string;
  purpose: string;
  points: string[];
  content: string;
};

export function SectionEditor({
  draftId,
  projectId,
  initialTitle,
  sections,
}: {
  draftId: string;
  projectId: string;
  initialTitle: string;
  sections: EditorSection[];
}) {
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<string[]>(sections.map((s) => s.content));
  const [busy, setBusy] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const runAI = (index: number, mode: "draft" | "improve") => {
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("heading", sections[index].heading);
    formData.set("purpose", sections[index].purpose);
    formData.set("points", JSON.stringify(sections[index].points));
    if (mode === "improve") formData.set("current", values[index]);

    setBusy(index);
    setNotice(null);
    startTransition(async () => {
      const res = mode === "draft" ? await draftSection(formData) : await improveSection(formData);
      if (res.ok && typeof res.text === "string") {
        setValues((old) => old.map((v, i) => (i === index ? res.text! : v)));
      } else {
        setNotice(res.error ?? "AI request failed.");
      }
      setBusy(null);
    });
  };

  return (
    <form action={saveDraft} className="mt-6 max-w-3xl space-y-8">
      <input type="hidden" name="draftId" value={draftId} />
      <input type="hidden" name="projectId" value={projectId} />
      <input
        type="hidden"
        name="meta"
        value={JSON.stringify(
          sections.map(({ heading, purpose, points }) => ({ heading, purpose, points }))
        )}
      />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">
          Title
        </label>
        <input id="title" name="title" defaultValue={initialTitle} className={inputClass} />
      </div>

      {sections.map((section, i) => (
        <section key={section.heading + i} className="border-t border-stone-200 pt-5">
          <p className="text-sm font-medium text-stone-900">{section.heading}</p>
          {section.purpose ? (
            <p className="mt-1 text-xs text-stone-500">{section.purpose}</p>
          ) : null}
          <textarea
            name={`section-${i}`}
            rows={8}
            value={values[i]}
            onChange={(e) =>
              setValues((old) => old.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            placeholder="Draft this section yourself, or let AI write it."
            className="mt-3 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-900 focus:border-stone-900 focus:outline-none"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={busy === i}
              onClick={() => runAI(i, "draft")}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy === i ? "Working…" : "Draft with AI"}
            </button>
            <button
              type="button"
              disabled={busy === i || !values[i]}
              onClick={() => runAI(i, "improve")}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100 disabled:cursor-wait disabled:opacity-60"
            >
              Rewrite with AI
            </button>
          </div>
        </section>
      ))}

      {notice ? (
        <p className="border-l-2 border-red-600 pl-3 text-sm text-red-700">{notice}</p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-stone-200 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save draft"}
        </button>
        {pending ? (
          <span className="animate-pulse text-sm text-stone-500">Writing to database…</span>
        ) : null}
      </div>
    </form>
  );
}