import { Card, CardContent } from "@/components/ui/card";
import type { TPendingDiscrepancy } from "@/schemas/discrepancy.schema";
import { AlertTriangle, ClipboardList, Gauge, PackageSearch } from "lucide-react";

type Props = {
  items: TPendingDiscrepancy[];
};

const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const IncidentSummaryCards = ({ items }: Props) => {
  const maxDiff = items.length
    ? Math.max(...items.map((item) => item.diffPercent))
    : 0;
  const averageDiff = items.length
    ? items.reduce((total, item) => total + item.diffPercent, 0) / items.length
    : 0;

  const cards = [
    {
      title: "Đang chờ xử lý",
      value: items.length.toString(),
      icon: ClipboardList,
      className: "text-slate-700",
    },
    {
      title: "Lệch trung bình",
      value: formatPercent(averageDiff),
      icon: Gauge,
      className: "text-sky-700",
    },
    {
      title: "Lệch cao nhất",
      value: formatPercent(maxDiff),
      icon: AlertTriangle,
      className: "text-rose-700",
    },
    {
      title: "LPN bị giữ",
      value: items.length.toString(),
      icon: PackageSearch,
      className: "text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`mt-1 text-2xl font-bold ${card.className}`}>
                  {card.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Icon className={`h-5 w-5 ${card.className}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default IncidentSummaryCards;
