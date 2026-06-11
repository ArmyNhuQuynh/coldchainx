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
    const formattedDate = format(new Date(order.createdAt), "dd/MM HH:mm");

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-2">
                        <Package className="h-4 w-4" />
                        Loại hàng
                    </div>
                    <p className="font-semibold">{categoryLabel}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-2">
                        <MapPin className="h-4 w-4" />
                        Tuyến đường
                    </div>
                    <p className="font-semibold">{order.destination.address}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-2">
                        <Thermometer className="h-4 w-4" />
                        Dải nhiệt
                    </div>
                    <p className="font-semibold">{order.tempCondition}°C</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-2">
                        <Calendar className="h-4 w-4" />
                        Ngày lấy hàng
                    </div>
                    <p className="font-semibold">{formattedDate}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderInfoCards;