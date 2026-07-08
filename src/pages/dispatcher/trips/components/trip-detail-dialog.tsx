import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import { cn } from "@/lib/utils";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import {
  Ban,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  MapPinned,
  Navigation,
  Package,
  Play,
  Send,
  Truck,
  User,
} from "lucide-react";
import {
  canCancelTrip,
  canDepartTrip,
  canStartPickingTrip,
  formatShortTripId,
  formatTripDateTime,
  getTripProgress,
  getTripStatusClassName,
  getTripStatusLabel,
} from "./trip-helpers";

type Props = {
  open: boolean;
  trip: TDispatchTrip | null;
  isStartingPicking?: boolean;
  isDeparting?: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (trip: TDispatchTrip) => void;
  onStartPicking: (trip: TDispatchTrip) => void;
  onDepart: (trip: TDispatchTrip) => void;
};

const formatRouteDuration = (
  totalDurationMinutes?: number | null,
  totalDurationSeconds?: number | null
) => {
  const minutes =
    totalDurationMinutes ??
    (typeof totalDurationSeconds === "number"
      ? Math.round(totalDurationSeconds / 60)
      : null);
  if (typeof minutes !== "number") return "—";
  if (minutes < 60) return `${minutes} phút`;
  return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
};

const TripDetailDialog = ({
  open,
  trip,
  isStartingPicking,
  isDeparting,
  onOpenChange,
  onCancel,
  onStartPicking,
  onDepart,
}: Props) => {
  const {
    getPickingTripDetail,
    getTripDocuments,
    getTripPickList,
    getTripRoute,
  } = useDispatchTrips();
  const pickingDetailQuery = getPickingTripDetail(
    trip?.tripId,
    open && trip?.status === "PICKING"
  );
  const pickListQuery = getTripPickList(
    trip?.tripId,
    open && trip?.status === "PLANNED"
  );
  const documentsQuery = getTripDocuments(trip?.tripId, open && Boolean(trip));
  const routeQuery = getTripRoute(trip?.tripId, open && Boolean(trip));

  if (!trip) {
    return <Dialog open={open} onOpenChange={onOpenChange} />;
  }

  const detailTrip = pickingDetailQuery.data ?? trip;
  const documents = documentsQuery.data;
  const route = routeQuery.data;
  const lpns =
    detailTrip.lpns ??
    (trip.status === "PLANNED" ? pickListQuery.data : undefined) ??
    [];
  const progress = getTripProgress(detailTrip);
  const isLoadingLpns = pickListQuery.isLoading || pickingDetailQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-2xl">
                Trip {formatShortTripId(trip.tripId)}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Chi tiết chuyến đã tạo và tiến độ bốc hàng hiện tại
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={cn("rounded-md", getTripStatusClassName(trip.status))}
            >
              {getTripStatusLabel(trip.status)}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-96px)]">
          <div className="space-y-5 p-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Xe
                </div>
                <p className="mt-2 font-semibold">{trip.vehicle || "N/A"}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Tài xế
                </div>
                <p className="mt-2 line-clamp-2 font-semibold">
                  {trip.driver || "N/A"}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  Bắt đầu
                </div>
                <p className="mt-2 font-semibold">
                  {formatTripDateTime(trip.plannedStartTime)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Tiến độ
                </div>
                <p className="mt-2 font-semibold">
                  {progress.done}/{progress.total} LPN
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {progress.label}
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4 text-blue-700" />
                    Giấy tờ chuyến
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lấy từ PDF LIFO và giấy đi đường theo trip
                  </p>
                </div>
                <div className="space-y-3 p-4">
                  {documentsQuery.isLoading && (
                    <>
                      <Skeleton className="h-11 w-full" />
                      <Skeleton className="h-11 w-full" />
                    </>
                  )}

                  {!documentsQuery.isLoading && documentsQuery.isError && (
                    <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                      Không tải được thông tin giấy tờ cho trip này.
                    </p>
                  )}

                  {!documentsQuery.isLoading && !documentsQuery.isError && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        disabled={!documents?.lifoPdfUrl}
                        onClick={() =>
                          documents?.lifoPdfUrl &&
                          window.open(documents.lifoPdfUrl, "_blank")
                        }
                      >
                        <span>Sơ đồ LIFO</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        disabled={!documents?.waybillPdfUrl}
                        onClick={() =>
                          documents?.waybillPdfUrl &&
                          window.open(documents.waybillPdfUrl, "_blank")
                        }
                      >
                        <span>Giấy đi đường</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <MapPinned className="h-4 w-4 text-emerald-700" />
                    Lộ trình
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dữ liệu từ Goong route theo các điểm dừng của trip
                  </p>
                </div>
                <div className="p-4">
                  {routeQuery.isLoading && (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-14 w-full" />
                    </div>
                  )}

                  {!routeQuery.isLoading && routeQuery.isError && (
                    <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                      Không tải được lộ trình cho trip này.
                    </p>
                  )}

                  {!routeQuery.isLoading && !routeQuery.isError && route && (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Quãng đường
                          </p>
                          <p className="mt-1 font-semibold">
                            {route.totalDistanceKm ?? "—"} km
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Thời lượng
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatRouteDuration(
                              route.totalDurationMinutes,
                              route.totalDurationSeconds
                            )}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Chặng
                          </p>
                          <p className="mt-1 font-semibold">
                            {route.legs?.length ?? route.totalStops ?? 0}
                          </p>
                        </div>
                      </div>

                      {route.legs && route.legs.length > 0 && (
                        <div className="space-y-2">
                          {route.legs.slice(0, 3).map((leg, index) => (
                            <div key={index} className="rounded-lg border p-3">
                              <div className="flex items-start gap-2">
                                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0">
                                  <p className="line-clamp-1 text-sm font-medium">
                                    {leg.fromAddress ||
                                      leg.startAddress ||
                                      `Chặng ${index + 1}`}
                                  </p>
                                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                    {leg.toAddress || leg.endAddress || "Điểm tiếp theo"}
                                  </p>
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    {leg.distanceKm ?? "—"} km ·{" "}
                                    {formatRouteDuration(
                                      leg.durationMinutes,
                                      leg.durationSeconds
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div>
                  <h3 className="font-semibold">LPN trong chuyến</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lpns.length > 0
                      ? `${lpns.length} LPN được BE trả về cho trạng thái hiện tại`
                      : "Endpoint hiện tại chưa trả danh sách LPN chi tiết cho trạng thái này"}
                  </p>
                </div>
                <Badge variant="outline">{lpns.length} LPN</Badge>
              </div>

              <div className="p-4">
                {isLoadingLpns && (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                )}

                {!isLoadingLpns && lpns.length === 0 && (
                  <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <Boxes className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 font-medium">Chưa có LPN chi tiết</p>
                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                      Với trip chờ kẹp chì, BE hiện chỉ trả tổng LPN và số LPN
                      RELEASED, chưa trả từng LPN trong response lookup.
                    </p>
                  </div>
                )}

                {!isLoadingLpns && lpns.length > 0 && (
                  <div className="space-y-3">
                    {lpns.map((lpn) => (
                      <div
                        key={lpn.lpnId}
                        className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{lpn.lpnCode}</span>
                            {lpn.orderCode && (
                              <Badge variant="outline">{lpn.orderCode}</Badge>
                            )}
                            {(lpn.state || lpn.status) && (
                              <Badge variant="secondary">
                                {lpn.state || lpn.status}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {lpn.itemName || "Không có tên hàng"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5" />
                            SL {lpn.quantity ?? "—"}
                          </span>
                          <span>{lpn.storageLocation || "N/A"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
              {canStartPickingTrip(trip) && (
                <Button
                  type="button"
                  className="gap-2"
                  disabled={isStartingPicking}
                  onClick={() => onStartPicking(trip)}
                >
                  {isStartingPicking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Bắt đầu bốc hàng
                </Button>
              )}
              {canDepartTrip(trip) && (
                <Button
                  type="button"
                  className="gap-2"
                  disabled={isDeparting}
                  onClick={() => onDepart(trip)}
                >
                  {isDeparting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Xuất Phát
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="gap-2 text-rose-700 hover:text-rose-800"
                disabled={!canCancelTrip(trip)}
                onClick={() => onCancel(trip)}
              >
                <Ban className="h-4 w-4" />
                Hủy bốc hàng
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailDialog;
