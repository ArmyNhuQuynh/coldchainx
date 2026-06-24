import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TDiscrepancyDetail } from "@/schemas/discrepancy.schema";
import type { TOrder } from "@/schemas/order.schema";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import { FileText, Package, Route, Thermometer } from "lucide-react";

type Props = {
  detail: TDiscrepancyDetail;
  order?: TOrder;
  isLoadingOrder: boolean;
};

const InfoLine = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="rounded-md border bg-background px-3 py-2">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 min-h-5 break-words text-sm font-semibold">
      {value ?? "—"}
    </p>
  </div>
);

const OrderContextCard = ({ detail, order, isLoadingOrder }: Props) => {
  const status = order?.status ? getOrderStatusLabel(order.status) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
        <FileText className="h-5 w-5" />
        Thông tin lô hàng
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2">
        {isLoadingOrder ? (
          <div className="text-sm text-muted-foreground">
            Đang tải thông tin lô hàng...
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-primary">
                {order?.trackingCode ?? detail.trackingCode}
              </span>
              {status && (
                <Badge className={`${status.className} hover:opacity-90`}>
                  {status.label}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoLine label="Khách hàng" value={order?.customerName} />
              <InfoLine label="Mặt hàng" value={order?.itemName ?? detail.itemName} />
              <InfoLine label="Số lượng" value={order?.quantity ?? detail.quantity} />
              <InfoLine label="Quy cách" value={order?.packingType} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order?.category ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order?.tempCondition ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                <Route className="h-4 w-4 text-muted-foreground" />
                <span className="truncate text-sm">
                  {order?.destination?.address ?? "—"}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderContextCard;
