import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TMonitoringAlert } from "@/schemas/monitoring.schema";
import { AlertTriangle } from "lucide-react";
import { formatTrackingDateTime } from "../../shared/tracking-formatters";

type Props = {
  alerts: TMonitoringAlert[];
};

const TrackingAlertsPanel = ({ alerts }: Props) => {
  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          Cảnh báo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Chưa có cảnh báo cold chain cho chuyến này.
          </p>
        )}

        {alerts.slice(0, 8).map((alert, index) => (
          <div key={alert.alertId ?? index} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {alert.title || alert.alertType || "Cảnh báo"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {alert.message || "Không có mô tả chi tiết"}
                </p>
              </div>
              {alert.status && <Badge variant="outline">{alert.status}</Badge>}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatTrackingDateTime(alert.createdAt)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrackingAlertsPanel;
