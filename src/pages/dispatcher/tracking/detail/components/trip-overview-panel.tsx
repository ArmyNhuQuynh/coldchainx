import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import {
  Clock,
  MapPin,
  Navigation,
  Radio,
  Thermometer,
  Truck,
  User,
} from "lucide-react";
import TrackingStatusBadge from "../../shared/tracking-status-badge";
import {
  formatCoordinate,
  formatTemperature,
  formatTrackingDateTime,
  getDeviceStatusClassName,
  getDeviceStatusLabel,
} from "../../shared/tracking-formatters";

type Props = {
  trip: TTrackingTrip | null | undefined;
};

const TripOverviewPanel = ({ trip }: Props) => {
  if (!trip) {
    return null;
  }

  const latest = trip.latestTelemetry;

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      <Card className="rounded-lg py-0 lg:col-span-2">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-4 w-4 text-blue-700" />
            Thông tin chuyến
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Trạng thái</p>
            <div className="mt-1">
              <TrackingStatusBadge status={trip.status} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mã kẹp chì</p>
            <p className="mt-1 font-medium">{trip.sealNumber || "-"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              Xe
            </p>
            <p className="mt-1 font-medium">{trip.vehicle?.truckPlate || "N/A"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Tài xế
            </p>
            <p className="mt-1 line-clamp-1 font-medium">{trip.driver || "N/A"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Bắt đầu
            </p>
            <p className="mt-1 font-medium">
              {formatTrackingDateTime(trip.startedAt ?? trip.plannedStartTime)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Navigation className="h-3.5 w-3.5" />
              ETA
            </p>
            <p className="mt-1 font-medium">
              {trip.eta?.estimatedDurationMinutes != null
                ? `${trip.eta.estimatedDurationMinutes} phút`
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg py-0">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="h-4 w-4 text-emerald-700" />
            Thiết bị IoT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Badge variant="outline" className={getDeviceStatusClassName(trip)}>
            {getDeviceStatusLabel(trip)}
          </Badge>
          <div>
            <p className="text-xs text-muted-foreground">Mã thiết bị</p>
            <p className="mt-1 truncate font-medium">
              {trip.device?.deviceCode || "Chưa có"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ping cuối</p>
            <p className="mt-1 text-sm">
              {formatTrackingDateTime(trip.device?.lastPingTime)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg py-0">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Thermometer className="h-4 w-4 text-rose-700" />
            Telemetry mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Nhiệt độ</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatTemperature(latest?.tempC)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Tọa độ
            </p>
            <p className="mt-1 text-sm">
              {formatCoordinate(latest?.lat)}, {formatCoordinate(latest?.lon)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Thời gian</p>
            <p className="mt-1 text-sm">
              {formatTrackingDateTime(latest?.timestamp)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOverviewPanel;
