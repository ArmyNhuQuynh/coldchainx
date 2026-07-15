import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type {
  TIotDevice,
  TIotDeviceFormValues,
} from "@/schemas/iot-device.schema";
import type { TVehicle } from "@/schemas/vehicle.schema";
import {
  getIotDeviceStatusLabel,
  IOT_DEVICE_STATUS_OPTIONS,
} from "@/types/enums/iot-device-status.enum";
import { Link2, RadioTower, Save } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  IotDeviceSelectField,
  IotDeviceTextField,
} from "./iot-device-form-fields";
import IotDeviceFormSection from "./iot-device-form-section";

type Props = {
  mode: "create" | "edit";
  form: UseFormReturn<TIotDeviceFormValues>;
  vehicles: TVehicle[];
  assignedDevices?: TIotDevice[];
  currentDeviceId?: string;
  isLoadingVehicles?: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const toVehicleOptions = (vehicles: TVehicle[]) =>
  vehicles.map((vehicle) => ({
    value: vehicle.vehicleId,
    label: `${vehicle.truckPlate || vehicle.vehicleId}${
      vehicle.brand ? ` - ${vehicle.brand}` : ""
    }`,
  }));

const statusOptions = IOT_DEVICE_STATUS_OPTIONS.map((option) => ({
  ...option,
  label: getIotDeviceStatusLabel(option.value).label,
}));

const IotDeviceForm = ({
  mode,
  form,
  vehicles,
  assignedDevices = [],
  currentDeviceId,
  isLoadingVehicles = false,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const submitLabel = mode === "create" ? "Tạo thiết bị" : "Lưu thay đổi";
  const submittingLabel = mode === "create" ? "Đang tạo..." : "Đang lưu...";
  const availableVehicles = vehicles.filter((vehicle) => {
    const assignedDevice = assignedDevices.find(
      (device) => device.vehicleId === vehicle.vehicleId
    );

    return !assignedDevice || assignedDevice.deviceId === currentDeviceId;
  });
  const vehicleOptions = toVehicleOptions(availableVehicles);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <IotDeviceFormSection
          icon={RadioTower}
          title="Thông tin thiết bị"
          description="Mã thiết bị phải trùng với deviceCode mà thiết bị gửi telemetry về BE."
        >
          <IotDeviceTextField
            control={form.control}
            name="deviceCode"
            label="Mã thiết bị"
            placeholder="VD: CCX-IOT-001"
          />

          {mode === "edit" && (
            <IotDeviceSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={statusOptions}
            />
          )}
        </IotDeviceFormSection>

        <IotDeviceFormSection
          icon={Link2}
          title="Gắn với xe"
          description="Chọn xe để gắn thiết bị. Chọn “Chưa gắn xe” khi cần gỡ thiết bị khỏi xe hiện tại."
        >
          <IotDeviceSelectField
            control={form.control}
            name="vehicleId"
            label="Xe"
            placeholder={isLoadingVehicles ? "Đang tải xe..." : "Chọn xe"}
            options={vehicleOptions}
            emptyLabel="Chưa gắn xe"
            disabled={isLoadingVehicles}
            description="Chỉ hiển thị xe chưa gắn IoT hoặc xe đang gắn với thiết bị này."
          />
        </IotDeviceFormSection>

        <div className="flex flex-col-reverse gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IotDeviceForm;
