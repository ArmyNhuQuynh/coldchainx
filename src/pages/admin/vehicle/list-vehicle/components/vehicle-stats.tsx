import { Card } from "@/components/ui/card";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { ActivityIcon, TruckIcon } from "lucide-react";

type VehicleStatsProps = {
  vehicles: TVehicle[];
  isLoading?: boolean;
};

const getValue = (value: number, isLoading?: boolean) =>
  isLoading ? "--" : value;

const VehicleStats = ({ vehicles, isLoading }: VehicleStatsProps) => {
  const statusStats = Array.from(
    vehicles.reduce((map, vehicle) => {
      const status = vehicle.status || "UNKNOWN";
      map.set(status, (map.get(status) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([status, value]) => ({ title: status, value }))
    .slice(0, 3);

  const stats = [
    {
      title: "Tổng đội xe",
      value: getValue(vehicles.length, isLoading),
      icon: TruckIcon,
      iconClassName: "text-primary",
    },
    ...statusStats.map((status) => ({
      title: status.title,
      value: getValue(status.value, isLoading),
      icon: ActivityIcon,
      iconClassName: "text-muted-foreground",
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title} className="rounded-2xl px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-normal text-muted-foreground">
                  {item.title}
                </p>
                <h2 className="mt-4 text-4xl font-bold text-foreground">
                  {item.value}
                </h2>
              </div>
              <Icon className={`h-5 w-5 ${item.iconClassName}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default VehicleStats;
