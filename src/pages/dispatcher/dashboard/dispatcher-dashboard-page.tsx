import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
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
import { useWarehouse } from "@/hooks/use-warehouse";
import type { TDashboardAlert, TDashboardWorkItem } from "@/schemas/dashboard.schema";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { Activity } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DispatcherAlerts from "./components/dispatcher-alerts";
import DispatcherCharts from "./components/dispatcher-charts";
import DispatcherKpis from "./components/dispatcher-kpis";
import DispatcherWorkList from "./components/dispatcher-work-list";

const DispatcherDashboardPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    date: string;
    warehouseId: string;
    scheduleRange: "DAY" | "WEEK";
  }>({ date: getToday(), warehouseId: "", scheduleRange: "DAY" });
  const { getDispatcherOverview } = useDashboard();
  const { getWarehouses } = useWarehouse();
  const query = getDispatcherOverview(filters);
  const warehousesQuery = getWarehouses();
  const data = query.data?.data;

  const openAlert = (alert: TDashboardAlert) => {
    if (alert.tripId) {
      navigate(PATH_DISPATCHER_DASHBOARD.tracking.detail(alert.tripId));
    }
  };

  const openWorkItem = (item: TDashboardWorkItem) => {
    if (item.type === "PENDING_DISPATCHER_CLAIM") {
      navigate(PATH_DISPATCHER_DASHBOARD.claim.detail(item.referenceId));
      return;
    }
    if (item.type === "OPEN_INCIDENT") {
      navigate(PATH_DISPATCHER_DASHBOARD.incident.detail(item.referenceId));
      return;
    }
    if (item.tripId) {
      navigate(PATH_DISPATCHER_DASHBOARD.tracking.detail(item.tripId));
      return;
    }
    navigate(PATH_DISPATCHER_DASHBOARD.dispatch.root);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Tổng quan điều phối</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi nguồn lực, chuyến đi và cảnh báo vận hành theo ngày, theo kho.
          </p>
        </div>
      </div>

      <DashboardFilterBar isFetching={query.isFetching} onRefresh={() => query.refetch()}>
        <div className="space-y-1.5">
          <Label htmlFor="dispatcher-date">Ngày vận hành</Label>
          <Input
            id="dispatcher-date"
            type="date"
            value={filters.date}
            onChange={(event) =>
              setFilters((current) => ({ ...current, date: event.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
          <Label>Kho điều phối</Label>
          <Select
            value={filters.warehouseId || "ALL"}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                warehouseId: value === "ALL" ? "" : value,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả kho</SelectItem>
              {(warehousesQuery.data ?? []).map((warehouse) => (
                <SelectItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
                  {warehouse.label || warehouse.warehouseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Khoảng lịch đi</Label>
          <Select
            value={filters.scheduleRange}
            onValueChange={(value: "DAY" | "WEEK") =>
              setFilters((current) => ({ ...current, scheduleRange: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">Theo ngày</SelectItem>
              <SelectItem value="WEEK">Theo tuần</SelectItem>
            </SelectContent>
          </Select>
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
          <DispatcherAlerts alerts={data.priorityAlerts} onOpen={openAlert} />
          <DispatcherKpis
            kpis={data.kpis}
            onOpenDispatch={() => navigate(PATH_DISPATCHER_DASHBOARD.dispatch.root)}
            onOpenTrips={() => navigate(PATH_DISPATCHER_DASHBOARD.trip.root)}
            onOpenTracking={() => navigate(PATH_DISPATCHER_DASHBOARD.tracking.root)}
            onOpenClaims={() => navigate(PATH_DISPATCHER_DASHBOARD.claim.root)}
          />
          <DispatcherCharts data={data} />
          <DashboardChartCard
            title="Công việc ưu tiên"
            description="Các công việc được BE sắp xếp theo mức độ ảnh hưởng và SLA."
          >
            <DispatcherWorkList items={data.priorityWorkItems} onOpen={openWorkItem} />
          </DashboardChartCard>
        </>
      )}
    </div>
  );
};

export default DispatcherDashboardPage;
