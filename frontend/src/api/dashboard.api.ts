import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  DashboardSummary,
  LatencyPoint,
  ProviderBreakdownItem,
  RecentInferenceLog,
  StatusBreakdownItem,
} from "./types";

type RecentLogsFilters = {
  limit?: number;
  status?: "SUCCESS" | "ERROR" | "CANCELLED";
  provider?: string;
  model?: string;
};

type LatencyFilters = {
  bucket?: "minute" | "hour" | "day";
  limit?: number;
};

const createQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const dashboardApi = {
  getSummary: async () => {
    const response = await apiClient<ApiSuccessResponse<DashboardSummary>>(
      "/dashboard/summary",
    );
    return response.data;
  },
  getRecentLogs: async (filters: RecentLogsFilters = {}) => {
    const queryString = createQueryString({
      limit: filters.limit ?? 20,
      status: filters.status,
      provider: filters.provider,
      model: filters.model,
    });

    const response = await apiClient<ApiSuccessResponse<RecentInferenceLog[]>>(
      `/dashboard/recent-logs${queryString}`,
    );
    return response.data;
  },
  getLatencySeries: async (filters: LatencyFilters = {}) => {
    const queryString = createQueryString({
      bucket: filters.bucket ?? "hour",
      limit: filters.limit ?? 24,
    });

    const response = await apiClient<ApiSuccessResponse<LatencyPoint[]>>(
      `/dashboard/latency${queryString}`,
    );
    return response.data;
  },
  getStatusBreakdown: async () => {
    const response = await apiClient<ApiSuccessResponse<StatusBreakdownItem[]>>(
      "/dashboard/status-breakdown",
    );
    return response.data;
  },
  getProviderBreakdown: async () => {
    const response = await apiClient<ApiSuccessResponse<ProviderBreakdownItem[]>>(
      "/dashboard/provider-breakdown",
    );
    return response.data;
  },
};
