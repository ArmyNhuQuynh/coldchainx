import { useIotDevice } from "@/hooks/use-iot-device";
import { useIotDeviceForm } from "@/hooks/use-iot-device-form";
import { useVehicle } from "@/hooks/use-vehicle";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toIotDeviceUpdateRequest } from "@/schemas/iot-device.mapper";
import type { TIotDeviceFormValues } from "@/schemas/iot-device.schema";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import IotDeviceForm from "../create-iot-device/components/iot-device-form";

const EditIotDevicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getIotDeviceById, getIotDevices, updateIotDevice } = useIotDevice();
  const { getVehicles } = useVehicle();
  const { data: vehicleResponse, isLoading: isLoadingVehicles } = getVehicles();
  const { data: assignedDevices = [] } = getIotDevices();
  const { data: device, isLoading } = getIotDeviceById(id);
  const vehicles = vehicleResponse?.data ?? [];

  const handleSubmit = async (values: TIotDeviceFormValues) => {
    if (!id) return;

    await updateIotDevice.mutateAsync({
      id,
      data: toIotDeviceUpdateRequest(values),
    });

    toast.success("Cập nhật thiết bị IoT thành công");
    navigate(PATH_ADMIN_DASHBOARD.iotDevice.detail(id));
  };

  const iotDeviceForm = useIotDeviceForm({
    device,
    onSubmit: handleSubmit,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!device || !id) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy thiết bị IoT
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Chỉnh sửa thiết bị IoT</h1>
            <p className="text-muted-foreground">
              {device.deviceCode || device.deviceId}
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.iotDevice.detail(id))}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <IotDeviceForm
        mode="edit"
        form={iotDeviceForm.form}
        vehicles={vehicles}
        assignedDevices={assignedDevices}
        currentDeviceId={id}
        isLoadingVehicles={isLoadingVehicles}
        isSubmitting={updateIotDevice.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.iotDevice.detail(id))}
        onSubmit={iotDeviceForm.handleSubmit}
      />
    </div>
  );
};

export default EditIotDevicePage;
