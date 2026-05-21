import { Activity, CircleX, Gauge, Hash, Sigma } from "lucide-react";
import { useEffect, useState } from "react";

import { dashboardApi } from "../api/dashboard.api";
import type {
  DashboardSummary,
  LatencyPoint,
  ProviderBreakdownItem,
  RecentInferenceLog,
  StatusBreakdownItem,
} from "../api/types";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { EmptyDashboardState } from "../components/dashboard/EmptyDashboardState";
import { LatencyChart } from "../components/dashboard/LatencyChart";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ProviderBreakdownTable } from "../components/dashboard/ProviderBreakdownTable";
import { RecentLogsTable } from "../components/dashboard/RecentLogsTable";
import { StatusBreakdown } from "../components/dashboard/StatusBreakdown";

const formatNumber = (value: number) => value.toLocaleString();

type DashboardMetricsState = {
  summary: DashboardSummary | null;
  latency: LatencyPoint[];
  statusBreakdown: StatusBreakdownItem[];
  providerBreakdown: ProviderBreakdownItem[];
  recentLogs: RecentInferenceLog[];
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardMetricsState>({
    summary: null,
    latency: [],
    statusBreakdown: [],
    providerBreakdown: [],
    recentLogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "SUCCESS" | "ERROR" | "CANCELLED"
  >("ALL");
  const [providerFilter, setProviderFilter] = useState("");

  const loadDashboard = async (
    nextStatusFilter: "ALL" | "SUCCESS" | "ERROR" | "CANCELLED" = statusFilter,
    nextProviderFilter = providerFilter,
  ) => {
    setIsLoading(true);

    try {
      const [summary, latency, statusBreakdown, providerBreakdown, recentLogs] =
        await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getLatencySeries(),
          dashboardApi.getStatusBreakdown(),
          dashboardApi.getProviderBreakdown(),
          dashboardApi.getRecentLogs({
            limit: 20,
            status: nextStatusFilter === "ALL" ? undefined : nextStatusFilter,
            provider: nextProviderFilter.trim() || undefined,
          }),
        ]);

      setData({
        summary,
        latency,
        statusBreakdown,
        providerBreakdown,
        recentLogs,
      });
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load dashboard data.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard(statusFilter, providerFilter);
  }, [statusFilter, providerFilter]);

  const summary = data.summary;
  const isEmpty = !summary || summary.totalRequests === 0;

  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-6 text-slate-950 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <DashboardHeader onRefresh={() => void loadDashboard()} isRefreshing={isLoading} />

        {errorMessage ? (
          <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isEmpty && !isLoading ? (
          <EmptyDashboardState />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                label="Total Requests"
                value={formatNumber(summary?.totalRequests ?? 0)}
                detail={`${formatNumber(summary?.successCount ?? 0)} successful requests`}
                icon={<Activity className="h-5 w-5" />}
              />
              <MetricCard
                label="Success Rate"
                value={`${summary?.successRate ?? 0}%`}
                detail={`${formatNumber(summary?.cancelledCount ?? 0)} cancelled`}
                icon={<Gauge className="h-5 w-5" />}
              />
              <MetricCard
                label="Average Latency"
                value={`${summary?.averageLatencyMs ?? 0} ms`}
                detail="Across all inference logs"
                icon={<Sigma className="h-5 w-5" />}
              />
              <MetricCard
                label="Total Tokens"
                value={formatNumber(summary?.totalTokens ?? 0)}
                detail={`${formatNumber(summary?.totalPromptTokens ?? 0)} prompt / ${formatNumber(summary?.totalCompletionTokens ?? 0)} completion`}
                icon={<Hash className="h-5 w-5" />}
              />
              <MetricCard
                label="Error Count"
                value={formatNumber(summary?.errorCount ?? 0)}
                detail={`${formatNumber(summary?.providerCount ?? 0)} providers, ${formatNumber(summary?.modelCount ?? 0)} models`}
                icon={<CircleX className="h-5 w-5" />}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
              <LatencyChart data={data.latency} isLoading={isLoading} />
              <StatusBreakdown data={data.statusBreakdown} isLoading={isLoading} />
            </div>

            <ProviderBreakdownTable
              data={data.providerBreakdown}
              isLoading={isLoading}
            />

            <RecentLogsTable
              logs={data.recentLogs}
              providerFilter={providerFilter}
              statusFilter={statusFilter}
              onProviderFilterChange={setProviderFilter}
              onStatusFilterChange={setStatusFilter}
              isLoading={isLoading}
            />
          </>
        )}

        {isLoading && !summary ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm shadow-slate-200/60">
            Loading dashboard metrics...
          </div>
        ) : null}

        {!isLoading && isEmpty ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm shadow-slate-200/60">
            Recent logs and provider diagnostics will appear here once inference
            traffic starts flowing.
          </div>
        ) : null}
      </div>
    </section>
  );
}
