import type { StatusBreakdownItem } from "../../api/types";

type StatusBreakdownProps = {
  data: StatusBreakdownItem[];
  isLoading?: boolean;
};

const statusStyles: Record<StatusBreakdownItem["status"], string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  ERROR: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-amber-100 text-amber-700",
};

export function StatusBreakdown({
  data,
  isLoading = false,
}: StatusBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Status breakdown
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          Request outcome mix
        </h2>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
          Loading breakdown...
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);

            return (
              <div
                key={item.status}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {item.count} requests
                  </span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      item.status === "SUCCESS"
                        ? "bg-emerald-500"
                        : item.status === "ERROR"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{percentage}% of traffic</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
