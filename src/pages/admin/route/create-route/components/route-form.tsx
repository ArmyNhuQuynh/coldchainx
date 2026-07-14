import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TRouteFormValues } from "@/schemas/route.schema";
import { ROUTE_STATUS_OPTIONS } from "@/types/enums/route-status.enum";
import { MapPin, Route, Save } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { RouteSelectField, RouteTextField } from "./route-form-fields";
import RouteFormSection from "./route-form-section";

type Props = {
  mode: "create" | "edit";
  form: UseFormReturn<TRouteFormValues>;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

const RouteForm = ({
  mode,
  form,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: Props) => {
  const submitLabel = mode === "create" ? "Tạo tuyến" : "Lưu thay đổi";
  const submittingLabel = mode === "create" ? "Đang tạo..." : "Đang lưu...";

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <RouteFormSection
          icon={Route}
          title="Thông tin tuyến"
          description="Khai báo mã tuyến, điểm đi, điểm đến và thời gian vận chuyển dự kiến."
        >
          <RouteTextField
            control={form.control}
            name="routeCode"
            label="Mã tuyến"
            placeholder="VD: HCM-DN"
            description="Chỉ dùng chữ in hoa, số và dấu gạch ngang."
          />
          {mode === "edit" ? (
            <RouteSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={ROUTE_STATUS_OPTIONS}
            />
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
              Tuyến mới sẽ được tạo ở trạng thái hoạt động.
            </div>
          )}
          <RouteTextField
            control={form.control}
            name="originCity"
            label="Điểm đi"
            placeholder="VD: HCM"
          />
          <RouteTextField
            control={form.control}
            name="destCity"
            label="Điểm đến"
            placeholder="VD: Da Nang"
          />
        </RouteFormSection>

        <RouteFormSection
          icon={MapPin}
          title="Vận hành tuyến"
          description="Phần này chỉ quản lý dữ liệu nền của tuyến, chưa tạo lịch chạy."
        >
          <RouteTextField
            control={form.control}
            name="transitTime"
            label="Thời gian vận chuyển"
            placeholder="VD: 2 days"
          />
          <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Lịch đi theo ngày và giờ sẽ do Dispatcher quản lý ở luồng điều phối.
          </div>
        </RouteFormSection>

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

export default RouteForm;
