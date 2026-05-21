import type { Request, Response } from "express";

import { dashboardService } from "./dashboard.service";

const getSummary = async (_request: Request, response: Response) => {
  const summary = await dashboardService.getSummary();

  response.status(200).json({
    success: true,
    data: summary,
  });
};

export const dashboardController = {
  getSummary,
};
