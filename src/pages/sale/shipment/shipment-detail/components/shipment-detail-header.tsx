import { Badge } from "@/components/ui/badge";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import type { TOrder } from "@/schemas/order.schema";

type Props = {
    order: TOrder;
};

const OrderDetailHeader = ({ order }: Props) => {
    const { label, className } = getOrderStatusLabel(order.status);

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold sm:text-xl">Chi tiết lô hàng</h1>
            <span className="max-w-full break-all text-base font-bold text-primary sm:text-lg">{order.trackingCode}</span>
            <Badge className={`${className} hover:opacity-90`}>{label}</Badge>
            <p className="mt-0.5 w-full text-sm text-muted-foreground">
                {order.customerName ?? "Chưa có khách hàng"} • {order.itemName}
            </p>
        </div>
    );
};

export default OrderDetailHeader;
