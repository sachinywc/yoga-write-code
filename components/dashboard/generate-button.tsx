"use client";

import { useTransition } from "react";

export function GenerateButton({
  action,
  label,
  pendingLabel,
  hiddenFields,
}: {
  action: (formData: FormData) => Promise<void>;
  label: string;
  pendingLabel: string;
  hiddenFields?: Record<string, string>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="flex items-center gap-3"
    >
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? pendingLabel : label}
      </button>
      {pending ? (
        <span className="animate-pulse text-sm text-ink-muted">Working…</span>
      ) : null}
    </form>
  );
}