import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TDriverLicenseRequest } from "@/schemas/driver.schema";
import { IdCard, Save } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  DriverDateField,
  DriverTextField,
} from "./driver-form-fields";
import DriverFormSection from "./driver-form-section";

type Props = {
  form: UseFormReturn<TDriverLicenseRequest>;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const DriverLicenseForm = ({
  form,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const issueDate = form.watch("issueDate");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <DriverFormSection
        icon={IdCard}
        title="Thông tin bằng lái"
        description="Số bằng là duy nhất trong hệ thống, hạng bằng sẽ được BE chuẩn hóa chữ hoa."
      >
        <DriverTextField
          control={form.control}
          name="licenseNumber"
          label="Số GPLX"
          placeholder="GPLX-123456"
          maxLength={30}
          autoComplete="off"
        />
        <DriverTextField
          control={form.control}
          name="licenseClass"
          label="Hạng GPLX"
          placeholder="C"
          maxLength={5}
          autoComplete="off"
        />
        <DriverDateField
          control={form.control}
          name="issueDate"
          label="Ngày cấp"
          max={today}
        />
        <DriverDateField
          control={form.control}
          name="expiryDate"
          label="Ngày hết hạn"
          min={issueDate || undefined}
        />
      </DriverFormSection>

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
          {isSubmitting ? "Đang lưu..." : "Lưu GPLX"}
        </Button>
      </div>
      </form>
    </Form>
  );
};

export default DriverLicenseForm;
