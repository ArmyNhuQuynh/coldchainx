import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TOrder } from "@/schemas/order.schema";
import { MapPin } from "lucide-react";

type Props = {
  order: TOrder;
};

const OrderDestination = ({ order }: Props) => {
  const { destination } = order;

  if (!destination) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
          <MapPin className="h-5 w-5" />
          Điểm giao hàng
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground italic text-sm">Chưa cập nhật điểm giao hàng</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
        <MapPin className="h-5 w-5" />
        Điểm giao hàng
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-2">
        <div className="flex items-start justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Address</span>
          <span className="text-right font-semibold">{destination.address}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDestination;
