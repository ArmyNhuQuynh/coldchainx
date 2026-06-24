import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDriver } from "@/hooks/use-driver";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TDriver } from "@/schemas/driver.schema";
import {
  DRIVER_STATUS,
  normalizeDriverStatus,
} from "@/types/enums/driver-status.enum";
import {
  BadgeCheck,
  FileSpreadsheet,
  FileWarning,
  IdCard,
  Plus,
  Power,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverImportDialog from "../components/driver-import-dialog";
import DriverUpsertDialog from "../components/driver-upsert-dialog";
import DriverTable from "./components/driver-table";

const ListDriverPage = () => {
  const { getDrivers } = useDriver();
  const { data } = getDrivers();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [driverImportOpen, setDriverImportOpen] = useState(false);
  const [licenseImportOpen, setLicenseImportOpen] = useState(false);
  const drivers = data?.data ?? [];

  const handleCreated = (driver: TDriver) => {
    navigate(PATH_ADMIN_DASHBOARD.driver.detail(driver.driverId));
  };

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
        (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.ACTIVE
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
      title: "Thiếu GPLX hợp lệ",
      value: drivers.filter(
        (driver) =>
          normalizeDriverStatus(driver.status) === DRIVER_STATUS.SUSPENDED_DOCS
      ).length,
      color: "text-orange-500",
      icon: FileWarning,
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
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý tài xế</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi hồ sơ tài xế, giấy phép lái xe và trạng thái vận hành
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setLicenseImportOpen(true)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Import GPLX
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setDriverImportOpen(true)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Import tài xế
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm tài xế
          </Button>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IdCard className="h-5 w-5" />
          </div>
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

      <DriverUpsertDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onCreated={handleCreated}
      />
      <DriverImportDialog
        open={driverImportOpen}
        onOpenChange={setDriverImportOpen}
        type="drivers"
      />
      <DriverImportDialog
        open={licenseImportOpen}
        onOpenChange={setLicenseImportOpen}
        type="driver-licenses"
      />
    </div>
  );
};

export default ListDriverPage;
