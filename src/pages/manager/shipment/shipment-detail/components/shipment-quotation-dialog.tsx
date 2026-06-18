import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveFileUrl } from "@/lib/file-url";
import { formatPrice } from "@/lib/utils";
import type { TQuotation, TUpdateQuotation } from "@/schemas/quotation.schema";
import {
  getQuotationStatusLabel,
  QUOTATION_STATUS,
} from "@/types/enums/quotation-status.enum";
import { ExternalLink, Loader2, Pencil, Send } from "lucide-react";
import ShipmentQuotationForm from "./shipment-quotation-form";

type Props = {
  quotation: TQuotation;
  isEditing: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  isSending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: TUpdateQuotation) => Promise<void>;
  onSend: () => void;
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-3 border-b py-1.5 last:border-0">
    <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
    <span className="text-right text-xs font-medium sm:text-sm">{value}</span>
  </div>
);

const ShipmentQuotationDialog = ({
  quotation,
  isEditing,
  isRefreshing,
  isUpdating,
  isSending,
  onEdit,
  onCancelEdit,
  onUpdate,
  onSend,
}: Props) => {
  const { label, className } = getQuotationStatusLabel(quotation.status);
  const isDraft = quotation.status === QUOTATION_STATUS.DRAFT;

  if (isEditing) {
    return (
      <ShipmentQuotationForm
        quotation={quotation}
        isPending={isUpdating}
        onCancel={onCancelEdit}
        onSubmit={onUpdate}
      />
    );
  }

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <DialogTitle>Thông tin báo giá</DialogTitle>
          <Badge className={className}>{label}</Badge>
          {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <DialogDescription>
          {quotation.trackingCode ?? "Không có mã theo dõi"} · {quotation.customerName ?? "Chưa có khách hàng"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-1.5 text-sm font-semibold">Chi phí</h3>
          <InfoRow label="Cước cơ bản" value={formatPrice(quotation.baseFreight)} />
          <InfoRow
            label="Phụ phí chặng cuối"
            value={quotation.lastMileSurcharge == null ? "—" : formatPrice(quotation.lastMileSurcharge)}
          />
          <InfoRow label="Tổng phụ phí" value={formatPrice(quotation.additionalChargesTotal)} />
          <InfoRow
            label="VAT"
            value={`${quotation.vatPercentage ?? 0}% · ${formatPrice(quotation.vatAmount)}`}
          />
          <InfoRow
            label="Tổng cộng"
            value={<span className="text-base font-bold text-primary">{formatPrice(quotation.finalAmount)}</span>}
          />
        </div>

        <div>
          <h3 className="mb-1.5 text-sm font-semibold">Thông tin tính giá</h3>
          <InfoRow label="Trọng lượng tính cước" value={quotation.chargeableWeightKg == null ? "—" : `${quotation.chargeableWeightKg} kg`} />
          <InfoRow label="Trọng lượng quy đổi" value={quotation.volumetricWeightKg == null ? "—" : `${quotation.volumetricWeightKg} kg`} />
          <InfoRow label="Đơn giá/kg" value={quotation.pricePerKg == null ? "—" : formatPrice(quotation.pricePerKg)} />
          <InfoRow label="Khoảng cách" value={quotation.distanceKm == null ? "—" : `${quotation.distanceKm} km`} />
          <InfoRow label="Nguồn tính giá" value={quotation.pricingSource} />
          <InfoRow label="Điều chỉnh" value={quotation.manualAdjustment == null ? "—" : formatPrice(quotation.manualAdjustment)} />
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-sm font-semibold">Phụ phí bổ sung</h3>
        {quotation.additionalCharges.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">Không có phụ phí bổ sung</p>
        ) : (
          <div className="rounded-md border px-2.5">
            {quotation.additionalCharges.map((charge, index) => (
              <InfoRow
                key={`${charge.name}-${index}`}
                label={charge.name}
                value={
                  <span>
                    {formatPrice(charge.amount)}
                    {charge.note ? <span className="block text-xs font-normal text-muted-foreground">{charge.note}</span> : null}
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>

      {quotation.overrideReason && (
        <div className="rounded-md bg-muted p-2.5 text-xs sm:text-sm">
          <span className="font-medium">Lý do điều chỉnh: </span>
          {quotation.overrideReason}
        </div>
      )}

      {quotation.fileUrl && (
        <Button variant="outline" asChild className="w-fit">
          <a href={resolveFileUrl(quotation.fileUrl)} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Mở file báo giá
          </a>
        </Button>
      )}

      <DialogFooter>
        {isDraft ? (
          <>
            <Button variant="outline" onClick={onEdit} disabled={isSending}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            <Button onClick={onSend} disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              Gửi báo giá
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {quotation.status === QUOTATION_STATUS.ACCEPTED
              ? "Khách hàng đã chấp nhận báo giá này."
              : "Báo giá đã được gửi cho khách hàng."}
          </p>
        )}
      </DialogFooter>
    </>
  );
};

export default ShipmentQuotationDialog;
