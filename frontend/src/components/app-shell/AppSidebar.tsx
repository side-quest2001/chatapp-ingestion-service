import {
  Bot,
  ChevronRight,
  LayoutDashboard,
  ListTree,
  Logs,
  MessageSquareText,
  Settings,
} from "lucide-react";

export type AppView = "chat" | "conversations" | "logs" | "dashboard" | "settings";

const navItems = [
  {
    key: "chat" as const,
    label: "Chat",
    icon: MessageSquareText,
  },
  {
    key: "conversations" as const,
    label: "Conversations",
    icon: ListTree,
  },
  {
    key: "logs" as const,
    label: "Logs",
    icon: Logs,
  },
  {
    key: "dashboard" as const,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "settings" as const,
    label: "Settings",
    icon: Settings,
  },
];

type AppSidebarProps = {
  selectedView: AppView;
  onSelectView: (view: AppView) => void;
};

export function AppSidebar({ selectedView, onSelectView }: AppSidebarProps) {
  return (
    <aside className="flex w-24 shrink-0 flex-col justify-between border-r border-white/10 bg-slate-950/95 p-4 text-slate-300">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-300/20">
          <Bot className="h-7 w-7" />
        </div>

        <div className="mt-6 space-y-1">
          <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Console
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectView(item.key)}
                className={`group mt-1 flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-xs font-medium transition ${
                  item.key === selectedView
                    ? "bg-cyan-400/12 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-inset ring-cyan-300/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.2em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-slate-950">
            TS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Tushar</p>
            <p className="truncate text-xs text-slate-400">Admin</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
