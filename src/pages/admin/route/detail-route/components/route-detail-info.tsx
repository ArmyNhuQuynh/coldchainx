import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TRoute } from "@/schemas/route.schema";
import { ArrowRight, CalendarClock, Clock, Hash, MapPin, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  route: TRoute;
};

type InfoRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN");
};

const InfoRow = ({ icon: Icon, label, value }: InfoRowData) => (
  <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="text-right text-sm font-medium">{value}</div>
  </div>
);

const RouteDetailInfo = ({ route }: Props) => {
  const rows: InfoRowData[] = [
    {
      icon: Hash,
      label: "Mã tuyến",
      value: <span className="font-semibold text-primary">{route.routeCode}</span>,
    },
    {
      icon: MapPin,
      label: "Điểm đi",
      value: route.originCity,
    },
    {
      icon: ArrowRight,
      label: "Điểm đến",
      value: route.destCity,
    },
    {
      icon: Clock,
      label: "Thời gian vận chuyển",
      value: route.transitTime || "—",
    },
    {
      icon: CalendarClock,
      label: "Ngày tạo",
      value: formatDate(route.createdAt),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 text-lg font-semibold">
        Thông tin tuyến
      </CardHeader>
      <CardContent>
        <div>
          {rows.map((row) => (
            <InfoRow key={row.label} {...row} />
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
            <Route className="h-4 w-4" />
            Chưa quản lý lịch chạy tại đây
          </div>
          Lịch đi theo ngày, giờ xuất phát và giờ cut-off sẽ được xử lý riêng ở luồng điều phối.
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetailInfo;
