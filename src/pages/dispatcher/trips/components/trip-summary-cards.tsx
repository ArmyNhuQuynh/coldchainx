import { Card } from "@/components/ui/card";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { Boxes, ClipboardCheck, PackageCheck, Route } from "lucide-react";

type Props = {
  trips: TDispatchTrip[];
};

const TripSummaryCards = ({ trips }: Props) => {
  const cards = [
    {
      title: "Trip đang mở",
      value: trips.length,
      icon: Route,
      color: "text-foreground",
    },
    {
      title: "Đang bốc hàng",
      value: trips.filter((trip) => trip.status === "PICKING").length,
      icon: Boxes,
      color: "text-amber-600",
    },
    {
      title: "Chờ kẹp chì",
      value: trips.filter((trip) => trip.status === "LOADING_COMPLETED").length,
      icon: ClipboardCheck,
      color: "text-emerald-600",
    },
    {
      title: "Tổng LPN",
      value: trips.reduce((sum, trip) => sum + trip.totalLpns, 0),
      icon: PackageCheck,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="flex flex-row items-center justify-between rounded-lg px-5 py-4"
        >
          <div>
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TripSummaryCards;
