import { RefreshCw } from "lucide-react";

type DashboardHeaderProps = {
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function DashboardHeader({
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 rounded-[2.25rem] border border-slate-200 bg-white px-8 py-7 shadow-sm shadow-slate-200/70 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">
          Observability
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Inference Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          Monitor latency, token usage, request volume, and provider health.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/50 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </header>
  );
}
