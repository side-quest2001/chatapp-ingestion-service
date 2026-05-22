import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center ${className}`.trim()}>
      {icon ? <div className="mx-auto">{icon}</div> : null}
      <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
