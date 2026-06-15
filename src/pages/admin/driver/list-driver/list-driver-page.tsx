import { Card } from "@/components/ui/card";
import { useDriver } from "@/hooks/use-driver";
import {
  DRIVER_STATUS,
  normalizeDriverStatus,
} from "@/types/enums/driver-status.enum";
import { BadgeCheck, IdCard, Power, UserCheck, Users, WifiOff } from "lucide-react";
import DriverTable from "./components/driver-table";

const ListDriverPage = () => {
  const { getDrivers } = useDriver();
  const { data } = getDrivers();
  const drivers = data?.data ?? [];

  const driverStats = [
    {
      title: "Tổng tài xế",
      value: drivers.length,
      color: "text-foreground",
      icon: Users,
    },
    {
      title: "Sẵn sàng",
      value: drivers.filter(
        (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.AVAILABLE
      ).length,
      color: "text-green-500",
      icon: UserCheck,
    },
    {
      title: "Đang vận chuyển",
      value: drivers.filter(
        (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.ON_TRIP
      ).length,
      color: "text-blue-500",
      icon: BadgeCheck,
    },
    {
      title: "Ngoại tuyến",
      value: drivers.filter(
        (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.OFFLINE
      ).length,
      color: "text-orange-500",
      icon: WifiOff,
    },
    {
      title: "Ngừng hoạt động",
      value: drivers.filter(
        (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.INACTIVE
      ).length,
      color: "text-slate-500",
      icon: Power,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý tài xế</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi hồ sơ tài xế, giấy phép lái xe và trạng thái vận hành
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <IdCard className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {driverStats.map((item) => (
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

      <DriverTable />
    </div>
  );
};

export default ListDriverPage;
