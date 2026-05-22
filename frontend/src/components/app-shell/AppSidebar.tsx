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
    <aside className="hidden h-full shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-300 md:flex md:w-[72px] lg:w-60">
      <div>
        <div className="border-b border-slate-800 px-3 py-4 lg:px-5 lg:py-5">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-white">Inference Logger</p>
              <p className="text-xs text-slate-400">Workspace</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 px-3 py-4 lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectView(item.key)}
                className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition lg:justify-start ${
                  item.key === selectedView
                    ? "bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-400/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
                title={item.label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="m-3 rounded-3xl border border-slate-800 bg-slate-900 p-3 lg:m-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-semibold text-white">
            TS
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm font-semibold text-white">Tushar</p>
            <p className="truncate text-xs text-slate-400">Admin</p>
          </div>
          <ChevronRight className="hidden h-4 w-4 text-slate-500 lg:block" />
        </div>
      </div>
    </aside>
  );
}
