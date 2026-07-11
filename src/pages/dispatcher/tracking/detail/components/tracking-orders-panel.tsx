import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TMonitoringOrder } from "@/schemas/monitoring.schema";
import { Package } from "lucide-react";

type Props = {
  orders: TMonitoringOrder[];
};

const TrackingOrdersPanel = ({ orders }: Props) => {
  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-blue-700" />
          Hàng trong chuyến
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground">
            API hiện chưa trả danh sách đơn cho chuyến này.
          </p>
        )}

        {orders.slice(0, 8).map((order, index) => (
          <div key={order.orderId ?? index} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">
                {order.trackingCode || order.orderId || "Đơn hàng"}
              </span>
              {order.tempCondition && (
                <Badge variant="secondary">{order.tempCondition}</Badge>
              )}
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {order.itemName || "Chưa có tên hàng"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrackingOrdersPanel;
