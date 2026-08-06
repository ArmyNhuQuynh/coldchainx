import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import DashboardFilterBar from "@/components/dashboard/dashboard-filter-bar";
import { getCurrentMonthRange, getDashboardErrorMessage } from "@/components/dashboard/dashboard-formatters";
import { DashboardErrorState, DashboardLoadingState } from "@/components/dashboard/dashboard-page-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";
import type { TAccountantPriorityWorkItem } from "@/schemas/dashboard.schema";
import { PATH_ACCOUNTANT_DASHBOARD } from "@/routes/path";
import { DASHBOARD_GROUP_BY } from "@/types/enums/dashboard.enum";
import { ChartNoAxesCombined } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountantCharts from "./components/accountant-charts";
import AccountantKpis from "./components/accountant-kpis";
import AccountantWorkList from "./components/accountant-work-list";

const AccountantDashboardPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    ...getCurrentMonthRange(),
    groupBy: DASHBOARD_GROUP_BY.DAY,
  });
  const { getAccountantOverview } = useDashboard();
  const query = getAccountantOverview(filters);
  const data = query.data?.data;

  const openWorkItem = (item: TAccountantPriorityWorkItem) => {
    if (item.type === "APPROVED_DRIVER_EXPENSE") {
      navigate(PATH_ACCOUNTANT_DASHBOARD.driverReimbursement.root);
      return;
    }
    if (item.type.includes("CLAIM") || item.type === "PENDING_ACCOUNTANT_REVIEW") {
      navigate(PATH_ACCOUNTANT_DASHBOARD.claim.detail(item.referenceId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
          <ChartNoAxesCombined className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Tổng quan tài chính</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi dòng tiền, công nợ, COD và các khoản cần xử lý.
          </p>
        </div>
      </div>

      <DashboardFilterBar isFetching={query.isFetching} onRefresh={() => query.refetch()}>
        <div className="space-y-1.5">
          <Label htmlFor="accountant-from-date">Từ ngày</Label>
          <Input id="accountant-from-date" type="date" value={filters.fromDate} max={filters.toDate} onChange={(event) => setFilters((current) => ({ ...current, fromDate: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="accountant-to-date">Đến ngày</Label>
          <Input id="accountant-to-date" type="date" value={filters.toDate} min={filters.fromDate} onChange={(event) => setFilters((current) => ({ ...current, toDate: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Nhóm dữ liệu</Label>
          <Select value={filters.groupBy} onValueChange={(value: DASHBOARD_GROUP_BY) => setFilters((current) => ({ ...current, groupBy: value }))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={DASHBOARD_GROUP_BY.DAY}>Theo ngày</SelectItem>
              <SelectItem value={DASHBOARD_GROUP_BY.MONTH}>Theo tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardFilterBar>

      {query.isLoading ? <DashboardLoadingState /> : query.isError || !data ? (
        <DashboardErrorState message={getDashboardErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : (
        <>
          <AccountantKpis kpis={data.kpis} onOpenClaims={() => navigate(PATH_ACCOUNTANT_DASHBOARD.claim.root)} onOpenReimbursements={() => navigate(PATH_ACCOUNTANT_DASHBOARD.driverReimbursement.root)} />
          <AccountantCharts data={data} />
          <DashboardChartCard title="Danh sách cần xử lý" description="Các nghiệp vụ tài chính được ưu tiên theo hạn xử lý.">
            <AccountantWorkList items={data.priorityWorkItems} onOpen={openWorkItem} />
          </DashboardChartCard>
        </>
      )}
    </div>
  );
};

export default AccountantDashboardPage;
