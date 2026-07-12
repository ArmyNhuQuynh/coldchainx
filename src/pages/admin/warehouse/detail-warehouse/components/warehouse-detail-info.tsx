import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TWarehouse } from "@/schemas/warehouse.schema";
import { getWarehouseTypeLabel } from "@/types/enums/warehouse-type.enum";
import {
  Boxes,
  Hash,
  MapPin,
  Snowflake,
  Tag,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  warehouse: TWarehouse;
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

const formatTemperature = (min?: number | null, max?: number | null) => {
  if (!hasValue(min) || !hasValue(max)) return "—";

  return `${min}°C - ${max}°C`;
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
  if (rows.length === 0) return null;

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

const WarehouseDetailInfo = ({ warehouse }: Props) => {
  const identificationRows = compactRows([
    hasValue(warehouse.warehouseCode)
      ? {
          icon: Tag,
          label: "Mã kho",
          value: (
            <span className="text-primary font-semibold">
              {warehouse.warehouseCode}
            </span>
          ),
        }
      : null,
    hasValue(warehouse.warehouseName)
      ? { icon: Warehouse, label: "Tên kho", value: warehouse.warehouseName }
      : null,
    hasValue(warehouse.warehouseType)
      ? {
          icon: Hash,
          label: "Loại kho",
          value: getWarehouseTypeLabel(warehouse.warehouseType),
        }
      : null,
  ]);

  const locationRows = compactRows([
    hasValue(warehouse.address)
      ? { icon: MapPin, label: "Địa chỉ", value: warehouse.address }
      : null,
    {
      icon: Boxes,
      label: "Pallet đang chứa",
      value: formatNumber(warehouse.currentPallets ?? 0, "pallet"),
    },
    {
      icon: Boxes,
      label: "Sức chứa tối đa",
      value: formatNumber(warehouse.maxPallets, "pallet"),
    },
  ]);

  const coldRows = compactRows([
    {
      icon: Snowflake,
      label: "Dải nhiệt mặc định",
      value: formatTemperature(
        warehouse.defaultMinTemp,
        warehouse.defaultMaxTemp
      ),
    },
  ]);

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Thông tin kho
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
          <InfoSection
            title="Nhận diện"
            icon={Warehouse}
            rows={identificationRows}
          />
          <InfoSection title="Sức chứa" icon={Boxes} rows={locationRows} />
          <InfoSection title="Điều kiện lạnh" icon={Snowflake} rows={coldRows} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseDetailInfo;
