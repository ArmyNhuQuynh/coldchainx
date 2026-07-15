import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { TServiceCatalog } from "@/schemas/service-catalog.schema";
import type {
  ServiceCatalogFormErrors,
  ServiceCatalogFormState,
} from "./service-catalog-form.utils";

type Props = {
  open: boolean;
  editingService: TServiceCatalog | null;
  formValues: ServiceCatalogFormState;
  formErrors: ServiceCatalogFormErrors;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldChange: (
    field: keyof ServiceCatalogFormState,
    value: string | boolean
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

const ServiceCatalogDialog = ({
  open,
  editingService,
  formValues,
  formErrors,
  isSubmitting,
  onOpenChange,
  onFieldChange,
  onCancel,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {editingService ? "Chỉnh sửa giá dịch vụ" : "Thêm giá dịch vụ"}
        </DialogTitle>
        <DialogDescription>
          Giá dịch vụ được dùng làm các khoản phí mặc định khi tạo báo giá.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="service-code"
          label="Mã dịch vụ"
          value={formValues.serviceCode}
          error={formErrors.serviceCode}
          disabled={!!editingService}
          onChange={(value) => onFieldChange("serviceCode", value)}
        />
        <FormField
          id="service-name"
          label="Tên dịch vụ"
          value={formValues.serviceName}
          error={formErrors.serviceName}
          onChange={(value) => onFieldChange("serviceName", value)}
        />
        <FormField
          id="default-price"
          label="Giá mặc định"
          type="number"
          value={formValues.defaultPrice}
          error={formErrors.defaultPrice}
          onChange={(value) => onFieldChange("defaultPrice", value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <SwitchField
            label="Bắt buộc"
            checked={formValues.isMandatory}
            onCheckedChange={(checked) => onFieldChange("isMandatory", checked)}
          />
          <SwitchField
            label="Đang dùng"
            checked={formValues.isActive}
            onCheckedChange={(checked) => onFieldChange("isActive", checked)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium" htmlFor="service-description">
            Mô tả
          </label>
          <Textarea
            id="service-description"
            value={formValues.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
          />
          {formErrors.description && (
            <p className="text-sm text-destructive">
              {formErrors.description}
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const FormField = ({
  id,
  label,
  value,
  error,
  type = "text",
  disabled,
  onChange,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" htmlFor={id}>
      {label}
    </label>
    <Input
      id={id}
      type={type}
      min={type === "number" ? 0 : undefined}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

type SwitchFieldProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const SwitchField = ({
  label,
  checked,
  onCheckedChange,
}: SwitchFieldProps) => (
  <div className="flex h-full items-center justify-between rounded-md border px-3 py-2">
    <span className="text-sm font-medium">{label}</span>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default ServiceCatalogDialog;
