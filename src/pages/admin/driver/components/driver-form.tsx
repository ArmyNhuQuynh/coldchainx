import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { DriverFormMode } from "@/schemas/driver.mapper";
import type { TDriverFormValues } from "@/schemas/driver.schema";
import { DRIVER_STATUS_OPTIONS } from "@/types/enums/driver-status.enum";
import { CalendarDays, IdCard, Save, UserRound } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  DriverDateField,
  DriverSelectField,
  DriverTextField,
} from "./driver-form-fields";
import DriverFormSection from "./driver-form-section";

type Props = {
  mode: DriverFormMode;
  form: UseFormReturn<TDriverFormValues>;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const DriverForm = ({
  mode,
  form,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const isCreate = mode === "create";
  const includeLicense = form.watch("includeLicense");
  const submitLabel = isCreate ? "Tạo tài xế" : "Lưu thay đổi";
  const submittingLabel = isCreate ? "Đang tạo..." : "Đang lưu...";

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <DriverFormSection
          icon={UserRound}
          title="Thông tin cá nhân"
          description="Thông tin định danh và liên hệ dùng trong quản lý đội tài xế."
        >
          <DriverTextField
            control={form.control}
            name="fullName"
            label="Họ tên"
            placeholder="Nguyễn Văn Tài"
          />
          <DriverTextField
            control={form.control}
            name="email"
            label="Email"
            placeholder="driver@example.com"
          />
          <DriverTextField
            control={form.control}
            name="identityNumber"
            label="Số CCCD"
            placeholder="079200012345"
          />
          <DriverTextField
            control={form.control}
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="0909123456"
          />
        </DriverFormSection>

        <DriverFormSection
          icon={CalendarDays}
          title="Thông tin làm việc"
          description="Ngày sinh, ngày vào làm và trạng thái vận hành."
        >
          <DriverDateField
            control={form.control}
            name="dateOfBirth"
            label="Ngày sinh"
          />
          <DriverDateField
            control={form.control}
            name="joinDate"
            label="Ngày vào làm"
          />
          {!isCreate && (
            <DriverSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={DRIVER_STATUS_OPTIONS}
            />
          )}
        </DriverFormSection>

        {isCreate && (
          <DriverFormSection
            icon={IdCard}
            title="Bằng lái ban đầu"
            description="Có thể tạo tài xế trước rồi bổ sung GPLX sau nếu chưa đủ hồ sơ."
          >
            <FormField
              control={form.control}
              name="includeLicense"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 md:col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Tạo GPLX kèm theo
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {includeLicense && (
              <>
                <DriverTextField
                  control={form.control}
                  name="licenseNumber"
                  label="Số GPLX"
                  placeholder="GPLX-123456"
                />
                <DriverTextField
                  control={form.control}
                  name="licenseClass"
                  label="Hạng GPLX"
                  placeholder="C"
                />
                <DriverDateField
                  control={form.control}
                  name="issueDate"
                  label="Ngày cấp"
                />
                <DriverDateField
                  control={form.control}
                  name="expiryDate"
                  label="Ngày hết hạn"
                />
              </>
            )}
          </DriverFormSection>
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
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DriverForm;
