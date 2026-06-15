import { useVehicleForm } from "@/hooks/use-vehicle-form";
import { useVehicle } from "@/hooks/use-vehicle";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import {
  toVehicleCreateFormData,
  toVehicleCreateRequest,
} from "@/schemas/vehicle.mapper";
import type { TVehicleFormValues } from "@/schemas/vehicle.schema";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VehicleForm from "./components/vehicle-form";

const CreateVehiclePage = () => {
  const navigate = useNavigate();
  const { createVehicle } = useVehicle();

  const handleSubmit = async (values: TVehicleFormValues) => {
    const request = toVehicleCreateRequest(values);
    const response = await createVehicle.mutateAsync(
      toVehicleCreateFormData(request)
    );
    const vehicleId = response.data.data?.vehicleId;

    toast.success("Tạo xe thành công");
    navigate(
      vehicleId
        ? PATH_ADMIN_DASHBOARD.vehicle.detail(vehicleId)
      : PATH_ADMIN_DASHBOARD.vehicle.root
    );
  };
  const vehicleForm = useVehicleForm({ onSubmit: handleSubmit });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CirclePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Thêm xe mới</h1>
              <p className="text-muted-foreground">
                Khai báo thông tin xe tải và cấu hình vận hành ban đầu.
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.root)}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <VehicleForm
        mode="create"
        form={vehicleForm.form}
        isSubmitting={createVehicle.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.vehicle.root)}
        onSubmit={vehicleForm.handleSubmit}
      />
    </div>
  );
};

export default CreateVehiclePage;
