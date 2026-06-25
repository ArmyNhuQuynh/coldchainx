import { cn } from "@/lib/utils";
import { cnPercent, formatNumber } from "./dispatch-helpers";

type Props = {
  label: string;
  used: number;
  capacity?: number | null;
  unit: string;
};

const CapacityMeter = ({ label, used, capacity, unit }: Props) => {
  const percent = capacity && capacity > 0 ? (used / capacity) * 100 : 0;
  const overLimit = percent > 100;
  const warning = percent >= 85 && !overLimit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            overLimit ? "text-rose-700" : warning ? "text-amber-700" : "text-foreground"
          )}
        >
          {formatNumber(used)} / {formatNumber(capacity)} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            overLimit ? "bg-rose-600" : warning ? "bg-amber-500" : "bg-emerald-600"
          )}
          style={{ width: `${cnPercent(percent)}%` }}
        />
      </div>
      <p className="text-right text-xs text-muted-foreground">
        {formatNumber(percent, 0)}%
      </p>
    </div>
  );
};

export default CapacityMeter;
