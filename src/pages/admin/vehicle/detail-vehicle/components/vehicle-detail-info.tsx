import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { getVehicleTypeLabel } from "@/types/enums/vehicle-type.enum";
import {
  Car,
  Fuel,
  Gauge,
  Hash,
  Ruler,
  MapPin,
  Snowflake,
  Tag,
  Truck,
  UserRound,
  Weight,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  vehicle: TVehicle;
};

type InfoRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatNumber = (value: number, unit: string) =>
  `${value.toLocaleString("vi-VN")} ${unit}`;

const formatOptionalNumber = (value: number | null | undefined, unit: string) =>
  typeof value !== "number" ? "-" : formatNumber(value, unit);

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const compactRows = (rows: Array<InfoRowData | null>) =>
  rows.filter((row): row is InfoRowData => row !== null);

const InfoRow = ({ icon: Icon, label, value }: InfoRowData) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="font-medium text-sm text-right">{value}</div>
  </div>
);

const InfoSection = ({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: InfoRowData[];
}) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        {title}
      </p>
      <div>{rows.map((row) => <InfoRow key={row.label} {...row} />)}</div>
    </div>
  );
};

const VehicleDetailInfo = ({ vehicle }: Props) => {
  const identificationRows = compactRows([
    hasValue(vehicle.truckPlate)
      ? {
          icon: Tag,
          label: "Biển số",
          value: <span className="text-primary font-semibold">{vehicle.truckPlate}</span>,
        }
      : null,
    hasValue(vehicle.brand)
      ? { icon: Car, label: "Hãng xe", value: vehicle.brand }
      : null,
    hasValue(vehicle.driverId)
      ? { icon: UserRound, label: "Tài xế mặc định", value: vehicle.driverId }
      : null,
  ]);

  const operationRows = compactRows([
    hasValue(vehicle.currentLocation)
      ? { icon: MapPin, label: "Vị trí hiện tại", value: vehicle.currentLocation }
      : null,
    {
      icon: Gauge,
      label: "Số km hiện tại",
      value: formatOptionalNumber(vehicle.currentOdometer, "km"),
    },
    {
      icon: Gauge,
      label: "Mốc bảo dưỡng tiếp theo",
      value: formatOptionalNumber(vehicle.nextMaintenanceOdometer, "km"),
    },
    {
      icon: Gauge,
      label: "Ngày bảo dưỡng tiếp theo",
      value: formatDate(vehicle.nextMaintenanceDate),
    },
    {
      icon: Gauge,
      label: "Cảnh báo trước",
      value: `${formatOptionalNumber(
        vehicle.warningKmBeforeDue,
        "km"
      )} / ${formatOptionalNumber(vehicle.warningDaysBeforeDue, "ngày")}`,
    },
  ]);

  const specificationRows = compactRows([
    hasValue(vehicle.vehicleType)
      ? {
          icon: Truck,
          label: "Loại xe",
          value: getVehicleTypeLabel(vehicle.vehicleType),
        }
      : null,
    hasValue(vehicle.maxWeight)
      ? {
          icon: Weight,
          label: "Tải trọng tối đa",
          value: formatNumber(vehicle.maxWeight, "kg"),
        }
      : null,
    hasValue(vehicle.maxCbm)
      ? {
          icon: Hash,
          label: "Thể tích tối đa",
          value: formatNumber(vehicle.maxCbm, "m³"),
        }
      : null,
    hasValue(vehicle.usableCbm)
      ? {
          icon: Hash,
          label: "CBM khả dụng",
          value: formatNumber(vehicle.usableCbm!, "m³"),
        }
      : null,
    hasValue(vehicle.innerLengthCm) ||
    hasValue(vehicle.innerWidthCm) ||
    hasValue(vehicle.innerHeightCm)
      ? {
          icon: Ruler,
          label: "Lòng thùng",
          value: `${formatOptionalNumber(
            vehicle.innerLengthCm,
            "cm"
          )} x ${formatOptionalNumber(
            vehicle.innerWidthCm,
            "cm"
          )} x ${formatOptionalNumber(vehicle.innerHeightCm, "cm")}`,
        }
      : null,
    hasValue(vehicle.minTemp) && hasValue(vehicle.maxTemp)
      ? {
          icon: Snowflake,
          label: "Dải nhiệt",
          value: `${vehicle.minTemp}°C - ${vehicle.maxTemp}°C`,
        }
      : null,
    hasValue(vehicle.standardFuelLiters)
      ? {
          icon: Fuel,
          label: "Nhiên liệu tiêu chuẩn",
          value: formatNumber(vehicle.standardFuelLiters!, "L"),
        }
      : null,
  ]);

  if (
    identificationRows.length === 0 &&
    specificationRows.length === 0 &&
    operationRows.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Thông tin xe tải
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
          <InfoSection
            title="Thông tin nhận diện"
            icon={Truck}
            rows={identificationRows}
          />
          <InfoSection
            title="Thông số kỹ thuật"
            icon={Gauge}
            rows={specificationRows}
          />
          <InfoSection
            title="Vận hành"
            icon={MapPin}
            rows={operationRows}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetailInfo;
