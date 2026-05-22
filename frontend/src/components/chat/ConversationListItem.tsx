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
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        isSelected
          ? "border-indigo-200 bg-indigo-50 shadow-sm shadow-indigo-100/80"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {conversation.title || "Untitled conversation"}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            {statusLabel[conversation.status]}
          </p>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500">
          {conversation.messageCount}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {formatUpdatedAt(conversation.updatedAt)}
        </span>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <MessageSquareMore className="h-3.5 w-3.5" />
          {conversation.messageCount} messages
        </span>
      </div>
    </button>
  );
}
