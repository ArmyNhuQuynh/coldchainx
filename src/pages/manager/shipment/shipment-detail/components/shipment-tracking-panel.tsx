import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTracking } from "@/hooks/use-tracking";
import { useDispatchOperations } from "@/hooks/use-dispatch";
import { Button } from "@/components/ui/button";
import { Activity, Thermometer, Droplets, MapPin, Loader2, Navigation } from "lucide-react";

type Props = {
  tripId: string;
};

export default function ShipmentTrackingPanel({ tripId }: Props) {
  const { getTrackingByTripId } = useTracking();
  const { checkVehicleIot } = useDispatchOperations();
  const { data: trackingData, isLoading, refetch, isFetching } = getTrackingByTripId(tripId);

  const data = trackingData?.data;

  const handleIotCheck = () => {
    if (data?.vehicle?.vehicleId) {
      checkVehicleIot.mutate({ tripId, vehicleId: data.vehicle.vehicleId });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Giám sát hành trình (Cold-chain)
        </div>
        <div className="flex items-center gap-2">
          {data?.vehicle?.vehicleId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleIotCheck}
              disabled={checkVehicleIot.isPending}
            >
              Kiểm tra IoT & Bắt đầu giám sát
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Làm mới"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!data ? (
          <div className="text-center text-muted-foreground py-4">
            Chưa có thông tin giám sát chuyến đi
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-slate-50">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div className="text-sm text-muted-foreground">Nhiệt độ hiện tại</div>
              <div className="text-2xl font-bold">
                {data.latestTelemetry?.tempC ?? data.latestTelemetry?.temperature ?? "--"} °C
              </div>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-slate-50">
              <Droplets className="h-8 w-8 text-blue-500" />
              <div className="text-sm text-muted-foreground">Độ ẩm hiện tại</div>
              <div className="text-2xl font-bold">
                {data.latestTelemetry?.humidityPercent ?? data.latestTelemetry?.humidity ?? "--"} %
              </div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-slate-50">
              <MapPin className="h-8 w-8 text-green-500" />
              <div className="text-sm text-muted-foreground">Vị trí xe (GPS)</div>
              <div className="text-lg font-semibold text-center">
                {data.latestTelemetry?.lat && data.latestTelemetry?.lon
                  ? `${data.latestTelemetry.lat.toFixed(4)}, ${data.latestTelemetry.lon.toFixed(4)}`
                  : "Chưa có tín hiệu"}
              </div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-slate-50">
              <Navigation className="h-8 w-8 text-purple-500" />
              <div className="text-sm text-muted-foreground">ETA (Dự kiến đến)</div>
              <div className="text-lg font-semibold text-center">
                {data.eta?.estimatedArrival
                  ? new Date(data.eta.estimatedArrival).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : "--"}
              </div>
              {data.eta?.remainingDistanceKm && (
                <div className="text-xs text-muted-foreground">
                  Còn {data.eta.remainingDistanceKm.toFixed(1)} km
                </div>
              )}
            </div>
          </div>
        )}

        {data?.device && (
          <div className="mt-6 text-sm text-muted-foreground border-t pt-4 flex gap-4">
            <div><span className="font-semibold text-foreground">Xe:</span> {data.vehicle?.truckPlate}</div>
            <div><span className="font-semibold text-foreground">Thiết bị IoT:</span> {data.device.deviceCode}</div>
            <div><span className="font-semibold text-foreground">Trạng thái:</span> {data.device.status}</div>
            {data.device.lastPingTime && (
              <div><span className="font-semibold text-foreground">Tín hiệu cuối:</span> {new Date(data.device.lastPingTime).toLocaleString("vi-VN")}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
