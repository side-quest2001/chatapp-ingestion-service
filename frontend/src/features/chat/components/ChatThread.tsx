import { useEffect, useRef } from "react";

import type { ChatMessage } from "../../../api/types";
import { MessageBubble } from "./MessageBubble";

type ChatThreadProps = {
  messages: ChatMessage[];
  activeConversationId: string;
  isSending?: boolean;
  isLoading?: boolean;
};

export function ChatThread({
  messages,
  activeConversationId,
  isSending = false,
  isLoading = false,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const previousConversationIdRef = useRef(activeConversationId);
  const lastMessageKey =
    messages.at(-1)?.id ?? messages.at(-1)?.createdAt ?? String(messages.length);

  useEffect(() => {
    const didSwitchConversation =
      previousConversationIdRef.current !== activeConversationId;
    previousConversationIdRef.current = activeConversationId;

    const frame = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: didSwitchConversation ? "auto" : "smooth",
        block: "end",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeConversationId, isLoading, isSending, lastMessageKey]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
