import { cn } from "@/lib/utils";

type MetricTone = "default" | "success" | "warning" | "danger" | "info";

export type AdminMetricItem = {
  label: string;
  value: string | number;
  detail?: string;
  tone?: MetricTone;
};

const toneClasses: Record<MetricTone, string> = {
  default: "border-l-border",
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  danger: "border-l-rose-500",
  info: "border-l-sky-500",
};

const valueClasses: Record<MetricTone, string> = {
  default: "text-foreground",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
  info: "text-sky-700",
};

const AdminMetricStrip = ({ items }: { items: AdminMetricItem[] }) => (
  <section className="grid overflow-hidden rounded-lg border bg-card shadow-sm sm:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => {
      const tone = item.tone ?? "default";

      return (
        <div
          key={item.label}
          className={cn(
            "min-h-28 border-b border-l-4 p-4 transition-colors duration-200 hover:bg-muted/25 sm:border-r xl:border-b-0 last:border-r-0",
            toneClasses[tone]
          )}
        >
          <p className="text-xs font-medium text-muted-foreground">
            {item.label}
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-semibold tabular-nums",
              valueClasses[tone]
            )}
          >
            {item.value}
          </p>
          {item.detail && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {item.detail}
            </p>
          )}
        </div>
      );
    })}
  </section>
);

export default AdminMetricStrip;
