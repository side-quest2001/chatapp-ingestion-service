import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { chatRouter } from "./modules/chat/chat.routes";
import { conversationRouter } from "./modules/conversations/conversation.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { initializeInferenceLogSubscribers } from "./modules/events/inference-log.events";
import { ingestionRouter } from "./modules/ingestion/ingestion.routes";
import { healthRouter } from "./routes/health.routes";

initializeInferenceLogSubscribers();

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/api/health", healthRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ingestion", ingestionRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
