import TripTrackingView from "@/components/tracking/trip-tracking-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/use-order";
import { PATH_SALE_DASHBOARD } from "@/routes/path";
import { ArrowLeft, MapPinned } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ShipmentTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const orderQuery = getOrderById(orderId ?? "");
  const order = orderQuery.data?.data;
  const tripId = order?.masterTripId;

  if (orderQuery.isLoading) {
    return <Skeleton className="h-[720px] w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(
              orderId
                ? PATH_SALE_DASHBOARD.shipment.edit(orderId)
                : PATH_SALE_DASHBOARD.shipment.root
            )
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <MapPinned className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            Theo dõi vận chuyển
          </h1>
          <p className="mt-1 text-muted-foreground">
            Đơn {order?.trackingCode ?? orderId ?? ""}
          </p>
        </div>
      </div>

      {tripId ? (
        <TripTrackingView tripId={tripId} includeOperationalDetails={false} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Đơn hàng chưa được gắn vào chuyến vận chuyển.
        </div>
      )}
    </div>
  );
};

export default ShipmentTrackingPage;
