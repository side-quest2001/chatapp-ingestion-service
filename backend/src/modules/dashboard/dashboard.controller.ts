import type { Request, Response } from "express";

import { latencyQuerySchema, recentLogsQuerySchema } from "./dashboard.schema";
import { dashboardService } from "./dashboard.service";

const getSummary = async (_request: Request, response: Response) => {
  const summary = await dashboardService.getSummary();

  response.status(200).json({
    success: true,
    data: summary,
  });
};

const getRecentLogs = async (request: Request, response: Response) => {
  const query = recentLogsQuerySchema.parse(request.query);
  const logs = await dashboardService.getRecentLogs(query);

  response.status(200).json({
    success: true,
    data: logs,
  });
};

const getLatencySeries = async (request: Request, response: Response) => {
  const query = latencyQuerySchema.parse(request.query);
  const latencySeries = await dashboardService.getLatencySeries(query);

  response.status(200).json({
    success: true,
    data: latencySeries,
  });
};

const getStatusBreakdown = async (_request: Request, response: Response) => {
  const statusBreakdown = await dashboardService.getStatusBreakdown();

  response.status(200).json({
    success: true,
    data: statusBreakdown,
  });
};

const getProviderBreakdown = async (_request: Request, response: Response) => {
  const providerBreakdown = await dashboardService.getProviderBreakdown();

  response.status(200).json({
    success: true,
    data: providerBreakdown,
  });
};

export const dashboardController = {
  getSummary,
  getRecentLogs,
  getLatencySeries,
  getStatusBreakdown,
  getProviderBreakdown,
};
