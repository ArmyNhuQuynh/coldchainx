import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TRouteOriginWarehouse } from "@/schemas/route.schema";
import { MapPin, Warehouse } from "lucide-react";

type Props = {
  warehouses: TRouteOriginWarehouse[];
  isLoading?: boolean;
};

const RouteOriginWarehousesCard = ({ warehouses, isLoading }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2 text-lg font-semibold">
        Kho xuất phát phù hợp
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Đang tải kho...
          </div>
        )}

        {!isLoading && warehouses.length === 0 && (
          <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            Chưa tìm thấy kho theo thành phố xuất phát của tuyến.
          </div>
        )}

        {!isLoading && warehouses.length > 0 && (
          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.warehouseId}
                className="rounded-xl border bg-background/60 p-4"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Warehouse className="h-4 w-4 text-primary" />
                  {warehouse.warehouseName}
                </div>
                <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{warehouse.address || "Chưa có địa chỉ"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteOriginWarehousesCard;
