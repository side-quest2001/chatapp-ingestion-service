import { Sparkles } from "lucide-react";

type EmptyChatStateProps = {
  onCreateConversation: () => void;
};

export function EmptyChatState({ onCreateConversation }: EmptyChatStateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="max-w-xl rounded-[2.4rem] border border-white/10 bg-white/[0.03] px-10 py-12 text-center shadow-2xl shadow-slate-950/25">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300/10 text-cyan-300 ring-1 ring-inset ring-cyan-300/20">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
          Start a new conversation
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Create a thread to begin chatting with the configured LLM provider.
          Your recent conversations will appear in the side panel.
        </p>
        <button
          type="button"
          onClick={onCreateConversation}
          className="mt-8 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/35 transition hover:scale-[1.01]"
        >
          Start a new conversation
        </button>
      </div>
    </div>
  );
}
