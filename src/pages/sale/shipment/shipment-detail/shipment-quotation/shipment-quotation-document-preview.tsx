import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveFileUrl } from "@/lib/file-url";
import { formatPrice } from "@/lib/utils";
import type { TQuotation } from "@/schemas/quotation.schema";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Props = {
  quotation: TQuotation;
  onBack: () => void;
};

const getEmbeddedPdfUrl = (fileUrl: string) =>
  `${fileUrl}${fileUrl.includes("#") ? "&" : "#"}toolbar=0&navpanes=0&view=FitH`;

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("vi-VN");
};

const ShipmentQuotationDocumentPreview = ({ quotation, onBack }: Props) => {
  const fileUrl = quotation.fileUrl
    ? resolveFileUrl(quotation.fileUrl)
    : null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Phiếu báo giá</DialogTitle>
        <DialogDescription>
          {fileUrl
            ? "Bản PDF chính thức đã được gửi cho khách hàng."
            : "Bản xem trước được dựng từ dữ liệu báo giá hiện tại."}
        </DialogDescription>
      </DialogHeader>

      {fileUrl ? (
        <iframe
          className="h-[62vh] min-h-[420px] w-full rounded-md border bg-white"
          src={getEmbeddedPdfUrl(fileUrl)}
          title={`Phiếu báo giá ${quotation.trackingCode ?? quotation.quoteId}`}
        />
      ) : (
        <div className="max-h-[62vh] overflow-y-auto rounded-md bg-muted p-3 sm:p-5">
          <QuotationPaper quotation={quotation} />
        </div>
      )}

      <DialogFooter className="gap-2 sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chi tiết
        </Button>
        {fileUrl && (
          <Button asChild>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Mở PDF
            </a>
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

const QuotationPaper = ({ quotation }: { quotation: TQuotation }) => (
  <article className="mx-auto min-h-[680px] w-full max-w-[720px] bg-white p-6 text-neutral-900 shadow-sm sm:p-10">
    <header className="border-b-2 border-neutral-900 pb-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold">COLDCHAINX</p>
          <p className="mt-1 text-xs text-neutral-600">
            Dịch vụ vận chuyển và bảo quản chuỗi lạnh
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">PHIẾU BÁO GIÁ</h2>
          <p className="mt-1 text-xs text-neutral-600">
            Ngày lập: {formatDate(quotation.createdAt)}
          </p>
        </div>
      </div>
    </header>

    <section className="grid gap-2 border-b py-5 text-sm sm:grid-cols-2">
      <p>
        <span className="text-neutral-500">Khách hàng:</span>{" "}
        <strong>{quotation.customerName ?? "—"}</strong>
      </p>
      <p>
        <span className="text-neutral-500">Mã đơn:</span>{" "}
        <strong>{quotation.trackingCode ?? "—"}</strong>
      </p>
    </section>

    <section className="py-5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-neutral-100 text-left">
            <th className="px-3 py-2 font-semibold">Nội dung</th>
            <th className="px-3 py-2 text-right font-semibold">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <PriceRow label="Cước vận chuyển cơ bản" amount={quotation.baseFreight} />
          <PriceRow
            label="Phụ phí chặng cuối"
            amount={quotation.lastMileSurcharge ?? 0}
          />
          {quotation.additionalCharges.map((charge, index) => (
            <PriceRow
              key={`${charge.serviceCatalogId ?? charge.name}-${index}`}
              label={charge.name}
              amount={charge.amount}
              note={charge.note}
            />
          ))}
          <PriceRow
            label={`VAT (${quotation.vatPercentage ?? 0}%)`}
            amount={quotation.vatAmount}
          />
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-neutral-900">
            <td className="px-3 py-3 text-base font-bold">Tổng thanh toán</td>
            <td className="px-3 py-3 text-right text-lg font-bold">
              {formatPrice(quotation.finalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>

    {quotation.overrideReason && (
      <section className="border-t py-4 text-sm">
        <span className="font-semibold">Ghi chú điều chỉnh: </span>
        {quotation.overrideReason}
      </section>
    )}

    <footer className="mt-8 border-t pt-4 text-center text-xs text-neutral-500">
      Đây là bản xem trước. PDF chính thức được hệ thống tạo khi báo giá được gửi
      cho khách hàng.
    </footer>
  </article>
);

type PriceRowProps = {
  label: string;
  amount: number;
  note?: string | null;
};

const PriceRow = ({ label, amount, note }: PriceRowProps) => (
  <tr className="border-b">
    <td className="px-3 py-2.5">
      <span>{label}</span>
      {note && <span className="block text-xs text-neutral-500">{note}</span>}
    </td>
    <td className="px-3 py-2.5 text-right font-medium">
      {formatPrice(amount)}
    </td>
  </tr>
);

export default ShipmentQuotationDocumentPreview;
