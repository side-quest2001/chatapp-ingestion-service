import { Clock3, MessageSquareMore } from "lucide-react";

import type { ConversationStatus, ConversationSummary } from "../../api/types";

const statusLabel: Record<ConversationStatus, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  ARCHIVED: "Archived",
};

const formatUpdatedAt = (updatedAt: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(updatedAt));

type ConversationListItemProps = {
  conversation: ConversationSummary;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
};

export function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`w-full rounded-[1.6rem] border p-4 text-left transition ${
        isSelected
          ? "border-cyan-300/30 bg-cyan-300/10 shadow-lg shadow-cyan-950/25"
          : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {conversation.title || "Untitled conversation"}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
            {statusLabel[conversation.status]}
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-2 py-1 text-[0.7rem] font-medium text-slate-300">
          {conversation.messageCount}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {formatUpdatedAt(conversation.updatedAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquareMore className="h-3.5 w-3.5" />
          {conversation.messageCount} messages
        </span>
      </div>
    </button>
  );
}
