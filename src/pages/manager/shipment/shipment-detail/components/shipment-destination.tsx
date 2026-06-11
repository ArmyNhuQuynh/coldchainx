import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TOrder } from "@/schemas/order.schema";
import { MapPin } from "lucide-react";

type Props = {
  order: TOrder;
};

const OrderDestination = ({ order }: Props) => {
  const { destination } = order;

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center gap-2">
        <MapPin className="h-5 w-5" />
        Điểm giao hàng
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Address</span>
          <span className="font-semibold">{destination.address}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground"># Location ID</span>
          <span className="font-medium">{destination.locationId}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs uppercase text-muted-foreground mb-1">Latitude</p>
              <p className="text-xl font-bold text-primary">{destination.latitude}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs uppercase text-muted-foreground mb-1">Longitude</p>
              <p className="text-xl font-bold text-primary">{destination.longitude}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDestination;