import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/hooks/use-finance";
import { formatPrice } from "@/lib/utils";
import { BarChart3, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDefaultFinancialRange, getFinanceErrorMessage, isValidDateRange } from "../components/finance-formatters";
import { FinanceErrorState, FinanceTableLoading } from "../components/finance-page-state";

const COLORS = ["#2f80c8", "#9eb6c9"];

const FinancialReportPage = () => {
  const { getFinancialSummary } = useFinance();
  const [range, setRange] = useState(getDefaultFinancialRange);
  const validRange = isValidDateRange(range.fromDate, range.toDate);
  const query = getFinancialSummary(
    {
      fromDate: range.fromDate || undefined,
      toDate: range.toDate || undefined,
    },
    validRange
  );
  const data = query.data;

  const cashFlowData = data
    ? [
        { name: "Doanh thu hóa đơn", value: data.totalRevenue },
        { name: "COD đã thu", value: data.totalCodCollected },
        { name: "Bồi thường", value: data.totalClaimPayout },
        { name: "Hoàn chi tài xế", value: data.totalDriverReimbursement },
      ]
    : [];
  const invoiceData = data
    ? [
        { name: "Đã thanh toán", value: data.paidInvoicesCount },
        { name: "Chưa thanh toán", value: data.unpaidInvoicesCount },
      ]
    : [];

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 text-blue-700"><BarChart3 className="h-5 w-5" /></div>
        <div><h1 className="text-3xl font-semibold">Báo cáo tài chính</h1><p className="mt-1 text-muted-foreground">Tổng hợp doanh thu, COD và các khoản chi trong khoảng thời gian đã chọn.</p></div>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5"><label className="text-sm font-medium">Từ ngày</label><Input type="date" value={range.fromDate} max={range.toDate} onChange={(event) => setRange((current) => ({ ...current, fromDate: event.target.value }))} /></div>
        <div className="space-y-1.5"><label className="text-sm font-medium">Đến ngày</label><Input type="date" value={range.toDate} min={range.fromDate} onChange={(event) => setRange((current) => ({ ...current, toDate: event.target.value }))} /></div>
        <Button type="button" variant="outline" className="gap-2" disabled={query.isFetching || !validRange} onClick={() => query.refetch()}><RefreshCw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />Làm mới</Button>
        {!validRange && <p className="text-sm text-rose-600">Khoảng ngày không hợp lệ.</p>}
      </div>

      {query.isLoading ? <FinanceTableLoading rows={6} /> : query.isError || !data ? (
        <FinanceErrorState message={getFinanceErrorMessage(query.error, "Không thể tải báo cáo tài chính.")} onRetry={() => query.refetch()} />
      ) : (
        <>
          <div className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-2 xl:grid-cols-4">
            <div className="p-4"><p className="text-sm text-muted-foreground">Doanh thu hóa đơn</p><p className="mt-1 text-xl font-semibold">{formatPrice(data.totalRevenue)}</p><p className="mt-1 text-xs text-muted-foreground">Đã gồm VAT theo cách tính hiện tại của BE</p></div>
            <div className="border-t p-4 sm:border-l sm:border-t-0"><p className="text-sm text-muted-foreground">Thuế VAT</p><p className="mt-1 text-xl font-semibold">{formatPrice(data.totalTaxVat)}</p></div>
            <div className="border-t p-4 xl:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">COD đã thu</p><p className="mt-1 text-xl font-semibold text-emerald-700">{formatPrice(data.totalCodCollected)}</p></div>
            <div className="border-t p-4 sm:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">Dòng tiền vận hành ròng</p><p className="mt-1 text-xl font-semibold text-blue-700">{formatPrice(data.netOperatingCashFlow)}</p></div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <section className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold">Cơ cấu dòng tiền</h2><p className="mt-1 text-sm text-muted-foreground">So sánh các khoản tổng hợp trong kỳ.</p>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData} margin={{ top: 8, right: 12, left: 12, bottom: 36 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={58} interval={0} />
                    <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)}tr`} allowDecimals={false} />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Bar dataKey="value" fill="#2f80c8" radius={[4, 4, 0, 0]} maxBarSize={64} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-5">
              <h2 className="font-semibold">Tình trạng hóa đơn</h2><p className="mt-1 text-sm text-muted-foreground">{data.totalInvoicesCount.toLocaleString("vi-VN")} hóa đơn trong kỳ.</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={invoiceData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2}>{invoiceData.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}</Pie><Tooltip formatter={(value) => Number(value).toLocaleString("vi-VN")} /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {invoiceData.map((item, index) => <div key={item.name} className="rounded-lg border p-3"><span className="mb-2 block h-2 w-8 rounded" style={{ backgroundColor: COLORS[index] }} /><p className="text-muted-foreground">{item.name}</p><p className="mt-1 text-lg font-semibold">{item.value.toLocaleString("vi-VN")}</p></div>)}
              </div>
            </section>
          </div>

          <div className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-2 xl:grid-cols-4">
            <div className="p-4"><p className="text-sm text-muted-foreground">Bồi thường khách hàng</p><p className="mt-1 text-lg font-semibold text-rose-700">{formatPrice(data.totalClaimPayout)}</p><p className="text-xs text-muted-foreground">{data.totalClaimsCount} hồ sơ</p></div>
            <div className="border-t p-4 sm:border-l sm:border-t-0"><p className="text-sm text-muted-foreground">Hoàn chi tài xế</p><p className="mt-1 text-lg font-semibold text-rose-700">{formatPrice(data.totalDriverReimbursement)}</p><p className="text-xs text-muted-foreground">Từ các sự cố đã duyệt/hoàn</p></div>
            <div className="border-t p-4 xl:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">Tổng sự cố</p><p className="mt-1 text-2xl font-semibold">{data.totalIncidentsCount.toLocaleString("vi-VN")}</p></div>
            <div className="border-t p-4 sm:border-l xl:border-t-0"><p className="text-sm text-muted-foreground">Tổng khoản chi</p><p className="mt-1 text-lg font-semibold">{formatPrice(data.totalClaimPayout + data.totalDriverReimbursement)}</p></div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialReportPage;
