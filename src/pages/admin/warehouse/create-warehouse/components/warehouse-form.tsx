import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TWarehouseFormValues } from "@/schemas/warehouse.schema";
import { WAREHOUSE_STATUS_OPTIONS } from "@/types/enums/warehouse-status.enum";
import {
  WAREHOUSE_TYPE,
  WAREHOUSE_TYPE_OPTIONS,
} from "@/types/enums/warehouse-type.enum";
import { Boxes, MapPin, Save, Snowflake, Warehouse } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  WarehouseNumberField,
  WarehouseSelectField,
  WarehouseTextField,
  WarehouseTextareaField,
} from "./warehouse-form-fields";
import WarehouseFormSection from "./warehouse-form-section";

type Props = {
  mode: "create" | "edit";
  form: UseFormReturn<TWarehouseFormValues>;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const WarehouseForm = ({
  mode,
  form,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const warehouseType = form.watch("warehouseType");
  const isColdWarehouse = warehouseType === WAREHOUSE_TYPE.COLD;
  const submitLabel = mode === "create" ? "Tạo kho" : "Lưu thay đổi";
  const submittingLabel = mode === "create" ? "Đang tạo..." : "Đang lưu...";

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <WarehouseFormSection
          icon={Warehouse}
          title="Thông tin kho"
          description="Mã kho, tên kho, loại kho và trạng thái vận hành hiện tại."
        >
          <WarehouseTextField
            control={form.control}
            name="warehouseCode"
            label="Mã kho"
            placeholder="VD: COLD-HCM-01"
            description="Chỉ dùng chữ in hoa, số và dấu gạch ngang."
          />
          <WarehouseTextField
            control={form.control}
            name="warehouseName"
            label="Tên kho"
            placeholder="VD: Cold Storage Hub Tan Tao"
          />
          <WarehouseSelectField
            control={form.control}
            name="warehouseType"
            label="Loại kho"
            placeholder="Chọn loại kho"
            options={WAREHOUSE_TYPE_OPTIONS}
          />
          <WarehouseSelectField
            control={form.control}
            name="status"
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            options={WAREHOUSE_STATUS_OPTIONS}
          />
        </WarehouseFormSection>

        <WarehouseFormSection
          icon={Boxes}
          title="Sức chứa"
          description="Cấu hình số pallet tối đa và địa chỉ kho."
        >
          <WarehouseNumberField
            control={form.control}
            name="maxPallets"
            label="Sức chứa pallet"
            placeholder="VD: 500"
            min={0}
            unit="pallet"
          />
          <div />
          <WarehouseTextareaField
            control={form.control}
            name="address"
            label="Địa chỉ"
            placeholder="VD: KCN Tân Tạo, Bình Tân, TP.HCM"
          />
        </WarehouseFormSection>

        {isColdWarehouse && (
          <WarehouseFormSection
            icon={Snowflake}
            title="Cấu hình lạnh"
            description="Kho lạnh cần khai báo dải nhiệt mặc định để phục vụ lưu trữ hàng lạnh."
          >
            <WarehouseNumberField
              control={form.control}
              name="defaultMinTemp"
              label="Nhiệt độ tối thiểu"
              placeholder="VD: -18"
              step={0.1}
              unit="°C"
            />
            <WarehouseNumberField
              control={form.control}
              name="defaultMaxTemp"
              label="Nhiệt độ tối đa"
              placeholder="VD: -5"
              step={0.1}
              unit="°C"
            />
          </WarehouseFormSection>
        )}

        {!isColdWarehouse && (
          <WarehouseFormSection
            icon={MapPin}
            title="Ghi chú vận hành"
            description="Kho không phải kho lạnh không cần dải nhiệt mặc định."
          >
            <div className="md:col-span-2 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
              Dải nhiệt sẽ được gửi là rỗng cho loại kho hiện tại.
            </div>
          </WarehouseFormSection>
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

export default WarehouseForm;
