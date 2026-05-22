import { Sparkles } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";

type EmptyChatStateProps = {
  onCreateConversation: () => void;
};

export function EmptyChatState({ onCreateConversation }: EmptyChatStateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <EmptyState
        title="Start a new conversation"
        description="Create a thread to begin chatting with the configured LLM provider. Your recent conversations will appear in the side panel."
        className="max-w-xl"
        icon={
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
            <Sparkles className="h-7 w-7" />
          </div>
        }
        action={
          <Button onClick={onCreateConversation} variant="primary">
            Start a new conversation
          </Button>
        }
      />
    </div>
  );
}
