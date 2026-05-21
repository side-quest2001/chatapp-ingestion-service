import { useEffect, useState } from "react";

import { chatApi } from "../api/chat.api";
import { conversationsApi } from "../api/conversations.api";
import type {
  ConversationDetail,
  ConversationSummary,
  ProviderName,
} from "../api/types";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatThread } from "../components/chat/ChatThread";
import { ConversationsPanel } from "../components/chat/ConversationsPanel";
import { EmptyChatState } from "../components/chat/EmptyChatState";
import { MessageComposer } from "../components/chat/MessageComposer";

const defaultModels: Record<ProviderName, string> = {
  groq: "llama-3.1-8b-instant",
  openai: "gpt-4.1-mini",
  deepseek: "deepseek-chat",
};

export function ChatPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null,
  );
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<ConversationDetail | null>(null);
  const [provider, setProvider] = useState<ProviderName>("groq");
  const [model, setModel] = useState(defaultModels.groq);
  const [composerValue, setComposerValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingConversationDetail, setIsLoadingConversationDetail] =
    useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCancellingConversation, setIsCancellingConversation] = useState(false);

  const filteredConversations = conversations.filter((conversation) =>
    (conversation.title ?? "")
      .toLowerCase()
      .includes(searchValue.trim().toLowerCase()),
  );
  const composerDisabled =
    !activeConversation ||
    activeConversation.status === "CANCELLED" ||
    isSendingMessage;

  const loadConversationDetail = async (conversationId: string) => {
    setIsLoadingConversationDetail(true);

    try {
      const conversation = await conversationsApi.getById(conversationId);
      setActiveConversation(conversation);
      setSelectedConversationId(conversationId);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load the selected conversation.";
      setErrorMessage(message);
    } finally {
      setIsLoadingConversationDetail(false);
    }
  };

  const refreshConversations = async (preferredConversationId?: string | null) => {
    setIsLoadingConversations(true);

    try {
      const nextConversations = await conversationsApi.list();
      setConversations(nextConversations);

      const nextSelectedId =
        preferredConversationId ??
        (nextConversations.some(
          (conversation) => conversation.id === selectedConversationId,
        )
          ? selectedConversationId
          : nextConversations[0]?.id ?? null);

      if (nextSelectedId) {
        await loadConversationDetail(nextSelectedId);
      } else {
        setSelectedConversationId(null);
        setActiveConversation(null);
      }

      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load conversations.";
      setErrorMessage(message);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    void refreshConversations();
  }, []);

  const handleCreateConversation = async () => {
    setIsCreatingConversation(true);

    try {
      const conversation = await conversationsApi.create();
      await refreshConversations(conversation.id);
      setComposerValue("");
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create a new conversation.";
      setErrorMessage(message);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversationId || !composerValue.trim()) {
      return;
    }

    setIsSendingMessage(true);

    try {
      const response = await chatApi.sendMessage(selectedConversationId, {
        content: composerValue.trim(),
        provider,
        model,
      });

      setComposerValue("");
      setActiveConversation((currentConversation) => {
        if (!currentConversation || currentConversation.id !== selectedConversationId) {
          return currentConversation;
        }

        return {
          ...currentConversation,
          messages: [
            ...currentConversation.messages,
            response.userMessage,
            response.assistantMessage,
          ],
          updatedAt: response.assistantMessage.createdAt,
        };
      });

      await refreshConversations(selectedConversationId);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send message.";
      setErrorMessage(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCancelConversation = async () => {
    if (!selectedConversationId) {
      return;
    }

    setIsCancellingConversation(true);

    try {
      await conversationsApi.cancel(selectedConversationId);
      setActiveConversation((currentConversation) =>
        currentConversation
          ? {
              ...currentConversation,
              status: "CANCELLED",
            }
          : currentConversation,
      );
      await refreshConversations(selectedConversationId);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel conversation.";
      setErrorMessage(message);
    } finally {
      setIsCancellingConversation(false);
    }
  };

  return (
    <section className="flex min-w-0 flex-1 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.95))]">
      <ConversationsPanel
        conversations={filteredConversations}
        searchValue={searchValue}
        selectedConversationId={selectedConversationId}
        onSearchChange={setSearchValue}
        onSelectConversation={(conversationId) => {
          void loadConversationDetail(conversationId);
        }}
        onCreateConversation={() => {
          void handleCreateConversation();
        }}
        isLoading={isLoadingConversations || isCreatingConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          conversation={activeConversation}
          provider={provider}
          model={model}
          onProviderChange={(nextProvider) => {
            setProvider(nextProvider);
            setModel(defaultModels[nextProvider]);
          }}
          onModelChange={setModel}
          onCancelConversation={() => {
            void handleCancelConversation();
          }}
          isCancelling={isCancellingConversation}
        />

        <div className="flex min-h-0 flex-1 flex-col justify-between px-8 py-8">
          {errorMessage ? (
            <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {activeConversation ? (
            isLoadingConversationDetail ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                Loading conversation...
              </div>
            ) : (
              <ChatThread messages={activeConversation.messages} />
            )
          ) : (
            <EmptyChatState
              onCreateConversation={() => {
                void handleCreateConversation();
              }}
            />
          )}

          <MessageComposer
            value={composerValue}
            onChange={setComposerValue}
            onSubmit={() => {
              void handleSendMessage();
            }}
            disabled={composerDisabled}
            isLoading={isSendingMessage}
            statusText={
              activeConversation?.status === "CANCELLED"
                ? "This conversation is cancelled. Messaging is disabled."
                : !activeConversation
                  ? "Create a conversation to start chatting."
                : null
            }
          />
        </div>
      </div>
    </section>
  );
}
