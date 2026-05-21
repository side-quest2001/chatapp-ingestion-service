import { Plus, Search } from "lucide-react";

import type { ConversationSummary } from "../../api/types";
import { ConversationListItem } from "./ConversationListItem";

type ConversationsPanelProps = {
  conversations: ConversationSummary[];
  searchValue: string;
  selectedConversationId: string | null;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
};

export function ConversationsPanel({
  conversations,
  searchValue,
  selectedConversationId,
  onSearchChange,
  onSelectConversation,
  onCreateConversation,
}: ConversationsPanelProps) {
  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-r border-white/10 bg-slate-900/70 p-5">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-slate-950/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Conversations
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Thread library
            </h2>
          </div>

          <button
            type="button"
            onClick={onCreateConversation}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:scale-[1.02]"
            aria-label="Create conversation"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-400">
          <Search className="h-4 w-4" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title"
            className="w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </label>
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
}
