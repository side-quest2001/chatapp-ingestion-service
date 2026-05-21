import type { ChatMessage } from "../../api/types";
import { MessageBubble } from "./MessageBubble";

type ChatThreadProps = {
  messages: ChatMessage[];
};

export function ChatThread({ messages }: ChatThreadProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
