import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATH_SALE_DASHBOARD } from "@/routes/path";
import type { TDiscrepancyDetail } from "@/schemas/discrepancy.schema";
import type { TOrder } from "@/schemas/order.schema";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  detail: TDiscrepancyDetail;
  order?: TOrder;
};

const IncidentDetailHeader = ({ detail, order }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(PATH_SALE_DASHBOARD.incident.root)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-rose-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold sm:text-xl">
            Chi tiết sự cố
          </h1>
          <span className="max-w-full break-all text-base font-bold text-primary sm:text-lg">
            {detail.trackingCode}
          </span>
          <Badge className="border border-rose-200 bg-rose-50 text-rose-700">
            Đang giữ
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {order?.customerName ?? "Khách hàng chưa xác định"} •{" "}
          {detail.itemName}
        </p>
      </div>
    </div>
  );
};

export default IncidentDetailHeader;
