import type { ChatMessage } from "../../api/types";
import { MessageBubble } from "./MessageBubble";

type ChatThreadProps = {
  messages: ChatMessage[];
};

export function ChatThread({ messages }: ChatThreadProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
