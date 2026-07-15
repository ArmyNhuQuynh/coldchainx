import CustomButton from "@/components/button/custom-link-button";
import { Card } from "@/components/ui/card";
import { useIotDevice } from "@/hooks/use-iot-device";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  IOT_DEVICE_STATUS,
  normalizeIotDeviceStatus,
} from "@/types/enums/iot-device-status.enum";
import {
  CirclePlusIcon,
  Link2,
  RadioTower,
  Router,
  Unlink,
} from "lucide-react";
import { useMemo, useState } from "react";
import IotDeviceFilterBar, {
  IOT_DEVICE_ASSIGNMENT_ASSIGNED,
  IOT_DEVICE_ASSIGNMENT_UNASSIGNED,
  IOT_DEVICE_FILTER_ALL,
  type TIotDeviceFilters,
} from "./components/iot-device-filter-bar";
import IotDeviceTable from "./components/iot-device-table";

const defaultFilters: TIotDeviceFilters = {
  search: "",
  status: IOT_DEVICE_FILTER_ALL,
  assignment: IOT_DEVICE_FILTER_ALL,
};

const matchesSearch = (device: TIotDevice, query: string) => {
  if (!query.trim()) return true;

  const normalized = query.trim().toLowerCase();
  return [device.deviceCode, device.truckPlate, device.vehicleId]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
};

const matchesStatus = (device: TIotDevice, status: string) => {
  if (status === IOT_DEVICE_FILTER_ALL) return true;
  return normalizeIotDeviceStatus(device.status) === normalizeIotDeviceStatus(status);
};

const matchesAssignment = (device: TIotDevice, assignment: string) => {
  if (assignment === IOT_DEVICE_FILTER_ALL) return true;
  if (assignment === IOT_DEVICE_ASSIGNMENT_ASSIGNED) return !!device.vehicleId;
  if (assignment === IOT_DEVICE_ASSIGNMENT_UNASSIGNED) return !device.vehicleId;
  return true;
};

const ListIotDevicePage = () => {
  const { getIotDevices } = useIotDevice();
  const { data: devices = [], isFetching } = getIotDevices();
  const [filters, setFilters] = useState<TIotDeviceFilters>(defaultFilters);

  const filteredDevices = useMemo(
    () =>
      devices.filter(
        (device) =>
          matchesSearch(device, filters.search) &&
          matchesStatus(device, filters.status) &&
          matchesAssignment(device, filters.assignment)
      ),
    [devices, filters]
  );

  const stats = [
    {
      title: "Tổng thiết bị",
      value: devices.length,
      color: "text-foreground",
      icon: Router,
    },
    {
      title: "Đã gắn xe",
      value: devices.filter((device) => !!device.vehicleId).length,
      color: "text-indigo-600",
      icon: Link2,
    },
    {
      title: "Đang online",
      value: devices.filter(
        (device) =>
          device.isOnline === true ||
          normalizeIotDeviceStatus(device.status) === IOT_DEVICE_STATUS.ONLINE
      ).length,
      color: "text-emerald-600",
      icon: RadioTower,
    },
    {
      title: "Chưa gắn xe",
      value: devices.filter((device) => !device.vehicleId).length,
      color: "text-amber-600",
      icon: Unlink,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý thiết bị IoT</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý thiết bị, trạng thái kết nối và xe đang được gắn thiết bị.
          </p>
        </div>
        <CustomButton
          linkUrl={PATH_ADMIN_DASHBOARD.iotDevice.create}
          functionName="Thêm thiết bị"
          icon={CirclePlusIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="flex flex-col items-center justify-center rounded-2xl px-4 py-6"
          >
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-5 w-5" />
              <p className="text-sm">{item.title}</p>
            </div>
            <h2 className={`text-4xl font-bold ${item.color}`}>{item.value}</h2>
          </Card>
        ))}
      </div>

      <IotDeviceFilterBar
        filters={filters}
        onChange={(updates) =>
          setFilters((current) => ({ ...current, ...updates }))
        }
        onReset={() => setFilters(defaultFilters)}
      />

      <IotDeviceTable devices={filteredDevices} isLoading={isFetching} />
    </div>
  );
};

export default ListIotDevicePage;
