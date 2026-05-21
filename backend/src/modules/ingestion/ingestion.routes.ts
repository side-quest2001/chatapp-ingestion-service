import { Router } from "express";

import { ingestionController } from "./ingestion.controller";

const ingestionRouter = Router();

ingestionRouter.post("/inference-logs", ingestionController.createInferenceLog);

export { ingestionRouter };
