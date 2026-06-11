import { useParams } from "react-router-dom";
import { useOrder } from "@/hooks/use-order";
import OrderDetailHeader from "./components/shipment-detail-header";
import OrderInfoCards from "./components/shipment-infor-card";
import OrderDetailInfo from "./components/shipment-detail-infor";
import OrderDestination from "./components/shipment-destination";
import OrderQuotation from "./components/shipment-quotation";
import OrderWeightSection from "./components/shipment-weight-section";
import OrderDocuments from "./components/shipment-document";


const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getOrderById } = useOrder();

    const { data, isLoading } = getOrderById(id!);

    const order = data?.data.data;

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
        <div className="space-y-6">
            {/* Header */}
            <OrderDetailHeader order={order} />

            {/* 4 info cards */}
            <OrderInfoCards order={order} />

            {/* Detail info + Destination */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OrderDetailInfo order={order} />
                </div>
                <div className="space-y-6">
                    <OrderDestination order={order} />
                    <OrderQuotation order={order} />
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