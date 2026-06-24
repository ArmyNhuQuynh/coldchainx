import { useDiscrepancy } from "@/hooks/use-discrepancy";
import { useOrder } from "@/hooks/use-order";
import { handleApiError } from "@/lib/error";
import { PATH_SALE_DASHBOARD } from "@/routes/path";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AppendixPanel from "./components/appendix-panel";
import DiscrepancyComparisonTable from "./components/discrepancy-comparison-table";
import DiscrepancyReceiptCard from "./components/discrepancy-receipt-card";
import DiscrepancyResolutionCard from "./components/discrepancy-resolution-card";
import IncidentDetailHeader from "./components/incident-detail-header";
import OrderContextCard from "./components/order-context-card";

const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getDiscrepancyDetail,
    resolveDiscrepancy,
    getDiscrepancyPdfUrl,
  } = useDiscrepancy();
  const { getOrderById } = useOrder();

  const {
    data: detail,
    isLoading,
    isError,
  } = getDiscrepancyDetail(id);
  const orderId = detail?.orderId ?? "";
  const { data: orderResponse, isLoading: isLoadingOrder } =
    getOrderById(orderId);
  const order = orderResponse?.data;

  const handleApprove = async () => {
    if (!detail) return;

    try {
      const response = await resolveDiscrepancy.mutateAsync({
        lpnId: detail.lpnId,
        accept: true,
        penaltyAmount: 0,
        penaltyReason: "",
      });
      toast.success(response.message || "Approve sai lệch thành công");
      navigate(PATH_SALE_DASHBOARD.incident.root);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleReject = async ({
    penaltyAmount,
    penaltyReason,
  }: {
    penaltyAmount: number;
    penaltyReason: string;
  }) => {
    if (!detail) return;

    try {
      const response = await resolveDiscrepancy.mutateAsync({
        lpnId: detail.lpnId,
        accept: false,
        penaltyAmount,
        penaltyReason,
      });
      toast.success(response.message || "Reject sai lệch thành công");
      navigate(PATH_SALE_DASHBOARD.incident.root);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Đang tải sự cố...
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy sự cố
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <IncidentDetailHeader detail={detail} order={order} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <OrderContextCard
            detail={detail}
            order={order}
            isLoadingOrder={isLoadingOrder}
          />
          <DiscrepancyComparisonTable detail={detail} />
          <AppendixPanel orderId={detail.orderId} />
        </div>

        <div className="space-y-4">
          <DiscrepancyReceiptCard
            detail={detail}
            pdfUrl={
              detail.receiptInfo?.receiptId
                ? getDiscrepancyPdfUrl(detail.receiptInfo.receiptId)
                : undefined
            }
          />
          <DiscrepancyResolutionCard
            isPending={resolveDiscrepancy.isPending}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
