import DashboardKpiGrid from "@/components/dashboard/dashboard-kpi-grid";
import { formatDashboardCurrency } from "@/components/dashboard/dashboard-formatters";
import type { TAccountantKpis } from "@/schemas/dashboard.schema";
import {
  Banknote,
  CircleDollarSign,
  ClipboardClock,
  HandCoins,
  Landmark,
  Receipt,
  ScanSearch,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

type Props = {
  kpis: TAccountantKpis;
  onOpenClaims: () => void;
  onOpenReimbursements: () => void;
};

const AccountantKpis = ({ kpis, onOpenClaims, onOpenReimbursements }: Props) => (
  <DashboardKpiGrid
    columns="five"
    items={[
      { key: "recognized-revenue", title: "Doanh thu ghi nhận", value: formatDashboardCurrency(kpis.recognizedRevenue), icon: CircleDollarSign, tone: "success" },
      { key: "cash-collected", title: "Tiền thực thu", value: formatDashboardCurrency(kpis.cashCollected), icon: Banknote, tone: "info" },
      { key: "cod-collected", title: "COD đã thu", value: formatDashboardCurrency(kpis.codCollected), description: "Khoản thu hộ, không cộng vào doanh thu", icon: HandCoins },
      { key: "receivables", title: "Công nợ", value: formatDashboardCurrency(kpis.receivables), icon: Receipt, tone: kpis.receivables > 0 ? "warning" : "default" },
      { key: "vat", title: "Thuế VAT", value: formatDashboardCurrency(kpis.vatAmount), icon: Landmark },
      { key: "claim-payout", title: "Bồi thường đã chi", value: formatDashboardCurrency(kpis.claimPayout), icon: ShieldCheck, onClick: onOpenClaims },
      { key: "driver-reimbursement", title: "Hoàn chi phí tài xế", value: formatDashboardCurrency(kpis.driverReimbursement), icon: WalletCards, onClick: onOpenReimbursements },
      { key: "net-cash-flow", title: "Dòng tiền thuần", value: formatDashboardCurrency(kpis.netCashFlow), icon: Banknote, tone: kpis.netCashFlow < 0 ? "danger" : "success" },
      { key: "pending-claims", title: "Claim chờ xử lý", value: kpis.pendingAccountantClaims, icon: ClipboardClock, tone: kpis.pendingAccountantClaims > 0 ? "warning" : "default", onClick: onOpenClaims },
      { key: "pending-verification", title: "Giao dịch chờ xác minh", value: kpis.pendingVerificationTransactions, icon: ScanSearch, tone: kpis.pendingVerificationTransactions > 0 ? "warning" : "default" },
    ]}
  />
);

export default AccountantKpis;
