import { Router } from "express";

import { conversationController } from "./conversation.controller";

const conversationRouter = Router();

conversationRouter.post("/", conversationController.createConversation);
conversationRouter.get("/", conversationController.listConversations);
conversationRouter.get("/:conversationId", conversationController.getConversation);
conversationRouter.patch(
  "/:conversationId/cancel",
  conversationController.cancelConversation,
);

export { conversationRouter };
