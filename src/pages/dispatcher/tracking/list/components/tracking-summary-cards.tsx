import { Card, CardContent } from "@/components/ui/card";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { Activity, AlertTriangle, Radio, Truck } from "lucide-react";

type Props = {
  trips: TTrackingTrip[];
  totalRecords: number;
};

const TrackingSummaryCards = ({ trips, totalRecords }: Props) => {
  const onlineCount = trips.filter((trip) => trip.device?.isOnline).length;
  const delayedCount = trips.filter((trip) => trip.status === "DELAYED").length;
  const withTelemetryCount = trips.filter((trip) => trip.latestTelemetry).length;

  const items = [
    {
      label: "Tổng chuyến",
      value: totalRecords,
      icon: Truck,
    },
    {
      label: "Có tín hiệu",
      value: withTelemetryCount,
      icon: Activity,
    },
    {
      label: "IoT online",
      value: onlineCount,
      icon: Radio,
    },
    {
      label: "Đang trễ",
      value: delayedCount,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-lg py-0">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TrackingSummaryCards;
