import { MessageSquareLock } from "lucide-react";
import { useState } from "react";

import { AppSidebar, type AppView } from "./components/app-shell/AppSidebar";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="flex min-w-0 flex-1 items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-8">
      <div className="max-w-xl rounded-[2.25rem] border border-slate-200 bg-white px-10 py-12 text-center shadow-sm shadow-slate-200/70">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-cyan-300">
          <MessageSquareLock className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          {title} is coming soon
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          This area is intentionally left as a placeholder for a future stage.
          Chat and Dashboard are available today.
        </p>
      </div>
    </section>
  );
}

function App() {
  const [selectedView, setSelectedView] = useState<AppView>("chat");

  return (
    <main className="flex h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar selectedView={selectedView} onSelectView={setSelectedView} />

      {selectedView === "chat" ? <ChatPage /> : null}
      {selectedView === "dashboard" ? <DashboardPage /> : null}
      {selectedView === "conversations" ? (
        <PlaceholderPage title="Conversations" />
      ) : null}
      {selectedView === "logs" ? <PlaceholderPage title="Logs" /> : null}
      {selectedView === "settings" ? <PlaceholderPage title="Settings" /> : null}
    </main>
  );
}

export default App;
