import type { KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "../../../components/ui/Button";

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
    <div className="border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/80">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Send a message to your assistant..."
          rows={2}
          className="min-h-[48px] max-h-32 w-full resize-none border-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-100 px-2 pt-2">
          <div className="text-xs text-slate-400">
            {statusText || "Enter to send. Shift + Enter for a new line."}
          </div>

          <Button
            onClick={onSubmit}
            disabled={disabled || isLoading || !value.trim()}
            variant="primary"
            size="md"
          >
            <SendHorizonal className="h-4 w-4" />
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
