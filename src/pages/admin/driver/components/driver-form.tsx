import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { DriverFormMode } from "@/schemas/driver.mapper";
import type { TDriverFormValues } from "@/schemas/driver.schema";
import {
  DRIVER_MANUAL_STATUS_OPTIONS,
  DRIVER_STATUS,
  getDriverStatusLabel,
  isDriverStatusManuallyEditable,
  normalizeDriverStatus,
} from "@/types/enums/driver-status.enum";
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
  driverStatus?: string | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const yearsAgoInputValue = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return toDateInputValue(date);
};

const DriverForm = ({
  mode,
  form,
  driverStatus,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const isCreate = mode === "create";
  const includeLicense = form.watch("includeLicense");
  const licenseIssueDate = form.watch("issueDate");
  const today = toDateInputValue(new Date());
  const submitLabel = isCreate ? "Tạo tài xế" : "Lưu thay đổi";
  const submittingLabel = isCreate ? "Đang tạo..." : "Đang lưu...";
  const normalizedStatus = normalizeDriverStatus(driverStatus);
  const statusDisplay = getDriverStatusLabel(driverStatus);
  const canEditStatus = isDriverStatusManuallyEditable(driverStatus);
  const statusDescription =
    normalizedStatus === DRIVER_STATUS.PLANNING
      ? "Tài xế đang được phân công cho một chuyến chưa xuất phát."
      : normalizedStatus === DRIVER_STATUS.ON_TRIP
        ? "Tài xế đang thực hiện chuyến vận chuyển."
        : normalizedStatus === DRIVER_STATUS.RELAX
          ? "Tài xế đang trong thời gian nghỉ theo giới hạn giờ lái."
          : normalizedStatus === DRIVER_STATUS.SUSPENDED_DOCS
            ? "Cần bổ sung GPLX hợp lệ trước khi tài xế có thể hoạt động."
            : "Trạng thái này được hệ thống tự động quản lý.";

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
            maxLength={100}
            autoComplete="name"
          />
          <DriverTextField
            control={form.control}
            name="email"
            label="Email"
            placeholder="driver@example.com"
            type="email"
            inputMode="email"
            maxLength={254}
            autoComplete="email"
          />
          <DriverTextField
            control={form.control}
            name="identityNumber"
            label="Số CCCD"
            placeholder="079200012345"
            inputMode="numeric"
            maxLength={12}
            autoComplete="off"
          />
          <DriverTextField
            control={form.control}
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="0909123456"
            type="tel"
            inputMode="tel"
            maxLength={12}
            autoComplete="tel"
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
            min={yearsAgoInputValue(70)}
            max={yearsAgoInputValue(18)}
          />
          <DriverDateField
            control={form.control}
            name="joinDate"
            label="Ngày vào làm"
            max={today}
          />
          {!isCreate && canEditStatus && (
            <DriverSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={DRIVER_MANUAL_STATUS_OPTIONS}
            />
          )}
          {!isCreate && !canEditStatus && (
            <div className="space-y-2">
              <FormLabel>Trạng thái</FormLabel>
              <div className="flex min-h-11 items-center">
                <Badge variant="outline" className={statusDisplay.className}>
                  {statusDisplay.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{statusDescription}</p>
            </div>
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
                  min={licenseIssueDate || undefined}
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
