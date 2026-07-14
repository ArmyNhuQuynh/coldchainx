import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { getVehicleStatusLabel } from "@/types/enums/vehicle-status.enum";
import { getVehicleTypeLabel } from "@/types/enums/vehicle-type.enum";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  vehicle: TVehicle;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const VehicleDetailHeader = ({ vehicle }: Props) => {
  const navigate = useNavigate();
  const status = hasValue(vehicle.status)
    ? getVehicleStatusLabel(vehicle.status)
    : null;
  const summary = [
    vehicle.brand,
    vehicle.vehicleType ? getVehicleTypeLabel(vehicle.vehicleType) : null,
  ].filter(hasValue);

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Chi tiết xe tải</h1>
          <span className="text-2xl font-bold text-primary">
            {vehicle.truckPlate || vehicle.vehicleId}
          </span>
          {status && <Badge className={status.className}>{status.label}</Badge>}
        </div>
        {summary.length > 0 && (
          <p className="text-muted-foreground">{summary.join(" • ")}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.root)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.edit(vehicle.vehicleId))}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default VehicleDetailHeader;
