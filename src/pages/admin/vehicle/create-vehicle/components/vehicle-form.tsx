import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TVehicleFormValues } from "@/schemas/vehicle.schema";
import {
  getVehicleStatusLabel,
  VEHICLE_STATUS,
} from "@/types/enums/vehicle-status.enum";
import { getVehicleTypeLabel, VEHICLE_TYPE } from "@/types/enums/vehicle-type.enum";
import { Gauge, Save, Snowflake, Truck } from "lucide-react";
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
          <VehicleNumberField
            control={form.control}
            name="manufactureYear"
            label="Năm sản xuất"
            placeholder="VD: 2024"
            min={1900}
          />
          <VehicleTextField
            control={form.control}
            name="chassisNumber"
            label="Số khung"
            placeholder="Nhập số khung"
          />
          <VehicleTextField
            control={form.control}
            name="engineNumber"
            label="Số máy"
            placeholder="Nhập số máy"
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
          <VehicleSelectField
            control={form.control}
            name="status"
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            options={vehicleStatusOptions}
            emptyLabel="Chưa đặt trạng thái"
          />
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
