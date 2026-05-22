import type { ReactNode } from "react";

type BadgeVariant = "success" | "error" | "warning" | "neutral";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  error: "bg-rose-100 text-rose-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "border border-slate-200 bg-white text-slate-500",
};

export function Badge({
  children,
  className = "",
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
