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
    <header className="border-b border-white/10 bg-slate-950/40 px-8 py-6 backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Chat Workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {conversation?.title || "Start a new conversation"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {isCancelled
              ? "This conversation has been cancelled and is now read-only."
              : "Switch providers, tune the model, and continue the current thread."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative">
            <span className="sr-only">Provider</span>
            <select
              value={provider}
              onChange={(event) =>
                onProviderChange(event.target.value as ProviderName)
              }
              className="appearance-none rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 pr-10 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40"
            >
              {providerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="flex min-w-[220px] items-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3">
            <span className="sr-only">Model</span>
            <input
              value={model}
              onChange={(event) => onModelChange(event.target.value)}
              placeholder="Enter model slug"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </label>

          <button
            type="button"
            onClick={onCancelConversation}
            disabled={!conversation || isCancelled || isCancelling}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Ban className="h-4 w-4" />
            {isCancelling ? "Cancelling..." : "Cancel conversation"}
          </button>
        </div>
      </div>
    </header>
  );
}
