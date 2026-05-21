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
    <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-3">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Send a message to your assistant..."
          rows={4}
          className="min-h-[120px] w-full resize-none border-none bg-transparent px-3 py-2 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 px-2 pt-4">
          <div className="text-xs text-slate-500">
            {statusText || "Enter to send. Shift + Enter for a new line."}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || isLoading || !value.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/35 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            <SendHorizonal className="h-4 w-4" />
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
