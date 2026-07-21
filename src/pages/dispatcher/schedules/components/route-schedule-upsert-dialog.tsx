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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TRoute } from "@/schemas/route.schema";
import type {
  TRouteSchedule,
  TRouteScheduleFormValues,
} from "@/schemas/route-schedule.schema";
import { ROUTE_SCHEDULE_STATUS_OPTIONS } from "@/types/enums/route-schedule-status.enum";
import type { ReactNode } from "react";
import {
  formatScheduleDate,
  type RouteScheduleFormErrors,
} from "./route-schedule-utils";

type Props = {
  open: boolean;
  routes: TRoute[];
  editingSchedule: TRouteSchedule | null;
  values: TRouteScheduleFormValues;
  errors: RouteScheduleFormErrors;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldChange: (
    field: keyof TRouteScheduleFormValues,
    value: string
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

const splitTime = (value: string) => {
  const [hour = "", minute = ""] = value.split(":");

  return {
    hour: HOUR_OPTIONS.includes(hour) ? hour : "",
    minute: MINUTE_OPTIONS.includes(minute) ? minute : "",
  };
};

const getRouteLabel = (route?: TRoute) => {
  if (!route) return "Chưa chọn tuyến";

  return `${route.routeCode} · ${route.originCity} -> ${route.destCity}`;
};

const RouteScheduleUpsertDialog = ({
  open,
  routes,
  editingSchedule,
  values,
  errors,
  isSubmitting,
  onOpenChange,
  onFieldChange,
  onCancel,
  onSubmit,
}: Props) => {
  const selectedRoute = routes.find((route) => route.routeId === values.routeId);
  const departurePreview =
    values.departureDate && values.departureTime
      ? `${formatScheduleDate(values.departureDate)} lúc ${values.departureTime}`
      : "Chưa chọn đủ ngày và giờ xuất phát";
  const cutOffPreview = values.cutOffTime
    ? `Cut-off lúc ${values.cutOffTime}`
    : "Chưa chọn giờ cut-off";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingSchedule ? "Chỉnh sửa lịch đi" : "Tạo lịch đi"}
          </DialogTitle>
          <DialogDescription>
            Thiết lập tuyến, ngày chạy, giờ xuất phát và thời điểm cut-off.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FormSection
            title="Tuyến vận chuyển"
            description={
              editingSchedule
                ? "Route của lịch đang sửa được giữ nguyên theo endpoint hiện tại."
                : "Chọn route trước khi tạo lịch chạy mới."
            }
          >
            <label className="space-y-2 text-sm">
              <span className="font-medium">Route</span>
              <Select
                value={values.routeId || undefined}
                onValueChange={(value) => onFieldChange("routeId", value)}
                disabled={isSubmitting || !!editingSchedule}
              >
                <SelectTrigger className="h-11 w-full bg-card">
                  <SelectValue placeholder="Chọn tuyến vận chuyển" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {routes.map((route) => (
                    <SelectItem key={route.routeId} value={route.routeId}>
                      {getRouteLabel(route)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.routeId && (
                <p className="text-sm text-destructive">{errors.routeId}</p>
              )}
            </label>
          </FormSection>

          <FormSection
            title="Thời điểm xuất phát"
            description="Ngày và giờ xe dự kiến bắt đầu chạy theo lịch."
          >
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <FormField
                id="departure-date"
                label="Ngày đi"
                type="date"
                value={values.departureDate}
                error={errors.departureDate}
                onChange={(value) => onFieldChange("departureDate", value)}
              />

              <TimeSelector
                label="Giờ xuất phát"
                value={values.departureTime}
                error={errors.departureTime}
                onChange={(value) => onFieldChange("departureTime", value)}
              />
            </div>
          </FormSection>

          <FormSection
            title="Cut-off"
            description="Thời điểm cuối cùng nhận gom hàng cho lịch này."
          >
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <TimeSelector
                label="Giờ cut-off"
                value={values.cutOffTime}
                error={errors.cutOffTime}
                onChange={(value) => onFieldChange("cutOffTime", value)}
              />

              <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                <p className="font-medium text-foreground">
                  {getRouteLabel(selectedRoute)}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {departurePreview} · {cutOffPreview}
                </p>
              </div>
            </div>
          </FormSection>

          {editingSchedule && (
            <FormSection
              title="Trạng thái nhận đơn"
              description="Đóng nhận đơn chỉ ngăn đơn mới; các đơn đã đặt vẫn tiếp tục được vận hành."
            >
              <label className="space-y-2 text-sm">
                <span className="font-medium">Nhận đơn cho lịch</span>
                <Select
                  value={values.status}
                  onValueChange={(value) => onFieldChange("status", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11 w-full bg-card">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUTE_SCHEDULE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </label>
            </FormSection>
          )}
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
};

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const FormSection = ({ title, description, children }: FormSectionProps) => (
  <section className="rounded-xl border bg-muted/20 p-4">
    <div className="mb-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
    {children}
  </section>
);

type FormFieldProps = {
  id: string;
  label: string;
  type: "date";
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const FormField = ({
  id,
  label,
  type,
  value,
  error,
  onChange,
}: FormFieldProps) => (
  <label className="space-y-2 text-sm" htmlFor={id}>
    <span className="font-medium">{label}</span>
    <Input
      id={id}
      type={type}
      className="h-11 bg-card"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </label>
);

type TimeSelectorProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const TimeSelector = ({ label, value, error, onChange }: TimeSelectorProps) => {
  const { hour, minute } = splitTime(value);

  const handleHourChange = (nextHour: string) => {
    onChange(`${nextHour}:${minute || "00"}`);
  };

  const handleMinuteChange = (nextMinute: string) => {
    onChange(`${hour || "00"}:${nextMinute}`);
  };

  return (
    <div className="space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Select value={hour || undefined} onValueChange={handleHourChange}>
          <SelectTrigger className="h-11 bg-card">
            <SelectValue placeholder="Giờ" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {HOUR_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">:</span>

        <Select value={minute || undefined} onValueChange={handleMinuteChange}>
          <SelectTrigger className="h-11 bg-card">
            <SelectValue placeholder="Phút" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {MINUTE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default RouteScheduleUpsertDialog;
