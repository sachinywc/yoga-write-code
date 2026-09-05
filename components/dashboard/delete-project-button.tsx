"use client";

import { useState, useTransition } from "react";
import { deleteProject } from "@/lib/projects/actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-medium text-ink-muted transition-colors hover:text-error"
      >
        Delete
      </button>
    );
  }

  return (
    <form
      action={(formData) => startTransition(() => deleteProject(formData))}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <button type="submit" disabled={pending} className="text-xs font-medium text-error">
        {pending ? "Deleting…" : "Confirm delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-ink-muted hover:text-ink"
      >
        Cancel
      </button>
    </form>
  );
}