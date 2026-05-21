import { Router } from "express";

import { dashboardController } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardController.getSummary);

export { dashboardRouter };
