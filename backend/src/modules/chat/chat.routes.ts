import { Router } from "express";

import { chatController } from "./chat.controller";

const chatRouter = Router();

chatRouter.post("/:conversationId/messages", chatController.sendMessage);
chatRouter.post("/:conversationId/stream", chatController.streamMessage);

export { chatRouter };
