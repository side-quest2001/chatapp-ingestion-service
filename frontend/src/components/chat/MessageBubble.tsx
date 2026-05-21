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
        className="my-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80"
      >
        <div className="border-b border-white/10 px-4 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-cyan-300">
          {language || "Code"}
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-slate-200">
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
        className={`max-w-[78%] rounded-[2rem] px-5 py-4 shadow-xl ${
          isUser
            ? "rounded-br-md bg-cyan-300 text-slate-950 shadow-cyan-950/35"
            : "rounded-bl-md border border-white/10 bg-white/[0.04] text-slate-100 shadow-slate-950/25"
        }`}
      >
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
              isUser ? "text-slate-900/70" : "text-cyan-300"
            }`}
          >
            {isUser ? "You" : message.role === "SYSTEM" ? "System" : "Assistant"}
          </span>
          <span
            className={`text-xs ${isUser ? "text-slate-900/60" : "text-slate-500"}`}
          >
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        <div className={`text-sm ${isUser ? "text-slate-950" : "text-slate-200"}`}>
          {renderMessageContent(message.content)}
        </div>
      </article>
    </div>
  );
}
