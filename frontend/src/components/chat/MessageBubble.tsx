import type { ChatMessage } from "../../api/types";

type MessageBubbleProps = {
  message: ChatMessage;
};

const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const renderMessageContent = (content: string) => {
  const segments = content.split(/```/g);

  return segments.map((segment, index) => {
    const isCode = index % 2 === 1;

    if (!isCode) {
      return (
        <p key={`${segment}-${index}`} className="whitespace-pre-wrap leading-7">
          {segment}
        </p>
      );
    }

    const codeLines = segment.split("\n");
    const firstLine = codeLines[0]?.trim();
    const language = firstLine && !firstLine.includes(" ") ? firstLine : "";
    const code = language ? codeLines.slice(1).join("\n") : segment;

    return (
      <div
        key={`${segment}-${index}`}
        className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        <div className="border-b border-slate-200 px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
          {language || "Code"}
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-slate-700">
          <code>{code.trim()}</code>
        </pre>
      </div>
    );
  });
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[90%] rounded-[1.75rem] px-5 py-4 shadow-sm sm:max-w-[75%] ${
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
            {isUser ? "You" : message.role === "SYSTEM" ? "System" : "Assistant"}
          </span>
          <span
            className={`text-xs ${isUser ? "text-indigo-500" : "text-slate-400"}`}
          >
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        <div className={`text-sm ${isUser ? "text-slate-950" : "text-slate-700"}`}>
          {renderMessageContent(message.content)}
        </div>
      </article>
    </div>
  );
}
