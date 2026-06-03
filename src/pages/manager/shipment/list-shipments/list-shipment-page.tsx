import ShipmentTable from "./components/shipment-table";
import { CirclePlusIcon } from "lucide-react";
import { PATH_MANAGER_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Quản lý lô hàng
          </h1>

          <p className="text-muted-foreground mt-1">
            Duyệt, báo giá, điều phối và theo dõi
            toàn bộ lô hàng
          </p>
        </div>

        <CustomButton
          linkUrl={
            PATH_MANAGER_DASHBOARD.shipment.create
          }
          functionName="Tạo lô hàng mới"
          icon={CirclePlusIcon}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-7 gap-4">
        {shipmentStats.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl py-6 flex flex-col items-center justify-center"
          >
            <h2
              className={`text-4xl font-bold ${item.color}`}
            >
              {item.value}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              {item.title}
            </p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <ShipmentTable />
    </div>
  );
};

export default ShipmentPage;