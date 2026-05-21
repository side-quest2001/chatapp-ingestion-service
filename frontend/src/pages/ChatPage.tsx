import { useState } from "react";

import type { ConversationSummary } from "../api/types";
import { AppSidebar } from "../components/app-shell/AppSidebar";
import { ConversationsPanel } from "../components/chat/ConversationsPanel";

const demoConversations: ConversationSummary[] = [
  {
    id: "conv-1",
    title: "Model selection discussion",
    status: "ACTIVE",
    createdAt: "2026-05-21T08:30:00.000Z",
    updatedAt: "2026-05-21T10:24:00.000Z",
    messageCount: 8,
  },
  {
    id: "conv-2",
    title: "Prompt redaction review",
    status: "ACTIVE",
    createdAt: "2026-05-21T07:40:00.000Z",
    updatedAt: "2026-05-21T09:12:00.000Z",
    messageCount: 5,
  },
  {
    id: "conv-3",
    title: "Cancelled sample thread",
    status: "CANCELLED",
    createdAt: "2026-05-20T18:00:00.000Z",
    updatedAt: "2026-05-20T18:41:00.000Z",
    messageCount: 3,
  },
];

export function ChatPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    demoConversations[0]?.id ?? null,
  );

  const filteredConversations = demoConversations.filter((conversation) =>
    (conversation.title ?? "")
      .toLowerCase()
      .includes(searchValue.trim().toLowerCase()),
  );

  return (
    <main className="flex h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar />

      <section className="flex min-w-0 flex-1 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.95))]">
        <ConversationsPanel
          conversations={filteredConversations}
          searchValue={searchValue}
          selectedConversationId={selectedConversationId}
          onSearchChange={setSearchValue}
          onSelectConversation={setSelectedConversationId}
          onCreateConversation={() => undefined}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 bg-slate-950/40 px-8 py-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
              Chat Workspace
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Real-time conversation canvas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Provider controls, conversation title, and cancellation state will
              live here.
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-between px-8 py-8">
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-sm text-slate-400">
              Thread placeholder
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-400">
                Composer placeholder
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
