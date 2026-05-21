import { Router } from "express";

import { chatController } from "./chat.controller";

const chatRouter = Router();

chatRouter.post("/:conversationId/messages", chatController.sendMessage);

export { chatRouter };
