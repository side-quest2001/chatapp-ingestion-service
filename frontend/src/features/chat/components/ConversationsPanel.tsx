import { Plus, Search } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { ConversationSummary } from "../../../api/types";
import { ConversationListItem } from "./ConversationListItem";

type ConversationsPanelProps = {
  conversations: ConversationSummary[];
  searchValue: string;
  selectedConversationId: string | null;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
};

export function ConversationsPanel({
  conversations,
  searchValue,
  selectedConversationId,
  isLoading = false,
  onSearchChange,
  onSelectConversation,
  onCreateConversation,
}: ConversationsPanelProps) {
  return (
    <aside className="flex h-full min-w-0 flex-col bg-white md:w-80 md:shrink-0 md:border-r md:border-slate-200 lg:w-[340px]">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Conversations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Resume a thread or start something new.
            </p>
          </div>

          <Button
            onClick={onCreateConversation}
            aria-label="Create conversation"
            variant="secondary"
            size="sm"
            className="w-9 px-0 shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400">
          <Search className="h-4 w-4" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title"
            className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Loading conversations...
          </div>
        ) : null}

        {!isLoading && conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8">
            <EmptyState
              title="No conversations yet"
              description="Create a conversation to start chatting."
              className="mx-auto max-w-sm"
              action={
                <Button onClick={onCreateConversation} variant="primary">
                  New conversation
                </Button>
              }
            />
          </div>
        ) : null}

        {!isLoading ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onSelectConversation}
              />
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
