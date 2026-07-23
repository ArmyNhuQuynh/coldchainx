import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type {
  TIotDeviceFormValues,
} from "@/schemas/iot-device.schema";
import {
  getIotDeviceEditableStatusOptions,
  getIotDeviceStatusLabel,
} from "@/types/enums/iot-device-status.enum";
import { RadioTower, Save } from "lucide-react";
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
  currentStatus?: string | null;
  isAssigned?: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const IotDeviceForm = ({
  mode,
  form,
  currentStatus,
  isAssigned = false,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const submitLabel = mode === "create" ? "Tạo thiết bị" : "Lưu thay đổi";
  const submittingLabel = mode === "create" ? "Đang tạo..." : "Đang lưu...";
  const statusOptions = getIotDeviceEditableStatusOptions(
    currentStatus,
    isAssigned
  ).map((option) => ({
    ...option,
    label: getIotDeviceStatusLabel(option.value).label,
  }));

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
