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
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { Ban, Clock, Eye, PackageCheck, Play, Truck, User } from "lucide-react";
import {
  canCancelTrip,
  canStartPickingTrip,
  formatShortTripId,
  formatTripDateTime,
  getTripProgress,
  getTripStatusClassName,
  getTripStatusLabel,
} from "./trip-helpers";

type Props = {
  trips: TDispatchTrip[];
  isLoading?: boolean;
  isStartingPicking?: boolean;
  onSelect: (trip: TDispatchTrip) => void;
  onCancel: (trip: TDispatchTrip) => void;
  onStartPicking: (trip: TDispatchTrip) => void;
};

const TripTable = ({
  trips,
  isLoading,
  isStartingPicking,
  onSelect,
  onCancel,
  onStartPicking,
}: Props) => {
  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageCheck className="h-5 w-5 text-emerald-700" />
              Danh sách trip đã tạo
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Hiển thị các chuyến chưa xuất phát mà BE hiện trả về
            </p>
          </div>
          <Badge variant="outline">{trips.length} trip</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[620px]">
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="pl-5">Trip</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Xe</TableHead>
                <TableHead>Tài xế</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>LPN</TableHead>
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
                      <PackageCheck className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-3 font-medium">Chưa có trip phù hợp</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Thử đổi bộ lọc hoặc tải lại dữ liệu
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                trips.map((trip) => {
                  const progress = getTripProgress(trip);
                  return (
                    <TableRow
                      key={trip.tripId}
                      className="cursor-pointer"
                      onClick={() => onSelect(trip)}
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
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md",
                            getTripStatusClassName(trip.status)
                          )}
                        >
                          {getTripStatusLabel(trip.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                          {trip.vehicle || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex max-w-[220px] items-center gap-1.5 truncate">
                          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{trip.driver || "N/A"}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <div>{formatTripDateTime(trip.plannedStartTime)}</div>
                            <div className="text-xs text-muted-foreground">
                              đến {formatTripDateTime(trip.plannedEndTime)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {progress.done}/{progress.total}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {progress.label}
                        </div>
                      </TableCell>
                      <TableCell className="pr-5">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={(event) => {
                              event.stopPropagation();
                              onSelect(trip);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Chi tiết
                          </Button>
                          {canStartPickingTrip(trip) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-emerald-700 hover:text-emerald-800"
                              disabled={isStartingPicking}
                              onClick={(event) => {
                                event.stopPropagation();
                                onStartPicking(trip);
                              }}
                            >
                              <Play className="h-3.5 w-3.5" />
                              Bắt đầu
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-rose-700 hover:text-rose-800"
                            disabled={!canCancelTrip(trip)}
                            onClick={(event) => {
                              event.stopPropagation();
                              onCancel(trip);
                            }}
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Hủy bốc hàng
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TripTable;
