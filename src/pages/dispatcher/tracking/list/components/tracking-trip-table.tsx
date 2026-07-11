import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import {
  Clock,
  Eye,
  MapPinned,
  Navigation,
  Radio,
  Thermometer,
  Truck,
  User,
} from "lucide-react";
import TrackingStatusBadge from "../../shared/tracking-status-badge";
import {
  formatShortTripId,
  formatTemperature,
  formatTrackingDateTime,
  getDeviceStatusClassName,
  getDeviceStatusLabel,
} from "../../shared/tracking-formatters";

type Props = {
  trips: TTrackingTrip[];
  isLoading?: boolean;
  onOpenDetail: (trip: TTrackingTrip) => void;
};

const TrackingTripTable = ({ trips, isLoading, onOpenDetail }: Props) => {
  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPinned className="h-5 w-5 text-blue-700" />
              Chuyến đang theo dõi
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Danh sách từ BE tracking, gồm chuyến đang chạy và chuyến đã xuất phát
            </p>
          </div>
          <Badge variant="outline">{trips.length} trip</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[620px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Trip</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Xe / Tài xế</TableHead>
                <TableHead>IoT</TableHead>
                <TableHead>Nhiệt độ</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="pr-5 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7} className="px-5 py-3">
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && trips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-56 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MapPinned className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-3 font-medium">Chưa có chuyến phù hợp</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Thử đổi bộ lọc hoặc kiểm tra trạng thái chuyến bên BE
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                trips.map((trip) => (
                  <TableRow
                    key={trip.tripId}
                    className="cursor-pointer"
                    onClick={() => onOpenDetail(trip)}
                  >
                    <TableCell className="pl-5">
                      <div className="font-semibold">
                        {formatShortTripId(trip.tripId)}
                      </div>
                      <div className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
                        {trip.tripId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TrackingStatusBadge status={trip.status} />
                      {trip.sealNumber && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Seal {trip.sealNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                          {trip.vehicle?.truckPlate || "N/A"}
                        </span>
                        <span className="flex max-w-[220px] items-center gap-1.5 truncate text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{trip.driver || "N/A"}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("gap-1.5", getDeviceStatusClassName(trip))}
                      >
                        <Radio className="h-3.5 w-3.5" />
                        {getDeviceStatusLabel(trip)}
                      </Badge>
                      <div className="mt-2 max-w-[180px] truncate text-xs text-muted-foreground">
                        {trip.device?.deviceCode || "Chưa có mã thiết bị"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatTemperature(trip.latestTelemetry?.tempC)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatTrackingDateTime(trip.latestTelemetry?.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {trip.eta?.estimatedDurationMinutes != null
                          ? `${trip.eta.estimatedDurationMinutes} phút`
                          : "-"}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Navigation className="h-3.5 w-3.5" />
                        {trip.eta?.remainingDistanceKm != null
                          ? `${trip.eta.remainingDistanceKm} km`
                          : "Chưa có GPS"}
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenDetail(trip);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem hành trình
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrackingTripTable;
