"use client";

import { useTransition } from "react";
import { saveDraft } from "@/app/dashboard/projects/[id]/editor/actions";
import { inputClass } from "@/components/form";

export function DraftEditor({
  draftId,
  projectId,
  initialTitle,
  initialContent,
}: {
  draftId: string;
  projectId: string;
  initialTitle: string;
  initialContent: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => saveDraft(formData))}
      className="mt-6 max-w-3xl space-y-4"
    >
      <input type="hidden" name="draftId" value={draftId} />
      <input type="hidden" name="projectId" value={projectId} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">
          Title
        </label>
        <input id="title" name="title" defaultValue={initialTitle} className={inputClass} />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-stone-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={18}
          defaultValue={initialContent}
          className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-900 focus:border-stone-900 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
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