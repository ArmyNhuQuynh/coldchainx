import { Card, CardContent } from "@/components/ui/card";
import { getOrderCategoryLabel } from "@/types/enums/order-category.enum";
import type { TOrder } from "@/schemas/order.schema";
import { format } from "date-fns";
import { Package, MapPin, Thermometer, Calendar } from "lucide-react";

type Props = {
    order: TOrder;
};

const OrderInfoCards = ({ order }: Props) => {
    const { label: categoryLabel } = getOrderCategoryLabel(order.category);
    const formattedDate = order.createdAt
        ? format(new Date(order.createdAt), "dd/MM HH:mm")
        : "—";

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
                <CardContent className="p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                        <Package className="h-4 w-4" />
                        Loại hàng
                    </div>
                    <p className="text-sm font-semibold">{categoryLabel}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Tuyến đường
                    </div>
                    <p className="line-clamp-2 text-sm font-semibold">{order.destination?.address ?? "—"}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                        <Thermometer className="h-4 w-4" />
                        Dải nhiệt
                    </div>
                    <p className="text-sm font-semibold">{order.tempCondition}°C</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Ngày lấy hàng
                    </div>
                    <p className="text-sm font-semibold">{formattedDate}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderInfoCards;
