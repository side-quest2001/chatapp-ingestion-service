import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { LatencyPoint } from "../../../api/types";

type LatencyChartProps = {
  data: LatencyPoint[];
  isLoading?: boolean;
};

const formatBucket = (bucket: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
  }).format(new Date(bucket));

export function LatencyChart({
  data,
  isLoading = false,
}: LatencyChartProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Latency over time
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          Average response latency
        </h2>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
          Loading latency chart...
        </div>
      ) : (
        <div className="h-[300px] rounded-[1.5rem] bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis
                dataKey="bucket"
                tickFormatter={formatBucket}
                minTickGap={24}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `${value}ms`}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
                labelFormatter={(value) => formatBucket(String(value))}
                formatter={(value) => [`${String(value)} ms`, "Avg Latency"]}
              />
              <Line
                type="monotone"
                dataKey="averageLatencyMs"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 3, fill: "#06b6d4" }}
                activeDot={{ r: 5, fill: "#0891b2" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
