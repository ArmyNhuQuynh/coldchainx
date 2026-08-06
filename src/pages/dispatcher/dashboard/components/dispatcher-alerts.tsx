import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDashboardDateTime } from "@/components/dashboard/dashboard-formatters";
import type { TDashboardAlert } from "@/schemas/dashboard.schema";
import { AlertTriangle, ArrowRight, BellRing } from "lucide-react";

const alertTypeLabels: Record<string, string> = {
  TEMP_HIGH: "Nhiệt độ vượt ngưỡng",
  TEMP_LOW: "Nhiệt độ thấp hơn ngưỡng",
  IOT_OFFLINE: "Thiết bị IoT mất kết nối",
  VEHICLE_BREAKDOWN: "Xe gặp sự cố",
  ROUTE_DEVIATION: "Xe lệch tuyến",
  TRIP_DELAYED: "Chuyến bị trễ",
  TEMP_CRITICAL: "Nhiệt độ ở mức nguy hiểm",
  TEMP_FORECAST_BREACH: "Dự báo nhiệt độ vượt ngưỡng",
};

const severityClasses: Record<string, string> = {
  CRITICAL: "border-rose-300 bg-rose-50 text-rose-700",
  WARNING: "border-amber-300 bg-amber-50 text-amber-700",
  INFO: "border-sky-300 bg-sky-50 text-sky-700",
};

type Props = {
  alerts: TDashboardAlert[];
  onOpen: (alert: TDashboardAlert) => void;
};

const DispatcherAlerts = ({ alerts, onOpen }: Props) => (
  <Card className="gap-4 rounded-lg py-5 shadow-sm">
    <CardHeader className="px-5">
      <CardTitle className="flex items-center gap-2 text-base">
        <BellRing className="h-4 w-4 text-rose-600" />
        Cảnh báo cần xử lý
        <Badge variant="outline" className="ml-auto">
          {alerts.length}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="max-h-60 space-y-2 overflow-y-auto px-5 pr-3">
      {alerts.length === 0 ? (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          Không có cảnh báo vận hành trong ngày đã chọn.
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.alertId}
            className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={severityClasses[alert.severity] ?? severityClasses.INFO}
                >
                  {alert.severity}
                </Badge>
                <p className="font-medium">
                  {alertTypeLabels[alert.alertType] ?? alert.alertType}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {[alert.tripCode, alert.vehiclePlate].filter(Boolean).join(" · ") ||
                  "Chưa có mã chuyến"}
              </p>
              <p className="mt-1 text-sm">{alert.message}</p>
              {alert.createdAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Phát sinh lúc {formatDashboardDateTime(alert.createdAt)}
                </p>
              )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpen(alert)}>
              Xem chuyến
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

export default DispatcherAlerts;
