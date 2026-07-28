import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  TDispatchTripDetails,
  TDispatchTripDetailsOrder,
} from "@/schemas/dispatch.schema";
import {
  ORDER_STATUS,
  getOrderStatusLabel,
} from "@/types/enums/order-status.enum";
import { CheckCircle2, Clock3, MapPin, Package } from "lucide-react";
import { useMemo } from "react";
import { formatTrackingDateTime } from "../../shared/tracking-formatters";

type Props = {
  tripDetails?: TDispatchTripDetails | null;
  isLoading?: boolean;
};

const UNKNOWN_STOP_SEQUENCE = Number.MAX_SAFE_INTEGER;

const getDeliveredAt = (order: TDispatchTripDetailsOrder) =>
  order.deliveryEpods.find((epod) => epod.handoverConfirmedAt)
    ?.handoverConfirmedAt ??
  order.deliveryEpods.find((epod) => epod.signedAt)?.signedAt ??
  null;

const TrackingOrdersPanel = ({ tripDetails, isLoading }: Props) => {
  const deliveryGroups = useMemo(() => {
    const orders = tripDetails?.orders ?? [];
    const stops = tripDetails?.stops ?? [];
    const stopBySequence = new Map(
      stops.map((stop) => [stop.stopSequence, stop])
    );
    const groupedOrders = new Map<number, TDispatchTripDetailsOrder[]>();

    orders.forEach((order) => {
      const sequence =
        order.deliveryStopSequence ?? UNKNOWN_STOP_SEQUENCE;
      const current = groupedOrders.get(sequence) ?? [];
      current.push(order);
      groupedOrders.set(sequence, current);
    });

    return Array.from(groupedOrders.entries())
      .sort(([first], [second]) => first - second)
      .map(([sequence, grouped]) => ({
        sequence,
        stop: stopBySequence.get(sequence),
        orders: grouped.sort((first, second) =>
          first.trackingCode.localeCompare(second.trackingCode)
        ),
      }));
  }, [tripDetails]);

  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-blue-700" />
            Thứ tự giao hàng
          </CardTitle>
          {tripDetails && (
            <Badge variant="outline">
              {tripDetails.summary.totalOrders} đơn ·{" "}
              {tripDetails.summary.deliveredLpns}/
              {tripDetails.summary.totalLpns} LPN đã giao
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="space-y-3 p-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && deliveryGroups.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Chuyến này chưa có đơn hàng hoặc điểm giao.
          </p>
        )}

        {!isLoading && deliveryGroups.length > 0 && (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 p-4">
              {deliveryGroups.map(({ sequence, stop, orders }, groupIndex) => {
                const address =
                  stop?.location?.address ??
                  orders[0]?.destinationAddress ??
                  "Chưa có địa chỉ giao";
                const allDelivered = orders.every(
                  (order) => order.status === ORDER_STATUS.DELIVERED
                );

                return (
                  <section
                    key={
                      sequence === UNKNOWN_STOP_SEQUENCE
                        ? "unknown-stop"
                        : sequence
                    }
                    className="overflow-hidden rounded-lg border"
                  >
                    <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            Điểm giao {groupIndex + 1}
                          </span>
                          {allDelivered && (
                            <Badge
                              variant="outline"
                              className="border-emerald-400 bg-transparent text-emerald-700"
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Đã giao xong
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{address}</span>
                        </p>
                      </div>
                      {stop?.plannedArrivalTime && (
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          Dự kiến{" "}
                          {formatTrackingDateTime(stop.plannedArrivalTime)}
                        </span>
                      )}
                    </div>

                    <div className="divide-y">
                      {orders.map((order) => {
                        const status = getOrderStatusLabel(order.status);
                        const orderLpns =
                          tripDetails?.lpns.filter(
                            (lpn) => lpn.orderId === order.orderId
                          ) ?? [];
                        const deliveredLpns = orderLpns.filter(
                          (lpn) => lpn.state === "DELIVERED"
                        ).length;
                        const deliveredAt = getDeliveredAt(order);

                        return (
                          <div
                            key={order.orderId}
                            className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto]"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">
                                  {order.trackingCode || "Đơn hàng"}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={status.className}
                                >
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {order.itemName || "Chưa có tên hàng"}
                                {order.customerName
                                  ? ` · ${order.customerName}`
                                  : ""}
                              </p>
                            </div>

                            <div className="text-left text-sm md:text-right">
                              <p className="font-medium">
                                {deliveredLpns}/{orderLpns.length} LPN đã giao
                              </p>
                              {deliveredAt && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Hoàn tất{" "}
                                  {formatTrackingDateTime(deliveredAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingOrdersPanel;
