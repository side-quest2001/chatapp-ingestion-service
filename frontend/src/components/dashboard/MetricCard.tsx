import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          {detail ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-2xl bg-slate-950 p-3 text-cyan-300">{icon}</div>
        ) : null}
      </div>
    </article>
  );
}
