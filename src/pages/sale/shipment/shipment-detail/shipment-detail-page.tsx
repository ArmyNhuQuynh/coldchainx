import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "@/hooks/use-order";
import OrderDetailHeader from "./components/shipment-detail-header";
import OrderInfoCards from "./components/shipment-infor-card";
import OrderDetailInfo from "./components/shipment-detail-infor";
import OrderDestination from "./components/shipment-destination";
import OrderQuotation from "./shipment-quotation";
import ShipmentContract from "./shipment-contract";
import OrderWeightSection from "./components/shipment-weight-section";
import OrderDocuments from "./components/shipment-document";
import OrderReviewActions from "./components/shipment-review-action";
import { ORDER_STATUS } from "@/types/enums/order-status.enum";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPinned } from "lucide-react";
import { PATH_SALE_DASHBOARD } from "@/routes/path";


const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getOrderById } = useOrder();
    const navigate = useNavigate();
    const role = useSelector((state: RootState) => state.user.role);
    const canReviewOrder = role === "Sale";
    const [preferredQuoteId, setPreferredQuoteId] = useState<string>();

    const { data, isLoading } = getOrderById(id!);

    const order = data?.data;
    const canTrackOrder = Boolean(
        order?.masterTripId &&
        [
            ORDER_STATUS.SHIPPING,
            ORDER_STATUS.PARTIALLY_DELIVERED,
            ORDER_STATUS.DELIVERED,
        ].includes(order.status)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
                Đang tải...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
                Không tìm thấy đơn hàng
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-4">
            {/* Header + Review Actions */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <OrderDetailHeader order={order} />
                {canReviewOrder && order.status === ORDER_STATUS.PENDING_REVIEW && (
                    <OrderReviewActions
                        orderId={order.orderId}
                        onApproved={setPreferredQuoteId}
                    />
                )}
            </div>

            {/* 4 info cards */}
            <OrderInfoCards order={order} />

            {/* Detail info + Destination + Quotation */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <OrderDetailInfo order={order} />
                </div>
                <div className="space-y-4">
                    <OrderDestination order={order} />
                    <OrderQuotation
                        order={order}
                        preferredQuoteId={preferredQuoteId}
                    />
                    <ShipmentContract order={order} />
                    {canTrackOrder && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() =>
                                navigate(PATH_SALE_DASHBOARD.shipment.tracking(order.orderId))
                            }
                        >
                            <MapPinned className="mr-2 h-4 w-4" />
                            Theo dõi tuyến
                        </Button>
                    )}
                </div>
            </div>

            {/* Weight */}
            <OrderWeightSection order={order} />

            {/* Documents */}
            <OrderDocuments order={order} />
        </div>
    );
};

export default OrderDetailPage;
