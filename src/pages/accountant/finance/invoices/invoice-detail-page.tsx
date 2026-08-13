import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFinance } from "@/hooks/use-finance";
import { useOrder } from "@/hooks/use-order";
import { formatPrice } from "@/lib/utils";
import { PATH_ACCOUNTANT_DASHBOARD } from "@/routes/path";
import {
  getInvoiceStatusClassName,
  getInvoiceStatusLabel,
} from "@/types/enums/invoice-status.enum";
import { getInvoiceChargeTypeLabel } from "@/types/enums/invoice-charge-type.enum";
import { ArrowLeft, ExternalLink, ReceiptText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceSummary from "../components/invoice-summary";
import {
  FinanceErrorState,
  FinanceTableLoading,
} from "../components/finance-page-state";
import {
  formatFinanceDate,
  getFinanceErrorMessage,
} from "../components/finance-formatters";

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { getInvoice } = useFinance();
  const { getAllOrders } = useOrder();
  const query = getInvoice(invoiceId);
  const ordersQuery = getAllOrders();
  const invoice = query.data;

  if (query.isLoading) return <FinanceTableLoading rows={7} />;
  if (query.isError || !invoice) {
    return (
      <FinanceErrorState
        message={getFinanceErrorMessage(query.error, "Không thể tải chi tiết hóa đơn.")}
        onRetry={() => query.refetch()}
      />
    );
  }

  const ordersById = new Map(
    (ordersQuery.data?.data.data ?? []).map((order) => [order.orderId, order])
  );
  const invoiceOrders = [
    ...new Set(invoice.invoiceLines.map((line) => line.orderId)),
  ]
    .map((orderId) => ordersById.get(orderId))
    .filter((order) => Boolean(order));
  const customerNames = [
    ...new Set(
      invoiceOrders
        .map((order) => order?.customerName)
        .filter((name): name is string => Boolean(name))
    ),
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate(PATH_ACCOUNTANT_DASHBOARD.invoice.root)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold">{invoice.invoiceCode}</h1>
              <Badge variant="outline" className={getInvoiceStatusClassName(invoice.status)}>
                {getInvoiceStatusLabel(invoice.status)}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {customerNames.join(", ") || "Chưa cập nhật khách hàng"} · Số hóa đơn VAT: {invoice.vatInvoiceNo || "Chưa cập nhật"}
            </p>
          </div>
        </div>
        {invoice.pdfUrl && (
          <Button type="button" variant="outline" className="gap-2" asChild>
            <a href={invoice.pdfUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Xem bản PDF
            </a>
          </Button>
        )}
      </header>

      <InvoiceSummary invoice={invoice} />

      <div className="grid overflow-hidden rounded-lg border bg-card md:grid-cols-4">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">Đơn hàng</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {invoiceOrders.length ? (
              invoiceOrders.map((order) => (
                <Badge key={order?.orderId} variant="outline">
                  {order?.trackingCode}
                </Badge>
              ))
            ) : (
              <p className="font-medium">Chưa cập nhật</p>
            )}
          </div>
        </div>
        <div className="border-t p-4 md:border-l md:border-t-0">
          <p className="text-sm text-muted-foreground">Ngày phát hành</p>
          <p className="mt-1 font-medium">{formatFinanceDate(invoice.issuedDate)}</p>
        </div>
        <div className="border-t p-4 md:border-l md:border-t-0">
          <p className="text-sm text-muted-foreground">Hạn thanh toán</p>
          <p className="mt-1 font-medium">{formatFinanceDate(invoice.dueDate)}</p>
        </div>
        <div className="border-t p-4 md:border-l md:border-t-0">
          <p className="text-sm text-muted-foreground">Giảm trừ</p>
          <p className="mt-1 font-medium">{formatPrice(invoice.deductionAmount ?? 0)}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <ReceiptText className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">Chi tiết các khoản phí</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-card">
              <TableRow>
                <TableHead>Loại phí</TableHead>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead className="text-right">VAT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.invoiceLines.map((line) => {
                const order = ordersById.get(line.orderId);
                return (
                  <TableRow key={line.lineId}>
                    <TableCell className="font-medium">
                      {getInvoiceChargeTypeLabel(line.chargeType)}
                    </TableCell>
                    <TableCell>{order?.trackingCode || "Chưa cập nhật"}</TableCell>
                    <TableCell>{order?.customerName || "Chưa cập nhật"}</TableCell>
                    <TableCell className="text-right">{line.quantity ?? "—"}</TableCell>
                    <TableCell className="text-right">{formatPrice(line.unitPrice)}</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(line.amount)}</TableCell>
                    <TableCell className="text-right">
                      {line.taxRate == null ? "—" : `${line.taxRate}%`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default InvoiceDetailPage;
