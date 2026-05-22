import type { ChatMessage } from "../../../api/types";
import { formatMessageTime, splitMessageContent } from "../utils/messageFormatting";

type MessageBubbleProps = {
  message?: ChatMessage;
  role?: "USER" | "ASSISTANT" | "SYSTEM";
  content?: string;
  pending?: boolean;
};

const renderMessageContent = (content: string) =>
  splitMessageContent(content).map((segment, index) => {
    if (segment.type === "text") {
      return (
        <p key={`text-${index}`} className="whitespace-pre-wrap leading-7">
          {segment.content}
        </p>
      );
    }

    return (
      <div
        key={`code-${index}`}
        className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        <div className="border-b border-slate-200 px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
          {segment.language || "Code"}
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-slate-700">
          <code>{segment.content}</code>
        </pre>
      </div>
    );
  });

export function MessageBubble({
  message,
  role,
  content,
  pending = false,
}: MessageBubbleProps) {
  const resolvedRole = message?.role ?? role ?? "ASSISTANT";
  const resolvedContent = message?.content ?? content ?? "";
  const resolvedCreatedAt = message?.createdAt ?? null;
  const isUser = resolvedRole === "USER";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-message-in`}
    >
      <article
        className={`max-w-[90%] rounded-[1.75rem] px-5 py-4 shadow-sm transition-all duration-200 ease-out sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md border border-indigo-100 bg-indigo-50 text-slate-950"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
              isUser ? "text-indigo-700" : "text-slate-500"
            }`}
          >
            {isUser ? "You" : resolvedRole === "SYSTEM" ? "System" : "Assistant"}
          </span>
          {resolvedCreatedAt ? (
            <span
              className={`text-xs ${isUser ? "text-indigo-500" : "text-slate-400"}`}
            >
              {formatMessageTime(resolvedCreatedAt)}
            </span>
          ) : pending ? (
            <span
              className={`text-xs ${isUser ? "text-indigo-500" : "text-slate-400"}`}
            >
              Sending...
            </span>
          ) : null}
        </div>

        <div className={`text-sm ${isUser ? "text-slate-950" : "text-slate-700"}`}>
          {renderMessageContent(resolvedContent)}
        </div>
      </article>
    </div>
  );
}
