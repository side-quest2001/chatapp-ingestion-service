import type { KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

type MessageComposerProps = {
  value: string;
  disabled?: boolean;
  isLoading?: boolean;
  statusText?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function MessageComposer({
  value,
  disabled = false,
  isLoading = false,
  statusText,
  onChange,
  onSubmit,
}: MessageComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!disabled && !isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-slate-200 bg-gradient-to-t from-slate-50 via-slate-50 to-slate-50/80 px-4 pb-4 pt-3 backdrop-blur sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.28)]">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Send a message to your assistant..."
          rows={2}
          className="min-h-[52px] max-h-40 w-full resize-none border-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 px-2 pt-3">
          <div className="text-xs text-slate-500">
            {statusText || "Enter to send. Shift + Enter for a new line."}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || isLoading || !value.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <SendHorizonal className="h-4 w-4" />
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
