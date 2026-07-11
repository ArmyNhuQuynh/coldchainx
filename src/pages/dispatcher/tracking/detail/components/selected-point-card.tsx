import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TTrackingPoint } from "@/schemas/monitoring.schema";
import { LocateFixed, Thermometer } from "lucide-react";
import {
  formatCoordinate,
  formatTemperature,
  formatTrackingDateTime,
} from "../../shared/tracking-formatters";

type Props = {
  point: TTrackingPoint | null;
  distanceMeters?: number | null;
};

const SelectedPointCard = ({ point, distanceMeters }: Props) => {
  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <LocateFixed className="h-4 w-4 text-blue-700" />
          Điểm đang chọn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!point && (
          <p className="text-sm text-muted-foreground">
            Bấm vào điểm telemetry hoặc đoạn hành trình trên bản đồ để xem vị trí,
            nhiệt độ và thời gian.
          </p>
        )}

        {point && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Nhiệt độ</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold">
                <Thermometer className="h-4 w-4 text-rose-700" />
                {formatTemperature(point.tempC)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vĩ độ</p>
              <p className="mt-1 font-medium">{formatCoordinate(point.lat)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kinh độ</p>
              <p className="mt-1 font-medium">{formatCoordinate(point.lon)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Thời gian</p>
              <p className="mt-1 font-medium">
                {formatTrackingDateTime(point.timestamp)}
              </p>
            </div>
            {distanceMeters != null && (
              <div className="sm:col-span-2 xl:col-span-4">
                <p className="text-xs text-muted-foreground">
                  Điểm telemetry gần vị trí bấm nhất: {Math.round(distanceMeters)} m
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedPointCard;
