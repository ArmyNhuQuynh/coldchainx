import { Card, CardContent } from "@/components/ui/card";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { Box, Fuel, Snowflake, Weight, type LucideIcon } from "lucide-react";

type Props = {
  vehicle: TVehicle;
};

type InfoCard = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const hasNumber = (value: number | null | undefined) =>
  value !== null && value !== undefined;

const VehicleInfoCards = ({ vehicle }: Props) => {
  const cards: InfoCard[] = [
    hasNumber(vehicle.maxWeight)
      ? {
          label: "Tải trọng tối đa",
          value: `${vehicle.maxWeight.toLocaleString("vi-VN")} kg`,
          icon: Weight,
        }
      : null,
    hasNumber(vehicle.maxCbm)
      ? {
          label: "Thể tích tối đa",
          value: `${vehicle.maxCbm.toLocaleString("vi-VN")} m³`,
          icon: Box,
        }
      : null,
    hasNumber(vehicle.minTemp) && hasNumber(vehicle.maxTemp)
      ? {
          label: "Dải nhiệt",
          value: `${vehicle.minTemp}°C - ${vehicle.maxTemp}°C`,
          icon: Snowflake,
        }
      : null,
    hasNumber(vehicle.standardFuelLiters)
      ? {
          label: "Nhiên liệu tiêu chuẩn",
          value: `${vehicle.standardFuelLiters.toLocaleString("vi-VN")} L`,
          icon: Fuel,
        }
      : null,
  ].filter((card): card is InfoCard => Boolean(card));

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-2">
              <card.icon className="h-4 w-4" />
              {card.label}
            </div>
            <p className="font-semibold text-lg">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleInfoCards;
