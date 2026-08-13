import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { TInvoice } from "@/schemas/finance.schema";
import { PATH_ACCOUNTANT_DASHBOARD } from "@/routes/path";
import {
  getInvoiceStatusClassName,
  getInvoiceStatusLabel,
  INVOICE_STATUS_OPTIONS,
} from "@/types/enums/invoice-status.enum";
import { ReceiptText, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FinancePagination from "../components/finance-pagination";
import {
  FinanceEmptyState,
  FinanceErrorState,
  FinanceTableLoading,
} from "../components/finance-page-state";
import {
  formatFinanceDate,
  getFinanceErrorMessage,
} from "../components/finance-formatters";

const ALL_STATUS = "ALL";

const InvoiceListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTrackingCode = searchParams.get("trackingCode")?.trim() ?? "";
  const [trackingCode, setTrackingCode] = useState(activeTrackingCode);
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState(ALL_STATUS);
  const { getInvoices, getInvoicesByOrder } = useFinance();
  const { getAllOrders } = useOrder();

  const params = {
    pageNumber,
    pageSize: 15,
    status: status === ALL_STATUS ? undefined : status,
  };
  const invoiceListQuery = getInvoices(params, !activeTrackingCode);
  const ordersQuery = getAllOrders();
  const orders = ordersQuery.data?.data.data ?? [];
  const ordersById = useMemo(
    () => new Map(orders.map((order) => [order.orderId, order])),
    [orders]
  );
  const matchedOrder = useMemo(() => {
    const normalizedCode = activeTrackingCode.toUpperCase();
    return orders.find(
      (order) => order.trackingCode.trim().toUpperCase() === normalizedCode
    );
  }, [activeTrackingCode, orders]);
  const orderInvoicesQuery = getInvoicesByOrder(matchedOrder?.orderId);

  const getInvoiceOrders = (invoice: TInvoice) => {
    const uniqueOrderIds = [...new Set(invoice.invoiceLines.map((line) => line.orderId))];
    return uniqueOrderIds
      .map((orderId) => ordersById.get(orderId))
      .filter((order) => Boolean(order));
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = trackingCode.trim();
    setSearchParams(value ? { trackingCode: value } : {});
    setPageNumber(1);
  };

  const clearSearch = () => {
    setTrackingCode("");
    setSearchParams({});
    setPageNumber(1);
  };

  const refresh = () => {
    ordersQuery.refetch();
    if (activeTrackingCode) orderInvoicesQuery.refetch();
    else invoiceListQuery.refetch();
  };

  const isFetching =
    ordersQuery.isFetching ||
    (activeTrackingCode ? orderInvoicesQuery.isFetching : invoiceListQuery.isFetching);
  const visibleInvoices = activeTrackingCode
    ? orderInvoicesQuery.data ?? []
    : invoiceListQuery.data?.data ?? [];

  const renderContent = () => {
    if (ordersQuery.isError) {
      return (
        <FinanceErrorState
          message={getFinanceErrorMessage(
            ordersQuery.error,
            "Không thể tải thông tin đơn hàng."
          )}
          onRetry={() => ordersQuery.refetch()}
        />
      );
    }

    if (activeTrackingCode && ordersQuery.isLoading) return <FinanceTableLoading />;

    if (activeTrackingCode && !matchedOrder) {
      return (
        <FinanceEmptyState
          message={`Không tìm thấy đơn hàng có mã ${activeTrackingCode}.`}
        />
      );
    }

    const activeQuery = activeTrackingCode ? orderInvoicesQuery : invoiceListQuery;
    if (activeQuery.isError) {
      return (
        <FinanceErrorState
          message={getFinanceErrorMessage(
            activeQuery.error,
            activeTrackingCode
              ? "Không thể tải hóa đơn của đơn hàng này."
              : "Không thể tải danh sách hóa đơn."
          )}
          onRetry={() => activeQuery.refetch()}
        />
      );
    }

    if (activeQuery.isLoading) return <FinanceTableLoading />;
    if (!visibleInvoices.length) {
      return (
        <FinanceEmptyState
          message={
            activeTrackingCode
              ? `Đơn ${activeTrackingCode} chưa có hóa đơn.`
              : "Không có hóa đơn phù hợp với bộ lọc đã chọn."
          }
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead>Hóa đơn</TableHead>
              <TableHead>Đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Phát hành / Hạn trả</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead className="text-right">Còn phải thu</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleInvoices.map((invoice) => {
              const invoiceOrders = getInvoiceOrders(invoice);
              const paid = Number(invoice.paidAmount ?? 0);
              const outstanding = Math.max(invoice.grandTotal - paid, 0);
              const customerNames = [
                ...new Set(
                  invoiceOrders
                    .map((order) => order?.customerName)
                    .filter((name): name is string => Boolean(name))
                ),
              ];

              return (
                <TableRow
                  key={invoice.invoiceId}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(PATH_ACCOUNTANT_DASHBOARD.invoice.detail(invoice.invoiceId))
                  }
                >
                  <TableCell>
                    <p className="font-medium">{invoice.invoiceCode}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {invoice.vatInvoiceNo || "Chưa có số VAT"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {invoiceOrders.length ? (
                      <div className="flex max-w-56 flex-wrap gap-1.5">
                        {invoiceOrders.map((order) => (
                          <Badge key={order?.orderId} variant="outline">
                            {order?.trackingCode}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Chưa cập nhật</span>
                    )}
                  </TableCell>
                  <TableCell>{customerNames.join(", ") || "Chưa cập nhật"}</TableCell>
                  <TableCell>
                    <p>{formatFinanceDate(invoice.issuedDate)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Hạn {formatFinanceDate(invoice.dueDate)}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(invoice.grandTotal)}
                  </TableCell>
                  <TableCell className="text-right text-amber-700">
                    {formatPrice(outstanding)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getInvoiceStatusClassName(invoice.status)}
                    >
                      {getInvoiceStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 text-blue-700">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Hóa đơn</h1>
            <p className="mt-1 text-muted-foreground">
              Theo dõi hóa đơn, số tiền đã thu và công nợ còn lại.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={isFetching}
          onClick={refresh}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </header>

      <form
        onSubmit={submitSearch}
        className="grid gap-3 rounded-lg border bg-card p-4 lg:grid-cols-[minmax(260px,1fr)_280px_auto] lg:items-end"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tìm theo mã đơn hàng</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="Ví dụ: PROSHIP-2026..."
              className="pl-9 pr-9"
            />
            {trackingCode && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Xóa mã đơn đang nhập"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Trạng thái hóa đơn</label>
          <Select
            value={status}
            disabled={Boolean(activeTrackingCode)}
            onValueChange={(value) => {
              setStatus(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS}>Tất cả trạng thái</SelectItem>
              {INVOICE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={!trackingCode.trim() || isFetching}>
            Tra cứu
          </Button>
          {activeTrackingCode && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              Xem tất cả
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border bg-card">
        {renderContent()}
        {!activeTrackingCode && (
          <FinancePagination
            page={invoiceListQuery.data?.currentPage ?? pageNumber}
            totalPages={invoiceListQuery.data?.totalPages ?? 1}
            totalRecords={invoiceListQuery.data?.totalRecords ?? 0}
            isLoading={invoiceListQuery.isFetching}
            onChange={setPageNumber}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceListPage;
