import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { CalendarClock, MapPinned, Package, RadioTower, Thermometer, Truck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatIncidentDate } from "@/components/incidents/incident-formatters";

type Props = {
  trip?: TTrackingTrip | null;
  tripId?: string | null;
  isLoading?: boolean;
};

const TripContextPanel = ({ trip, tripId, isLoading }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Chuyến đang gặp sự cố</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Xe, tài xế, đơn hàng và telemetry mới nhất
            </p>
          </div>
          {trip?.status && <Badge variant="outline" className="rounded-md bg-transparent">{trip.status}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {isLoading && <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-36 w-full" /></div>}

        {!isLoading && !trip && (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            BE chưa trả được ngữ cảnh tracking cho trip này.
          </div>
        )}

        {!isLoading && trip && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><Truck className="h-3.5 w-3.5" /> Xe hiện tại</p>
                <p className="mt-2 font-semibold">{trip.vehicle?.truckPlate || "—"}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><UserRound className="h-3.5 w-3.5" /> Tài xế</p>
                <p className="mt-2 line-clamp-2 font-semibold">{trip.driver || trip.drivers.map((driver) => driver.fullName).filter(Boolean).join(", ") || "—"}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><RadioTower className="h-3.5 w-3.5" /> Thiết bị IoT</p>
                <p className="mt-2 font-semibold">{trip.device?.deviceCode || "Chưa gắn"}</p>
                <p className={`mt-1 text-xs ${trip.device?.isOnline ? "text-emerald-700" : "text-muted-foreground"}`}>
                  {trip.device?.isOnline ? "Đang online" : "Chưa xác nhận online"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><Thermometer className="h-3.5 w-3.5" /> Nhiệt độ mới nhất</p>
                <p className="mt-2 font-semibold">{trip.latestTelemetry?.tempC != null ? `${trip.latestTelemetry.tempC}°C` : "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatIncidentDate(trip.latestTelemetry?.timestamp)}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-lg border p-4">
                <p className="flex items-center gap-2 font-medium"><CalendarClock className="h-4 w-4" /> Hành trình</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Bắt đầu</dt><dd>{formatIncidentDate(trip.startedAt || trip.plannedStartTime)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">ETA</dt><dd>{formatIncidentDate(trip.eta?.estimatedArrival)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Còn lại</dt><dd>{trip.eta?.remainingDistanceKm != null ? `${trip.eta.remainingDistanceKm} km` : "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Tọa độ</dt><dd className="text-right">{trip.latestTelemetry?.lat != null && trip.latestTelemetry?.lon != null ? `${trip.latestTelemetry.lat}, ${trip.latestTelemetry.lon}` : "—"}</dd></div>
                </dl>
              </div>

              <div className="rounded-lg border">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <p className="flex items-center gap-2 font-medium"><Package className="h-4 w-4" /> Đơn hàng trên chuyến</p>
                  <Badge variant="outline" className="rounded-md bg-transparent">{trip.orderCount} đơn</Badge>
                </div>
                <div className="max-h-44 space-y-2 overflow-y-auto p-3">
                  {trip.orders.length === 0 && <p className="py-5 text-center text-sm text-muted-foreground">Chưa có dữ liệu đơn hàng</p>}
                  {trip.orders.map((order) => (
                    <div key={order.orderId || order.trackingCode} className="flex items-start justify-between gap-3 border-b px-1 py-2 last:border-b-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{order.trackingCode || order.orderId}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{order.itemName || "Không có tên hàng"}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{order.tempCondition || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {tripId && (
              <Button type="button" variant="outline" className="w-full gap-2" onClick={() => navigate(PATH_DISPATCHER_DASHBOARD.tracking.detail(tripId))}>
                <MapPinned className="h-4 w-4" /> Mở bản đồ theo dõi chuyến
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TripContextPanel;
