import ShipmentTable from "./components/shipment-table";
import { Card } from "@/components/ui/card";

type Props = {};

const shipmentStats = [
  {
    title: "Tổng",
    value: 8,
    color: "text-foreground",
  },

  {
    title: "Chờ xử lý",
    value: 1,
    color: "text-amber-500",
  },

  {
    title: "Đã báo giá",
    value: 0,
    color: "text-sky-500",
  },

  {
    title: "Chờ điều phối",
    value: 0,
    color: "text-cyan-500",
  },

  {
    title: "Sẵn sàng",
    value: 0,
    color: "text-green-500",
  },

  {
    title: "Đang vận chuyển",
    value: 3,
    color: "text-stone-900",
  },

  {
    title: "Đã giao",
    value: 2,
    color: "text-green-600",
  },
];

const ShipmentPage = (_: Props) => {
  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Quản lý lô hàng
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Duyệt, báo giá, điều phối và theo dõi
            toàn bộ lô hàng
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {shipmentStats.map((item) => (
          <Card
            key={item.title}
            className="min-h-[82px] gap-1 rounded-xl px-3 py-3 flex flex-col items-center justify-center"
          >
            <h2
              className={`text-2xl font-bold leading-none ${item.color}`}
            >
              {item.value}
            </h2>

            <p className="text-xs text-muted-foreground text-center">
              {item.title}
            </p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="min-w-0">
        <ShipmentTable />
      </div>
    </div>
  );
};

export default ShipmentPage;
