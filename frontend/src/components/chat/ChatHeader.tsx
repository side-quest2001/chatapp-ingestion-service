import { Ban, ChevronDown } from "lucide-react";

import type { ConversationDetail, ProviderName } from "../../api/types";

type ChatHeaderProps = {
  conversation: ConversationDetail | null;
  provider: ProviderName;
  model: string;
  onProviderChange: (provider: ProviderName) => void;
  onModelChange: (model: string) => void;
  onCancelConversation: () => void;
  isCancelling: boolean;
};

const providerOptions: ProviderName[] = ["groq", "openai", "deepseek"];

export function ChatHeader({
  conversation,
  provider,
  model,
  onProviderChange,
  onModelChange,
  onCancelConversation,
  isCancelling,
}: ChatHeaderProps) {
  const isCancelled = conversation?.status === "CANCELLED";

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
            {conversation?.title || "Start a new conversation"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isCancelled
              ? "This conversation has been cancelled and is now read-only."
              : "Switch providers, tune the model, and continue the current thread."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label className="relative">
            <span className="sr-only">Provider</span>
            <select
              value={provider}
              onChange={(event) =>
                onProviderChange(event.target.value as ProviderName)
              }
              className="h-10 min-w-[140px] appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-indigo-300"
            >
              {providerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="flex min-w-0 items-center rounded-xl border border-slate-200 bg-white px-3 sm:min-w-[220px]">
            <span className="sr-only">Model</span>
            <input
              value={model}
              onChange={(event) => onModelChange(event.target.value)}
              placeholder="Enter model slug"
              className="h-10 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={onCancelConversation}
            disabled={!conversation || isCancelled || isCancelling}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            <Ban className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isCancelling ? "Cancelling..." : "Cancel conversation"}
            </span>
            <span className="sm:hidden">{isCancelling ? "..." : "Cancel"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
