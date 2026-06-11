import { Badge } from "@/components/ui/badge";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import type { TOrder } from "@/schemas/order.schema";

type Props = {
    order: TOrder;
};

const OrderDetailHeader = ({ order }: Props) => {
    const { label, className } = getOrderStatusLabel(order.status);

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold">Chi tiết lô hàng</h1>
            <span className="text-2xl font-bold text-primary">{order.trackingCode}</span>
            <Badge className={`${className} hover:opacity-90`}>{label}</Badge>
            <p className="text-muted-foreground w-full mt-1">
                {order.customerName} • {order.itemName}
            </p>
        </div>
    );
};

export default OrderDetailHeader;