import { useVehicleForm } from "@/hooks/use-vehicle-form";
import { useVehicle } from "@/hooks/use-vehicle";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toVehicleUpdateRequest } from "@/schemas/vehicle.mapper";
import type { TVehicleFormValues } from "@/schemas/vehicle.schema";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import VehicleForm from "../create-vehicle/components/vehicle-form";

const VehicleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getVehicleById, updateVehicle } = useVehicle();
  const { data, isLoading } = getVehicleById(id);

  const vehicle = data?.data;

  const handleSubmit = async (values: TVehicleFormValues) => {
    if (!id) {
      return;
    }

    await updateVehicle.mutateAsync({
      id,
      data: toVehicleUpdateRequest(values),
    });
    toast.success("Cập nhật xe thành công");
    navigate(PATH_ADMIN_DASHBOARD.vehicle.detail(id));
  };
  const vehicleForm = useVehicleForm({ vehicle, onSubmit: handleSubmit });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!vehicle || !id) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy xe tải
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Chỉnh sửa xe tải</h1>
              <p className="text-muted-foreground">
                {vehicle.truckPlate || vehicle.vehicleId}
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.detail(id))}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <VehicleForm
        mode="edit"
        form={vehicleForm.form}
        isSubmitting={updateVehicle.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.detail(id))}
        onSubmit={vehicleForm.handleSubmit}
      />
    </div>
  );
};

export default VehicleEditPage;
