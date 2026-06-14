import { Card } from "@/components/ui/card";
import { useVehicle } from "@/hooks/use-vehicle";
import { useParams } from "react-router-dom";

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getVehicleById } = useVehicle();
  const { data, isLoading } = getVehicleById(id);

  const vehicle = data?.data.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy xe tải
      </div>
    );
  }

  const rows = [
    { label: "Biển số", value: vehicle.truckPlate },
    { label: "Hãng xe", value: vehicle.brand },
    { label: "Loại xe", value: vehicle.vehicleType },
    { label: "Tải trọng", value: vehicle.maxWeight },
    { label: "Trạng thái", value: vehicle.status },
    { label: "Số khung", value: vehicle.chassisNumber },
    { label: "Số máy", value: vehicle.engineNumber },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Chi tiết xe tải</h1>
        <p className="mt-1 text-muted-foreground">
          {vehicle.truckPlate || vehicle.vehicleId}
        </p>
      </div>

      <Card className="rounded-2xl p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <p className="mt-1 font-medium">{row.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default VehicleDetailPage;
