import { formatPrice } from "@/lib/utils";
import type { TInvoice } from "@/schemas/finance.schema";

const InvoiceSummary = ({ invoice }: { invoice: TInvoice }) => {
  const paidAmount = Number(invoice.paidAmount ?? 0);
  const outstanding = Math.max(Number(invoice.grandTotal) - paidAmount, 0);

  return (
    <div className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-2 xl:grid-cols-4">
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Tiền trước thuế</p>
        <p className="mt-1 text-lg font-semibold">{formatPrice(invoice.subTotal)}</p>
      </div>
      <div className="border-t p-4 sm:border-l sm:border-t-0">
        <p className="text-sm text-muted-foreground">Thuế VAT</p>
        <p className="mt-1 text-lg font-semibold">{formatPrice(invoice.taxAmount)}</p>
      </div>
      <div className="border-t p-4 xl:border-l xl:border-t-0">
        <p className="text-sm text-muted-foreground">Đã thanh toán</p>
        <p className="mt-1 text-lg font-semibold text-emerald-700">{formatPrice(paidAmount)}</p>
      </div>
      <div className="border-t p-4 sm:border-l xl:border-t-0">
        <p className="text-sm text-muted-foreground">Còn phải thu</p>
        <p className="mt-1 text-lg font-semibold text-amber-700">{formatPrice(outstanding)}</p>
      </div>
    </div>
  );
};

export default InvoiceSummary;
