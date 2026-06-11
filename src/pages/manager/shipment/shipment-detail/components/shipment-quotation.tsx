import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TOrder } from "@/schemas/order.schema";
import { DollarSign } from "lucide-react";

type Props = {
  order: TOrder;
};

const OrderQuotation = ({ order }: Props) => {
  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Báo giá
      </CardHeader>
      <CardContent>
        {order.quotations.length === 0 ? (
          <p className="text-muted-foreground italic text-sm">Chưa có báo giá</p>
        ) : (
          <div className="space-y-3">
            {order.quotations.map((q, idx) => (
              <div key={q.quotationId ?? idx} className="flex justify-between text-sm border-b pb-2 last:border-0">
                <span className="text-muted-foreground">VAS Amount</span>
                <span className="font-semibold">
                  {q.vasAmount?.toLocaleString("vi-VN") ?? "—"}đ
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderQuotation;