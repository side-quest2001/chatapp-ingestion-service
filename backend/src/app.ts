import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { healthRouter } from "./routes/health.routes";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/api/health", healthRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
