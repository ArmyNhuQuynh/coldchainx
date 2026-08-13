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
import { formatPrice } from "@/lib/utils";
import {
  getPaymentMethodLabel,
  getTransactionStatusLabel,
  getTransactionTypeLabel,
  PAYMENT_METHOD,
  PAYMENT_TRANSACTION_STATUS,
  PAYMENT_TRANSACTION_TYPE,
} from "@/types/enums/payment-transaction.enum";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, WalletCards } from "lucide-react";
import { useState } from "react";
import FinancePagination from "../components/finance-pagination";
import { formatFinanceDate, getFinanceErrorMessage, isValidDateRange } from "../components/finance-formatters";
import { FinanceEmptyState, FinanceErrorState, FinanceTableLoading } from "../components/finance-page-state";

const ALL = "ALL";

const PaymentTransactionPage = () => {
  const { getPaymentTransactions } = useFinance();
  const [pageNumber, setPageNumber] = useState(1);
  const [filters, setFilters] = useState({
    status: ALL,
    transactionType: ALL,
    paymentMethod: ALL,
    fromDate: "",
    toDate: "",
  });
  const validRange = isValidDateRange(filters.fromDate, filters.toDate);
  const params = {
    pageNumber,
    pageSize: 15,
    status: filters.status === ALL ? undefined : filters.status,
    transactionType: filters.transactionType === ALL ? undefined : filters.transactionType,
    paymentMethod: filters.paymentMethod === ALL ? undefined : filters.paymentMethod,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
  };
  const query = getPaymentTransactions(params, validRange);
  const data = query.data;

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPageNumber(1);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 text-blue-700">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Giao dịch thanh toán</h1>
            <p className="mt-1 text-muted-foreground">
              Theo dõi tiền thu, tiền chi và chứng từ thanh toán được BE ghi nhận.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="gap-2" disabled={query.isFetching} onClick={() => query.refetch()}>
          <RefreshCw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </header>

      <div className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-2 xl:grid-cols-4">
        <div className="p-4"><p className="text-sm text-muted-foreground">Số giao dịch</p><p className="mt-1 text-2xl font-semibold">{data?.summary.totalTransactionsCount.toLocaleString("vi-VN") ?? 0}</p></div>
        <div className="border-t p-4 sm:border-l sm:border-t-0"><p className="text-sm text-muted-foreground">Tổng tiền thu</p><p className="mt-1 text-xl font-semibold text-emerald-700">{formatPrice(data?.summary.totalCodReceived ?? 0)}</p></div>
        <div className="border-t p-4 xl:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">Tổng tiền chi</p><p className="mt-1 text-xl font-semibold text-rose-700">{formatPrice(data?.summary.totalClaimOutflow ?? 0)}</p></div>
        <div className="border-t p-4 sm:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">Dòng tiền ròng</p><p className="mt-1 text-xl font-semibold">{formatPrice(data?.summary.netCashFlow ?? 0)}</p></div>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-2 xl:grid-cols-5">
        <Select value={filters.transactionType} onValueChange={(value) => updateFilter("transactionType", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả dòng tiền</SelectItem>
            <SelectItem value={PAYMENT_TRANSACTION_TYPE.IN}>Tiền thu</SelectItem>
            <SelectItem value={PAYMENT_TRANSACTION_TYPE.OUT}>Tiền chi</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả trạng thái</SelectItem>
            <SelectItem value={PAYMENT_TRANSACTION_STATUS.COMPLETED}>Hoàn tất</SelectItem>
            <SelectItem value={PAYMENT_TRANSACTION_STATUS.PENDING_VERIFY}>Chờ xác minh</SelectItem>
            <SelectItem value={PAYMENT_TRANSACTION_STATUS.FAILED}>Thất bại</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.paymentMethod} onValueChange={(value) => updateFilter("paymentMethod", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả phương thức</SelectItem>
            <SelectItem value={PAYMENT_METHOD.CASH}>Tiền mặt</SelectItem>
            <SelectItem value={PAYMENT_METHOD.QR}>QR</SelectItem>
            <SelectItem value={PAYMENT_METHOD.PAYOS}>PayOS</SelectItem>
            <SelectItem value={PAYMENT_METHOD.BANK_TRANSFER}>Chuyển khoản</SelectItem>
          </SelectContent>
        </Select>
        <div><Input type="date" value={filters.fromDate} max={filters.toDate || undefined} onChange={(event) => updateFilter("fromDate", event.target.value)} aria-label="Từ ngày" /></div>
        <div><Input type="date" value={filters.toDate} min={filters.fromDate || undefined} onChange={(event) => updateFilter("toDate", event.target.value)} aria-label="Đến ngày" /></div>
        {!validRange && <p className="text-sm text-rose-600 md:col-span-2 xl:col-span-5">Ngày bắt đầu không được sau ngày kết thúc.</p>}
      </div>

      {query.isError ? (
        <FinanceErrorState message={getFinanceErrorMessage(query.error, "Không thể tải giao dịch thanh toán.")} onRetry={() => query.refetch()} />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          {query.isLoading ? <FinanceTableLoading /> : !data?.transactions.length ? (
            <FinanceEmptyState message="Không có giao dịch phù hợp với bộ lọc." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-card"><TableRow><TableHead>Giao dịch</TableHead><TableHead>Khách hàng / Order</TableHead><TableHead>Dòng tiền</TableHead><TableHead>Phương thức</TableHead><TableHead className="text-right">Số tiền</TableHead><TableHead>Trạng thái</TableHead><TableHead>Thời gian</TableHead><TableHead>Chứng từ</TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.transactions.map((transaction) => {
                    const isOut = transaction.transactionType === PAYMENT_TRANSACTION_TYPE.OUT;
                    return (
                      <TableRow key={transaction.transactionId}>
                        <TableCell><p className="font-medium">{transaction.transactionCode}</p><p className="mt-1 max-w-52 truncate text-xs text-muted-foreground" title={transaction.referenceCode ?? undefined}>{transaction.referenceCode || "Không có mã tham chiếu"}</p></TableCell>
                        <TableCell><p className="font-medium">{transaction.customerName || "Chưa xác định"}</p><p className="mt-1 text-xs text-muted-foreground">{transaction.trackingCode || "Không gắn order"}</p></TableCell>
                        <TableCell><span className={`inline-flex items-center gap-1 font-medium ${isOut ? "text-rose-700" : "text-emerald-700"}`}>{isOut ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}{getTransactionTypeLabel(transaction.transactionType)}</span></TableCell>
                        <TableCell>{getPaymentMethodLabel(transaction.paymentMethod)}</TableCell>
                        <TableCell className={`text-right font-semibold ${isOut ? "text-rose-700" : "text-emerald-700"}`}>{isOut ? "-" : "+"}{formatPrice(transaction.amount)}</TableCell>
                        <TableCell><Badge variant="outline" className={transaction.status === PAYMENT_TRANSACTION_STATUS.COMPLETED ? "border-emerald-400 text-emerald-700" : "border-amber-400 text-amber-700"}>{getTransactionStatusLabel(transaction.status)}</Badge></TableCell>
                        <TableCell>{formatFinanceDate(transaction.createdAt, true)}</TableCell>
                        <TableCell>{transaction.evidenceImageUrl ? <a className="text-blue-700 underline underline-offset-2" href={transaction.evidenceImageUrl} target="_blank" rel="noreferrer">Mở chứng từ</a> : "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <FinancePagination page={data?.pageNumber ?? pageNumber} totalPages={data?.totalPages ?? 1} totalRecords={data?.totalCount ?? 0} isLoading={query.isFetching} onChange={setPageNumber} />
        </div>
      )}
    </div>
  );
};

export default PaymentTransactionPage;
