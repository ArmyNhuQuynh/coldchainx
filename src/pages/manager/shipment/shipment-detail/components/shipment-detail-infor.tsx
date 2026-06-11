import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import { getOrderCategoryLabel } from "@/types/enums/order-category.enum";
import type { TOrder } from "@/schemas/order.schema";
import { Badge } from "@/components/ui/badge";
import {
    Hash,
    Tag,
    User,
    Calendar,
    Package,
    Layers,
    Thermometer,
    DollarSign,
} from "lucide-react";
import { format } from "date-fns";

type Props = {
    order: TOrder;
};

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Icon className="h-4 w-4" />
            {label}
        </div>
        <div className="font-medium text-sm text-right">{value}</div>
    </div>
);

const OrderDetailInfo = ({ order }: Props) => {
    const { label: statusLabel, className: statusClass } = getOrderStatusLabel(order.status);
    const { label: categoryLabel } = getOrderCategoryLabel(order.category);

    return (
        <Card>
            <CardHeader className="font-semibold text-lg pb-2">
                Thông tin chi tiết lô hàng
                <Badge className={`${statusClass} ml-2 hover:opacity-90`}>{statusLabel}</Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {/* Cột trái - Định danh */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Định danh đơn hàng
                        </p>
                        <InfoRow icon={Hash} label="Order ID" value={order.orderId} />
                        <InfoRow icon={Tag} label="Tracking Code" value={
                            <span className="text-primary font-semibold">{order.trackingCode}</span>
                        } />
                        <InfoRow icon={User} label="Customer ID" value={order.customerId} />
                        <InfoRow icon={User} label="Customer Name" value={order.customerName} />
                        <InfoRow icon={Calendar} label="Created At" value={
                            format(new Date(order.createdAt), "HH:mm:ss dd/MM/yyyy")
                        } />

                        <p className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
                            Thông tin hàng hóa
                        </p>
                        <InfoRow icon={Package} label="Item Name" value={order.itemName} />
                        <InfoRow icon={Layers} label="Category" value={categoryLabel} />
                        <InfoRow icon={Hash} label="Quantity" value={order.quantity} />
                        <InfoRow icon={Package} label="Packing Type" value={order.packingType} />
                        <InfoRow icon={Thermometer} label="Temp Condition" value={`${order.tempCondition}°C`} />
                        <InfoRow icon={DollarSign} label="Cargo Value" value={
                            order.cargoValue.toLocaleString("vi-VN") + "đ"
                        } />
                    </div>

                    {/* Cột phải - Điểm giao hàng */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Điểm giao hàng
                        </p>
                        <InfoRow icon={Hash} label="Location ID" value={order.destination.locationId} />
                        <InfoRow icon={Tag} label="Address" value={order.destination.address} />
                        <InfoRow icon={Hash} label="Latitude" value={order.destination.latitude} />
                        <InfoRow icon={Hash} label="Longitude" value={order.destination.longitude} />

                        <p className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
                            Báo giá
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            {order.quotations.length > 0
                                ? "Xem bảng báo giá chi tiết phía dưới"
                                : "Chưa có báo giá"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderDetailInfo;