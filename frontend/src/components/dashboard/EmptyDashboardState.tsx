import { BarChart3 } from "lucide-react";

export function EmptyDashboardState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[2.25rem] border border-dashed border-slate-300 bg-white px-10 py-12 text-center shadow-sm shadow-slate-200/60">
      <div className="max-w-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-cyan-300">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          No inference logs yet
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Once the backend records LLM requests, this dashboard will populate with
          latency, provider health, and token usage analytics.
        </p>
      </div>
    </div>
  );
}
