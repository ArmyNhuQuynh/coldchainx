import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type DashboardKpiItem = {
  key: string;
  title: string;
  value: string | number;
  description?: string;
  overdue?: number;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
};

const toneClasses: Record<NonNullable<DashboardKpiItem["tone"]>, string> = {
  default: "border-border bg-card",
  success: "border-emerald-200 bg-emerald-50/35",
  warning: "border-amber-200 bg-amber-50/35",
  danger: "border-rose-200 bg-rose-50/35",
  info: "border-sky-200 bg-sky-50/35",
};

type Props = {
  items: DashboardKpiItem[];
  columns?: "four" | "five";
};

const DashboardKpiGrid = ({ items, columns = "four" }: Props) => (
  <div
    className={cn(
      "grid grid-cols-1 gap-3 sm:grid-cols-2",
      columns === "five" ? "xl:grid-cols-5" : "xl:grid-cols-4"
    )}
  >
    {items.map((item) => {
      const Icon = item.icon;
      const Element = item.onClick ? "button" : "div";

      return (
        <Element
          key={item.key}
          type={item.onClick ? "button" : undefined}
          onClick={item.onClick}
          className={cn(
            "min-h-32 rounded-lg border p-4 text-left shadow-sm transition-colors",
            toneClasses[item.tone ?? "default"],
            item.onClick && "cursor-pointer hover:border-primary/45 hover:bg-accent/30"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {item.title}
            </p>
            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums">{item.value}</p>
          {item.overdue !== undefined && item.overdue > 0 ? (
            <p className="mt-2 text-xs font-medium text-rose-700">
              {item.overdue.toLocaleString("vi-VN")} quá hạn
            </p>
          ) : item.description ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {item.description}
            </p>
          ) : null}
        </Element>
      );
    })}
  </div>
);

export default DashboardKpiGrid;
