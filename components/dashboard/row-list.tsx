export type RowListItem = {
  title: string;
  meta?: string;
  hint?: string;
};

export function RowList({ rows }: { rows: RowListItem[] }) {
  return (
    <ul className="mt-8 divide-y divide-line border-y border-line">
      {rows.map((row, i) => (
        <li key={`${row.title}-${i}`} className="flex items-baseline justify-between gap-6 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{row.title}</p>
            {row.hint ? <p className="mt-1 text-sm text-ink-muted">{row.hint}</p> : null}
          </div>
          {row.meta ? (
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
              {row.meta}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}