import { Router } from "express";

import { dashboardController } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardController.getSummary);
dashboardRouter.get("/recent-logs", dashboardController.getRecentLogs);
dashboardRouter.get("/latency", dashboardController.getLatencySeries);
dashboardRouter.get("/status-breakdown", dashboardController.getStatusBreakdown);
dashboardRouter.get("/provider-breakdown", dashboardController.getProviderBreakdown);

export { dashboardRouter };
