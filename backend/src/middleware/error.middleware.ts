import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type AppError = Error & {
  statusCode?: number;
};

export const errorMiddleware = (
  error: AppError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(", ");

    response.status(400).json({
      success: false,
      message,
    });

    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode >= 500 ? "Internal server error" : error.message || "Request failed";

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
  });
};
