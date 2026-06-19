import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TVehicleFormValues } from "@/schemas/vehicle.schema";
import {
  getVehicleStatusLabel,
  VEHICLE_STATUS,
} from "@/types/enums/vehicle-status.enum";
import { getVehicleTypeLabel, VEHICLE_TYPE } from "@/types/enums/vehicle-type.enum";
import { Gauge, MapPin, Save, Snowflake, Truck } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  VehicleNumberField,
  VehicleSelectField,
  VehicleTextField,
} from "./vehicle-form-fields";
import VehicleFormSection from "./vehicle-form-section";

type Props = {
  mode: "create" | "edit";
  form: UseFormReturn<TVehicleFormValues>;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const vehicleTypeOptions = Object.values(VEHICLE_TYPE).map((value) => ({
  value,
  label: getVehicleTypeLabel(value),
}));

const vehicleStatusOptions = Object.values(VEHICLE_STATUS).map((value) => ({
  value,
  label: getVehicleStatusLabel(value).label,
}));

const VehicleForm = ({
  mode,
  form,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const submitLabel = mode === "create" ? "Tạo xe" : "Lưu thay đổi";
  const submittingLabel = mode === "create" ? "Đang tạo..." : "Đang lưu...";

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <VehicleFormSection
          icon={Truck}
          title="Thông tin nhận diện"
          description="Các thông tin giúp đội vận hành nhận ra xe trong danh sách và hồ sơ."
        >
          <VehicleTextField
            control={form.control}
            name="truckPlate"
            label="Biển số"
            placeholder="VD: 51C-12345"
          />
          <VehicleTextField
            control={form.control}
            name="brand"
            label="Hãng xe"
            placeholder="VD: Hyundai"
          />
        </VehicleFormSection>

        <VehicleFormSection
          icon={Gauge}
          title="Thông số vận hành"
          description="Cấu hình năng lực chở hàng, thể tích, nhiên liệu và trạng thái khai thác."
        >
          <VehicleSelectField
            control={form.control}
            name="vehicleType"
            label="Loại xe"
            placeholder="Chọn loại xe"
            options={vehicleTypeOptions}
          />
          {mode === "edit" && (
            <VehicleSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={vehicleStatusOptions}
              emptyLabel="Chưa đặt trạng thái"
            />
          )}
          <VehicleNumberField
            control={form.control}
            name="maxWeight"
            label="Tải trọng tối đa"
            placeholder="VD: 20000"
            min={0}
            unit="kg"
          />
          <VehicleNumberField
            control={form.control}
            name="maxCbm"
            label="Thể tích tối đa"
            placeholder="VD: 67"
            min={0}
            step={0.01}
            unit="m³"
          />
          <VehicleNumberField
            control={form.control}
            name="standardFuelLiters"
            label="Định mức nhiên liệu"
            placeholder="VD: 400"
            min={0}
            step={0.01}
            unit="L"
          />
        </VehicleFormSection>

        <VehicleFormSection
          icon={Snowflake}
          title="Điều kiện lạnh"
          description="Dải nhiệt mà xe có thể duy trì trong quá trình vận chuyển hàng lạnh."
        >
          <VehicleNumberField
            control={form.control}
            name="minTemp"
            label="Nhiệt độ tối thiểu"
            placeholder="VD: -25"
            step={0.1}
            unit="°C"
          />
          <VehicleNumberField
            control={form.control}
            name="maxTemp"
            label="Nhiệt độ tối đa"
            placeholder="VD: 15"
            step={0.1}
            unit="°C"
          />
        </VehicleFormSection>

        {mode === "create" && (
          <VehicleFormSection
            icon={MapPin}
            title="Vận hành ban đầu"
            description="Vị trí và số kilomet ban đầu theo API Fleet hiện tại."
          >
            <VehicleTextField
              control={form.control}
              name="currentLocation"
              label="Vị trí hiện tại"
              placeholder="VD: Kho Bình Thạnh"
            />
            <VehicleNumberField
              control={form.control}
              name="currentOdometer"
              label="Số km hiện tại"
              placeholder="VD: 25000"
              min={0}
              step={0.1}
              unit="km"
            />
            <VehicleNumberField
              control={form.control}
              name="nextMaintenanceOdometer"
              label="Mốc bảo dưỡng tiếp theo"
              placeholder="Để trống để BE tự tính"
              min={0}
              step={0.1}
              unit="km"
            />
          </VehicleFormSection>
        )}

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
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
