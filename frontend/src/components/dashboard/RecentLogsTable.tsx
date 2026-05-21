import type { ChangeEvent } from "react";

import type { RecentInferenceLog } from "../../api/types";

type RecentLogsTableProps = {
  logs: RecentInferenceLog[];
  providerFilter: string;
  statusFilter: "ALL" | "SUCCESS" | "ERROR" | "CANCELLED";
  onProviderFilterChange: (value: string) => void;
  onStatusFilterChange: (
    value: "ALL" | "SUCCESS" | "ERROR" | "CANCELLED",
  ) => void;
  isLoading?: boolean;
};

const statusStyles: Record<RecentInferenceLog["status"], string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  ERROR: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-amber-100 text-amber-700",
};

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function RecentLogsTable({
  logs,
  providerFilter,
  statusFilter,
  onProviderFilterChange,
  onStatusFilterChange,
  isLoading = false,
}: RecentLogsTableProps) {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStatusFilterChange(
      event.target.value as "ALL" | "SUCCESS" | "ERROR" | "CANCELLED",
    );
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Recent logs
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Latest inference activity
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="sr-only">Status filter</span>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="bg-transparent text-sm text-slate-700 outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="ERROR">Error</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="sr-only">Provider filter</span>
            <input
              value={providerFilter}
              onChange={(event) => onProviderFilterChange(event.target.value)}
              placeholder="Filter provider"
              className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 flex h-[260px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
          Loading recent logs...
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Tokens</th>
                  <th className="px-4 py-3">Input Preview</th>
                  <th className="px-4 py-3">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-950">
                      {log.provider}
                    </td>
                    <td className="px-4 py-3">{log.model}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[log.status]}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{log.latencyMs} ms</td>
                    <td className="px-4 py-3">{log.totalTokens ?? 0}</td>
                    <td className="max-w-[320px] px-4 py-3 text-slate-500">
                      <div className="truncate">{log.inputPreview || "-"}</div>
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-slate-500">
                      <div className="truncate">{log.errorMessage || "-"}</div>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No logs matched the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
