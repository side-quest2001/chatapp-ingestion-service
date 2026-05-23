import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";

import type { ChatMessage } from "../../../api/types";
import { MessageBubble } from "./MessageBubble";

type ChatThreadProps = {
  messages: ChatMessage[];
  activeConversationId: string;
  isSending?: boolean;
  isLoading?: boolean;
  pendingUserMessageContent?: string | null;
  streamingAssistantContent?: string | null;
  showAssistantLoading?: boolean;
};

export function ChatThread({
  messages,
  activeConversationId,
  isSending = false,
  isLoading = false,
  pendingUserMessageContent = null,
  streamingAssistantContent = null,
  showAssistantLoading = false,
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
  }, [
    activeConversationId,
    isLoading,
    isSending,
    lastMessageKey,
    messages.length,
    pendingUserMessageContent,
    streamingAssistantContent,
    showAssistantLoading,
  ]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-24 pt-6 sm:px-6 sm:pb-28 sm:pt-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {pendingUserMessageContent ? (
          <MessageBubble pending role="USER" content={pendingUserMessageContent} />
        ) : null}

        {streamingAssistantContent !== null ? (
          <MessageBubble
            pending
            role="ASSISTANT"
            content={
              streamingAssistantContent || "Inference Logger is thinking..."
            }
          />
        ) : null}

        {showAssistantLoading ? (
          <div className="flex justify-start">
            <article className="animate-message-in max-w-[90%] rounded-[1.75rem] rounded-bl-md border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm sm:max-w-[75%]">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Assistant
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <LoaderCircle className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Inference Logger is thinking...</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:240ms]" />
                </span>
              </div>
            </article>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex justify-start">
            <article className="animate-message-in max-w-[90%] rounded-[1.75rem] rounded-bl-md border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm sm:max-w-[75%]">
              Loading conversation...
            </article>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
