import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/hooks/use-finance";
import { INVOICE_STATUS_OPTIONS } from "@/types/enums/invoice-status.enum";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getDefaultFinancialRange, getFinanceErrorMessage, isValidDateRange, isValidGuid } from "../components/finance-formatters";

const ALL = "ALL";

const FinancialExportPage = () => {
  const { exportVatInvoices, exportCodSettlement, exportClaimsExpenses } = useFinance();
  const [range, setRange] = useState(getDefaultFinancialRange);
  const [invoiceStatus, setInvoiceStatus] = useState(ALL);
  const [driverId, setDriverId] = useState("");
  const validRange = isValidDateRange(range.fromDate, range.toDate);
  const validDriverId = !driverId.trim() || isValidGuid(driverId);
  const baseParams = { fromDate: range.fromDate || undefined, toDate: range.toDate || undefined };

  const runExport = async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      toast.error(getFinanceErrorMessage(error, "Không thể xuất bảng kê."));
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 text-blue-700"><FileSpreadsheet className="h-5 w-5" /></div><div><h1 className="text-3xl font-semibold">Xuất bảng kê</h1><p className="mt-1 text-muted-foreground">Tải các bảng kê CSV do BE tổng hợp theo khoảng thời gian.</p></div></header>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5"><label className="text-sm font-medium">Từ ngày</label><Input type="date" value={range.fromDate} max={range.toDate} onChange={(event) => setRange((current) => ({ ...current, fromDate: event.target.value }))} /></div>
        <div className="space-y-1.5"><label className="text-sm font-medium">Đến ngày</label><Input type="date" value={range.toDate} min={range.fromDate} onChange={(event) => setRange((current) => ({ ...current, toDate: event.target.value }))} /></div>
        {!validRange && <p className="pb-2 text-sm text-rose-600">Khoảng ngày không hợp lệ.</p>}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="flex flex-col rounded-lg border bg-card p-5"><h2 className="text-lg font-semibold">Bảng kê VAT</h2><p className="mt-1 min-h-10 text-sm text-muted-foreground">Danh sách hóa đơn, khách hàng, order, tiền trước thuế, VAT và tổng tiền.</p><div className="mt-5"><label className="mb-1.5 block text-sm font-medium">Trạng thái hóa đơn</label><Select value={invoiceStatus} onValueChange={setInvoiceStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Tất cả trạng thái</SelectItem>{INVOICE_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div><Button type="button" className="mt-5 gap-2" disabled={!validRange || exportVatInvoices.isPending} onClick={() => runExport(() => exportVatInvoices.mutateAsync({ ...baseParams, status: invoiceStatus === ALL ? undefined : invoiceStatus }), "Đã tải bảng kê VAT.")}><Download className="h-4 w-4" />Xuất VAT</Button></section>

        <section className="flex flex-col rounded-lg border bg-card p-5"><h2 className="text-lg font-semibold">Bảng kê COD</h2><p className="mt-1 min-h-10 text-sm text-muted-foreground">Bảng kê chuyến và tài xế trong kỳ theo dữ liệu export hiện tại của BE.</p><div className="mt-5"><label className="mb-1.5 block text-sm font-medium">Mã lọc tài xế (không bắt buộc)</label><Input value={driverId} onChange={(event) => setDriverId(event.target.value)} placeholder="Nhập mã lọc do hệ thống cấp" />{!validDriverId && <p className="mt-1 text-xs text-rose-600">Mã lọc tài xế không hợp lệ.</p>}</div><Button type="button" className="mt-5 gap-2" disabled={!validRange || !validDriverId || exportCodSettlement.isPending} onClick={() => runExport(() => exportCodSettlement.mutateAsync({ ...baseParams, driverId: driverId.trim() || undefined }), "Đã tải bảng kê COD.")}><Download className="h-4 w-4" />Xuất COD</Button></section>

        <section className="flex flex-col rounded-lg border bg-card p-5"><h2 className="text-lg font-semibold">Chi phí bồi thường</h2><p className="mt-1 min-h-10 text-sm text-muted-foreground">Hồ sơ bồi thường khách hàng và chi phí sự cố tài xế trong kỳ.</p><div className="mt-5 rounded-lg border p-3 text-sm text-muted-foreground">API này chỉ hỗ trợ lọc theo ngày, không có thêm trạng thái hay đối tượng nhận tiền.</div><Button type="button" className="mt-5 gap-2" disabled={!validRange || exportClaimsExpenses.isPending} onClick={() => runExport(() => exportClaimsExpenses.mutateAsync(baseParams), "Đã tải bảng kê chi phí bồi thường.")}><Download className="h-4 w-4" />Xuất chi phí</Button></section>
      </div>
    </div>
  );
};

export default FinancialExportPage;
