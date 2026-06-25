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
import { cn } from "@/lib/utils";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { useDispatchTrips } from "@/hooks/use-dispatch";
import {
  Ban,
  Boxes,
  CalendarClock,
  CheckCircle2,
  Package,
  Truck,
  User,
} from "lucide-react";
import {
  canCancelTrip,
  formatShortTripId,
  formatTripDateTime,
  getTripProgress,
  getTripStatusClassName,
  getTripStatusLabel,
} from "./trip-helpers";

type Props = {
  open: boolean;
  trip: TDispatchTrip | null;
  onOpenChange: (open: boolean) => void;
  onCancel: (trip: TDispatchTrip) => void;
};

const TripDetailDialog = ({ open, trip, onOpenChange, onCancel }: Props) => {
  const { getPickingTripDetail, getTripPickList } = useDispatchTrips();
  const pickingDetailQuery = getPickingTripDetail(
    trip?.tripId,
    open && trip?.status === "PICKING"
  );
  const pickListQuery = getTripPickList(
    trip?.tripId,
    open && trip?.status === "PLANNED"
  );

  if (!trip) {
    return <Dialog open={open} onOpenChange={onOpenChange} />;
  }

  const detailTrip = pickingDetailQuery.data ?? trip;
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
