import { RefreshCw } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

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

      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        variant="primary"
        className="bg-slate-950 shadow-lg shadow-slate-300/50 hover:bg-slate-900 disabled:opacity-60"
      >
        {isRefreshing ? <Spinner /> : <RefreshCw className="h-4 w-4" />}
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </header>
  );
}
