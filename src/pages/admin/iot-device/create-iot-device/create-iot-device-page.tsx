import { useIotDevice } from "@/hooks/use-iot-device";
import { useIotDeviceForm } from "@/hooks/use-iot-device-form";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toIotDeviceCreateRequest } from "@/schemas/iot-device.mapper";
import type { TIotDeviceFormValues } from "@/schemas/iot-device.schema";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IotDeviceForm from "./components/iot-device-form";

const CreateIotDevicePage = () => {
  const navigate = useNavigate();
  const { createIotDevice } = useIotDevice();

  const handleSubmit = async (values: TIotDeviceFormValues) => {
    const createdId = await createIotDevice.mutateAsync(
      toIotDeviceCreateRequest(values)
    );

    toast.success("Tạo thiết bị IoT thành công");
    navigate(
      createdId
        ? PATH_ADMIN_DASHBOARD.iotDevice.detail(createdId)
        : PATH_ADMIN_DASHBOARD.iotDevice.root
    );
  };

  const iotDeviceForm = useIotDeviceForm({ onSubmit: handleSubmit });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CirclePlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Thêm thiết bị IoT</h1>
            <p className="text-muted-foreground">
              Khai báo mã thiết bị trước khi gắn thiết bị vào xe.
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.iotDevice.root)}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <IotDeviceForm
        mode="create"
        form={iotDeviceForm.form}
        isSubmitting={createIotDevice.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.iotDevice.root)}
        onSubmit={iotDeviceForm.handleSubmit}
      />
    </div>
  );
};

export default CreateIotDevicePage;
