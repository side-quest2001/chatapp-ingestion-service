import { AppSidebar } from "../components/app-shell/AppSidebar";

export function ChatPage() {
  return (
    <main className="flex h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar />

      <section className="flex min-w-0 flex-1 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.95))]">
        <div className="flex w-[360px] shrink-0 flex-col border-r border-white/10 bg-slate-900/70 p-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Conversations
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Ready to resume a thread
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This panel will host search, recent conversations, and the create
              conversation action.
            </p>
          </div>
        </div>

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
