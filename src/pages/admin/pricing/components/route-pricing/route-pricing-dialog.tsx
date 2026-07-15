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
import type { TWeightTier } from "@/schemas/weight-tier.schema";
import type {
  WeightTierFormErrors,
  WeightTierFormState,
} from "./route-pricing.utils";

type Props = {
  open: boolean;
  editingTier: TWeightTier | null;
  formValues: WeightTierFormState;
  formErrors: WeightTierFormErrors;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldChange: (field: keyof WeightTierFormState, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

const RoutePricingDialog = ({
  open,
  editingTier,
  formValues,
  formErrors,
  isSubmitting,
  onOpenChange,
  onFieldChange,
  onCancel,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {editingTier ? "Chỉnh sửa mức giá" : "Thêm mức giá"}
        </DialogTitle>
        <DialogDescription>
          Mỗi khoảng cân của một tuyến không được chồng lên khoảng cân khác.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="min-weight"
          label="Từ kg"
          value={formValues.minWeightKg}
          error={formErrors.minWeightKg}
          onChange={(value) => onFieldChange("minWeightKg", value)}
        />

        <FormField
          id="max-weight"
          label="Đến kg"
          value={formValues.maxWeightKg}
          error={formErrors.maxWeightKg}
          placeholder="Để trống nếu không giới hạn"
          onChange={(value) => onFieldChange("maxWeightKg", value)}
        />

        <FormField
          id="price-per-kg"
          label="Giá/kg"
          value={formValues.pricePerKg}
          error={formErrors.pricePerKg}
          className="md:col-span-2"
          onChange={(value) => onFieldChange("pricePerKg", value)}
        />
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
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
};

const FormField = ({
  id,
  label,
  value,
  error,
  placeholder,
  className,
  onChange,
}: FormFieldProps) => (
  <div className={`space-y-2 ${className ?? ""}`}>
    <label className="text-sm font-medium" htmlFor={id}>
      {label}
    </label>
    <Input
      id={id}
      type="number"
      inputMode="decimal"
      min={0}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

export default RoutePricingDialog;
