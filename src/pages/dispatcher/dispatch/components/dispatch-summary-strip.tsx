import { Badge } from "@/components/ui/badge";
import type { TDispatchReadyLpn } from "@/schemas/dispatch.schema";
import { Boxes, Scale, Snowflake, Truck } from "lucide-react";
import { formatNumber, getSelectedTemperatureRange } from "./dispatch-helpers";

type Props = {
  visibleCount: number;
  selectedLpns: TDispatchReadyLpn[];
  vehicleCount: number;
  driverCount: number;
};

const DispatchSummaryStrip = ({
  visibleCount,
  selectedLpns,
  vehicleCount,
  driverCount,
}: Props) => {
  const totalWeight = selectedLpns.reduce((sum, item) => sum + (item.actualWeightKg || 0), 0);
  const totalCbm = selectedLpns.reduce((sum, item) => sum + (item.actualCbm || 0), 0);
  const tempRange = getSelectedTemperatureRange(selectedLpns);

  const stats = [
    {
      icon: Boxes,
      label: "LPN đang hiển thị",
      value: visibleCount.toString(),
    },
    {
      icon: Truck,
      label: "Xe / tài xế khả dụng",
      value: `${vehicleCount} / ${driverCount}`,
    },
    {
      icon: Scale,
      label: "Đã chọn",
      value: `${formatNumber(totalWeight)} kg · ${formatNumber(totalCbm)} m³`,
    },
    {
      icon: Snowflake,
      label: "Dải nhiệt",
      value: tempRange ? `${tempRange.min}°C → ${tempRange.max}°C` : "—",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm"
          >
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-base font-semibold">{item.value}</p>
            </div>
            <Badge variant="outline" className="h-9 w-9 p-0">
              <Icon className="h-4 w-4" />
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default DispatchSummaryStrip;
