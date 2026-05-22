import { Clock3, MessageSquareMore } from "lucide-react";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { ConversationStatus, ConversationSummary } from "../../../api/types";

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
  const messageLabel =
    conversation.messageCount === 1 ? "1 message" : `${conversation.messageCount} messages`;

  return (
    <Button
      onClick={() => onSelect(conversation.id)}
      variant="ghost"
      className={`h-auto w-full items-start rounded-2xl border px-4 py-3 text-left transition ${
        isSelected
          ? "border-indigo-200 bg-indigo-50 shadow-sm shadow-indigo-100/80 ring-1 ring-indigo-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-950">
            {conversation.title || "Untitled conversation"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
            {conversation.messageCount > 0
              ? `${messageLabel} in this thread`
              : "No messages yet"}
          </p>
        </div>

        <time className="shrink-0 text-xs text-slate-400">
          {formatUpdatedAt(conversation.updatedAt)}
        </time>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Badge
          variant={conversation.status === "ACTIVE" ? "success" : "warning"}
          className="px-2.5 py-1 text-[10px]"
        >
          {statusLabel[conversation.status]}
        </Badge>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquareMore className="h-3.5 w-3.5" />
          {messageLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          Updated recently
        </span>
      </div>
    </Button>
  );
}
