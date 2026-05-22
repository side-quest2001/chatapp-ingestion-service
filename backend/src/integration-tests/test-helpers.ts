import { prisma } from "../db/prisma";

export const cleanupDatabase = async () => {
  await prisma.inferenceLog.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.conversation.deleteMany();
};

export { prisma };
