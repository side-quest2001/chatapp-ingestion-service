import { Plus, Search } from "lucide-react";

import type { ConversationSummary } from "../../api/types";
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

          <button
            type="button"
            onClick={onCreateConversation}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Create conversation"
          >
            <Plus className="h-4 w-4" />
          </button>
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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-900">No conversations yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a conversation to start chatting.
            </p>
            <button
              type="button"
              onClick={onCreateConversation}
              className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              New conversation
            </button>
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
