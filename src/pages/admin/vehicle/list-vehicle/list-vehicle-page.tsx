import VehicleTable from "./components/vehicle-table";
import { CirclePlusIcon, Truck, TruckIcon, Wrench, CheckCircle } from "lucide-react";
import CustomButton from "@/components/button/custom-link-button";
import { Card } from "@/components/ui/card";
import { useVehicle } from "@/hooks/use-vehicle";
import {
  normalizeVehicleStatus,
  VEHICLE_STATUS,
} from "@/types/enums/vehicle-status.enum";

const ListVehiclePage = () => {
  const { getVehicles } = useVehicle();
  const { data } = getVehicles();

  const vehicles = data?.data ?? [];

  const vehicleStats = [
    {
      title: "Tổng đội xe",
      value: vehicles.length,
      color: "text-foreground",
      icon: Truck,
    },
    {
      title: "Đang vận chuyển",
      value: vehicles.filter((v) => normalizeVehicleStatus(v.status) === VEHICLE_STATUS.ON_TRIP).length,
      color: "text-blue-500",
      icon: TruckIcon,
    },
    {
      title: "Sẵn sàng",
      value: vehicles.filter((v) => normalizeVehicleStatus(v.status) === VEHICLE_STATUS.ACTIVE).length,
      color: "text-green-500",
      icon: CheckCircle,
    },
    {
      title: "Bảo trì",
      value: vehicles.filter((v) => normalizeVehicleStatus(v.status) === VEHICLE_STATUS.UNDER_MAINTENANCE).length,
      color: "text-orange-500",
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý đầu kéo</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi đầu kéo, container, bảo dưỡng và trạng thái xe
          </p>
        </div>
        <CustomButton
          linkUrl="/vehicles/create"
          functionName="Thêm xe"
          icon={CirclePlusIcon}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {vehicleStats.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl py-6 px-4 flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <item.icon className="h-5 w-5" />
              <p className="text-sm">{item.title}</p>
            </div>
            <h2 className={`text-4xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </Card>
        ))}
      </div>

      {/* Table */}
      <VehicleTable />
    </div>
  );
};

export default ListVehiclePage;
