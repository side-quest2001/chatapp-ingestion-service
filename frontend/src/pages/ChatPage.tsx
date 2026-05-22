import { ArrowLeft } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
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
  const showMobileConversationList = isMobile && !selectedConversationId;
  const showChatArea = !isMobile || Boolean(selectedConversationId);

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

      const hasExistingSelection = nextConversations.some(
        (conversation) => conversation.id === selectedConversationId,
      );
      const fallbackConversationId = isMobile ? null : (nextConversations[0]?.id ?? null);
      const nextSelectedId =
        preferredConversationId ??
        (hasExistingSelection ? selectedConversationId : fallbackConversationId);

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
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    void refreshConversations();
  }, [isMobile]);

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

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
    setActiveConversation(null);
    setComposerValue("");
    setErrorMessage(null);
  };

  return (
    <section className="flex h-full min-w-0 flex-1 bg-slate-50">
      <div className="flex h-full min-w-0 flex-1 flex-col md:flex-row">
        <header className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Inference Logger</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {showMobileConversationList ? "Conversations" : "Chat"}
              </p>
            </div>
            {!showMobileConversationList ? (
              <button
                type="button"
                onClick={handleBackToConversations}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : null}
          </div>
        </header>

        {(!isMobile || showMobileConversationList) ? (
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
        ) : null}

        {showChatArea ? (
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

            <div className="flex min-h-0 flex-1 flex-col">
              {errorMessage ? (
                <div className="px-4 pt-4 sm:px-6">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                </div>
              ) : null}

              <div className="flex min-h-0 flex-1 flex-col">
                {activeConversation ? (
                  isLoadingConversationDetail ? (
                    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
                      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
                        Loading conversation...
                      </div>
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
              </div>

              <div className="sticky bottom-0 shrink-0">
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
