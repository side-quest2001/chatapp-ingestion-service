import { Sparkles } from "lucide-react";

type EmptyChatStateProps = {
  onCreateConversation: () => void;
};

export function EmptyChatState({ onCreateConversation }: EmptyChatStateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          Start a new conversation
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Create a thread to begin chatting with the configured LLM provider.
          Your recent conversations will appear in the side panel.
        </p>
        <button
          type="button"
          onClick={onCreateConversation}
          className="mt-8 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Start a new conversation
        </button>
      </div>
    </div>
  );
}
