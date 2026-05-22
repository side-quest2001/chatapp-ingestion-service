import { BarChart3 } from "lucide-react";

import { EmptyState } from "../../../components/ui/EmptyState";

export function EmptyDashboardState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[2.25rem] border border-dashed border-slate-300 bg-white px-10 py-12 text-center shadow-sm shadow-slate-200/60">
      <EmptyState
        title="No inference logs yet"
        description="Once the backend records LLM requests, this dashboard will populate with latency, provider health, and token usage analytics."
        className="max-w-xl"
        icon={
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-cyan-300">
            <BarChart3 className="h-7 w-7" />
          </div>
        }
      />
    </div>
  );
}
