import DashboardKpiGrid from "@/components/dashboard/dashboard-kpi-grid";
import { formatDashboardCurrency } from "@/components/dashboard/dashboard-formatters";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { Banknote, CircleDollarSign, Receipt, WalletCards } from "lucide-react";

const AdminFinancialSnapshot = ({
  data,
}: {
  data: TAdminOverview["financialSnapshot"];
}) => (
  <section className="space-y-3">
    <h2 className="text-sm font-semibold uppercase text-muted-foreground">
      Tài chính tổng quan
    </h2>
    <DashboardKpiGrid
      items={[
        { key: "revenue", title: "Doanh thu ghi nhận", value: formatDashboardCurrency(data.recognizedRevenue), icon: CircleDollarSign, tone: "success" },
        { key: "cash-flow", title: "Dòng tiền thuần", value: formatDashboardCurrency(data.netCashFlow), icon: Banknote, tone: data.netCashFlow < 0 ? "danger" : "info" },
        { key: "claim-payout", title: "Bồi thường đã chi", value: formatDashboardCurrency(data.claimPayout), icon: WalletCards },
        { key: "unpaid", title: "Hóa đơn chưa thanh toán", value: formatDashboardCurrency(data.unpaidInvoiceAmount), icon: Receipt, tone: data.unpaidInvoiceAmount > 0 ? "warning" : "default" },
      ]}
    />
  </section>
);

export default AdminFinancialSnapshot;
