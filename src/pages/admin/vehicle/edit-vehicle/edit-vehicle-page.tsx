import { Card } from "@/components/ui/card";
import { useVehicle } from "@/hooks/use-vehicle";
import { useParams } from "react-router-dom";

const VehicleEditPage = () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Chỉnh sửa xe tải</h1>
        <p className="mt-1 text-muted-foreground">
          {vehicle?.truckPlate || id}
        </p>
      </div>

      <Card className="rounded-2xl p-6 text-muted-foreground">
        Form chỉnh sửa xe tải sẽ được nối vào endpoint cập nhật ở bước tiếp theo.
      </Card>
    </div>
  );
};

export default VehicleEditPage;
