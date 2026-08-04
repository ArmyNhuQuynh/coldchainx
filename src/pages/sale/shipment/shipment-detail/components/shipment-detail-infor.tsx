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
    <div className="flex items-center justify-between gap-3 border-b py-1.5 last:border-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Icon className="h-4 w-4" />
            {label}
        </div>
        <div className="min-w-0 break-words text-right text-xs font-medium sm:text-sm">{value}</div>
    </div>
);

const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "—";

    return `${value.toLocaleString("vi-VN")}đ`;
};

const OrderDetailInfo = ({ order }: Props) => {
    const { label: statusLabel, className: statusClass } = getOrderStatusLabel(order.status);
    const { label: categoryLabel } = getOrderCategoryLabel(order.category);
    const quotations = order.quotations ?? [];

    return (
        <Card>
            <CardHeader className="p-4 pb-2 text-base font-semibold">
                Thông tin chi tiết lô hàng
                <Badge className={`${statusClass} ml-2 hover:opacity-90`}>{statusLabel}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    {/* Cột trái - Định danh */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Định danh đơn hàng
                        </p>
                        <InfoRow icon={Tag} label="Tracking Code" value={
                            <span className="text-primary font-semibold">{order.trackingCode}</span>
                        } />
                        <InfoRow icon={User} label="Tên Khách hàng" value={order.customerName ?? "—"} />
                        <InfoRow icon={Calendar} label="Created At" value={
                            order.createdAt
                                ? format(new Date(order.createdAt), "HH:mm:ss dd/MM/yyyy")
                                : "—"
                        } />

                        <p className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
                            Thông tin hàng hóa
                        </p>
                        <InfoRow icon={Package} label="Tên Hàng" value={order.itemName} />
                        <InfoRow icon={Layers} label="Loại hàng hóa" value={categoryLabel} />
                        <InfoRow icon={Hash} label="Số lượng" value={order.quantity} />
                        <InfoRow icon={Package} label="Loại đóng gói" value={order.packingType} />
                        <InfoRow icon={Thermometer} label="Nhiệt độ" value={`${order.tempCondition}°C`} />
                        <InfoRow icon={DollarSign} label="Giá trị hàng hóa" value={
                            formatCurrency(order.cargoValue)
                        } />
                    </div>

                    {/* Cột phải - Điểm giao hàng */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Điểm giao hàng
                        </p>
                        <InfoRow icon={Tag} label="Address" value={order.destination?.address ?? "—"} />
                        <p className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
                            Báo giá
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            {quotations.length > 0
                                ? "Đã có báo giá cho đơn hàng"
                                : "Chưa có báo giá"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderDetailInfo;
