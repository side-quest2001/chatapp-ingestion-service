export const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export type MessageSegment =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language: string };

export const splitMessageContent = (content: string): MessageSegment[] =>
  content.split(/```/g).map((segment, index) => {
    if (index % 2 === 0) {
      return { type: "text", content: segment };
    }

    const codeLines = segment.split("\n");
    const firstLine = codeLines[0]?.trim();
    const language = firstLine && !firstLine.includes(" ") ? firstLine : "";
    const code = language ? codeLines.slice(1).join("\n") : segment;

    return {
      type: "code",
      content: code.trim(),
      language,
    };
  });
