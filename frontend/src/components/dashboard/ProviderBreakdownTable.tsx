import type { ProviderBreakdownItem } from "../../api/types";

type ProviderBreakdownTableProps = {
  data: ProviderBreakdownItem[];
  isLoading?: boolean;
};

export function ProviderBreakdownTable({
  data,
  isLoading = false,
}: ProviderBreakdownTableProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Provider health
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          Provider and model performance
        </h2>
      </div>

      {isLoading ? (
        <div className="flex h-[280px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
          Loading provider breakdown...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Requests</th>
                  <th className="px-4 py-3">Avg Latency</th>
                  <th className="px-4 py-3">Errors</th>
                  <th className="px-4 py-3">Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {data.map((item) => (
                  <tr key={`${item.provider}-${item.model}`}>
                    <td className="px-4 py-3 font-semibold text-slate-950">
                      {item.provider}
                    </td>
                    <td className="px-4 py-3">{item.model}</td>
                    <td className="px-4 py-3">{item.requestCount}</td>
                    <td className="px-4 py-3">{item.averageLatencyMs} ms</td>
                    <td className="px-4 py-3">{item.errorCount}</td>
                    <td className="px-4 py-3">
                      {item.totalTokens.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
