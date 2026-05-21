import { useState } from "react";

import type { ConversationDetail, ConversationSummary, ProviderName } from "../api/types";
import { AppSidebar } from "../components/app-shell/AppSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatThread } from "../components/chat/ChatThread";
import { ConversationsPanel } from "../components/chat/ConversationsPanel";
import { EmptyChatState } from "../components/chat/EmptyChatState";
import { MessageComposer } from "../components/chat/MessageComposer";

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

const demoConversationDetail: ConversationDetail = {
  id: "conv-1",
  title: "Model selection discussion",
  status: "ACTIVE",
  createdAt: "2026-05-21T08:30:00.000Z",
  updatedAt: "2026-05-21T10:24:00.000Z",
  messages: [
    {
      id: "m1",
      role: "ASSISTANT",
      content:
        "I can help you compare `groq`, `openai`, and `deepseek` for latency, pricing, and response style.",
      createdAt: "2026-05-21T10:20:00.000Z",
    },
    {
      id: "m2",
      role: "USER",
      content: "Show me an example system prompt for concise answers.",
      createdAt: "2026-05-21T10:21:00.000Z",
    },
    {
      id: "m3",
      role: "ASSISTANT",
      content: `You could start with:\n\n\`\`\`txt\nYou are a concise helpful assistant.\nAlways answer clearly in 3-5 bullet points unless the user asks for depth.\n\`\`\``,
      createdAt: "2026-05-21T10:22:00.000Z",
    },
  ],
};

export function ChatPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    demoConversations[0]?.id ?? null,
  );
  const [provider, setProvider] = useState<ProviderName>("groq");
  const [model, setModel] = useState("llama-3.1-8b-instant");
  const [composerValue, setComposerValue] = useState("");

  const filteredConversations = demoConversations.filter((conversation) =>
    (conversation.title ?? "")
      .toLowerCase()
      .includes(searchValue.trim().toLowerCase()),
  );
  const activeConversation = selectedConversationId ? demoConversationDetail : null;
  const composerDisabled =
    !activeConversation || activeConversation.status === "CANCELLED";

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
          <ChatHeader
            conversation={activeConversation}
            provider={provider}
            model={model}
            onProviderChange={setProvider}
            onModelChange={setModel}
            onCancelConversation={() => undefined}
            isCancelling={false}
          />

          <div className="flex min-h-0 flex-1 flex-col justify-between px-8 py-8">
            {activeConversation ? (
              <ChatThread messages={activeConversation.messages} />
            ) : (
              <EmptyChatState onCreateConversation={() => undefined} />
            )}

            <MessageComposer
              value={composerValue}
              onChange={setComposerValue}
              onSubmit={() => undefined}
              disabled={composerDisabled}
              statusText={
                activeConversation?.status === "CANCELLED"
                  ? "This conversation is cancelled. Messaging is disabled."
                  : null
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}
