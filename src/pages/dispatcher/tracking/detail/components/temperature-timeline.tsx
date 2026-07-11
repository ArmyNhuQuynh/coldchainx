import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TTrackingPoint } from "@/schemas/monitoring.schema";
import { Activity } from "lucide-react";
import {
  formatTemperature,
  formatTrackingDateTime,
} from "../../shared/tracking-formatters";

type Props = {
  points: TTrackingPoint[];
  selectedPoint?: TTrackingPoint | null;
};

const TemperatureTimeline = ({ points, selectedPoint }: Props) => {
  const temperatures = points.map((point) => point.tempC);
  const hasTemperatures = temperatures.length > 0;
  const minTemp = hasTemperatures ? Math.min(...temperatures) : null;
  const maxTemp = hasTemperatures ? Math.max(...temperatures) : null;
  const range =
    minTemp != null && maxTemp != null ? Math.max(1, maxTemp - minTemp) : 1;
  const chartPoints = points.slice(-80);

  const polyline = chartPoints
    .map((point, index) => {
      const x =
        chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * 100;
      const y =
        minTemp != null ? 100 - ((point.tempC - minTemp) / range) * 100 : 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-emerald-700" />
          Lịch sử nhiệt độ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Điểm ghi nhận</p>
            <p className="mt-1 font-semibold">{points.length}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Thấp nhất</p>
            <p className="mt-1 font-semibold">{formatTemperature(minTemp)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Cao nhất</p>
            <p className="mt-1 font-semibold">{formatTemperature(maxTemp)}</p>
          </div>
        </div>

        <div className="h-44 rounded-lg border bg-background p-3">
          {chartPoints.length < 2 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Chưa đủ dữ liệu để vẽ biểu đồ
            </div>
          )}
          {chartPoints.length >= 2 && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <polyline
                points={polyline}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="text-emerald-600"
              />
            </svg>
          )}
        </div>

        {selectedPoint && (
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-medium">Điểm đang chọn trên bản đồ</p>
            <p className="mt-1 text-muted-foreground">
              {formatTemperature(selectedPoint.tempC)} -{" "}
              {formatTrackingDateTime(selectedPoint.timestamp)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemperatureTimeline;
