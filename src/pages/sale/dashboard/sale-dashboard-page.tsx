import DashboardFilterBar from "@/components/dashboard/dashboard-filter-bar";
import {
  getDashboardErrorMessage,
  getToday,
} from "@/components/dashboard/dashboard-formatters";
import {
  DashboardErrorState,
  DashboardLoadingState,
} from "@/components/dashboard/dashboard-page-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";
import { PATH_SALE_DASHBOARD } from "@/routes/path";
import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SalesCharts from "./components/sales-charts";
import SalesKpis from "./components/sales-kpis";

type SalesPeriodMode = "WEEK" | "MONTH";

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPeriodRange = (mode: SalesPeriodMode, anchorValue: string) => {
  const [year, month, day] = anchorValue.split("-").map(Number);
  const anchor = new Date(year, month - 1, day);

  if (mode === "WEEK") {
    const mondayOffset = (anchor.getDay() + 6) % 7;
    const from = new Date(anchor);
    from.setDate(anchor.getDate() - mondayOffset);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    return { fromDate: toDateInputValue(from), toDate: toDateInputValue(to) };
  }

  return {
    fromDate: toDateInputValue(new Date(year, month - 1, 1)),
    toDate: toDateInputValue(new Date(year, month, 0)),
  };
};

const SaleDashboardPage = () => {
  const navigate = useNavigate();
  const [periodMode, setPeriodMode] = useState<SalesPeriodMode>("MONTH");
  const [anchorDate, setAnchorDate] = useState(getToday);
  const filters = useMemo(
    () => getPeriodRange(periodMode, anchorDate),
    [periodMode, anchorDate]
  );
  const { getSalesOverview } = useDashboard();
  const query = getSalesOverview(filters);
  const data = query.data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Tổng quan Sale</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi đơn hàng, báo giá, hợp đồng và các hồ sơ cần ưu tiên.
          </p>
        </div>
      </div>

      <DashboardFilterBar isFetching={query.isFetching} onRefresh={() => query.refetch()}>
        <div className="space-y-1.5">
          <Label>Khoảng thống kê</Label>
          <Select
            value={periodMode}
            onValueChange={(value) => setPeriodMode(value as SalesPeriodMode)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEK">Theo tuần</SelectItem>
              <SelectItem value="MONTH">Theo tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sales-anchor-date">Ngày tham chiếu</Label>
          <Input
            id="sales-anchor-date"
            type="date"
            value={anchorDate}
            onChange={(event) => setAnchorDate(event.target.value)}
          />
        </div>
      </DashboardFilterBar>

      {query.isLoading ? (
        <DashboardLoadingState />
      ) : query.isError || !data ? (
        <DashboardErrorState
          message={getDashboardErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      ) : (
        <>
          <SalesKpis
            distribution={data.workDistribution}
            unreadMessages={data.kpis.unreadMessages}
            onOpenMessages={() => navigate(PATH_SALE_DASHBOARD.customerCare.root)}
          />
          <SalesCharts data={data} />
        </>
      )}
    </div>
  );
};

export default SaleDashboardPage;
