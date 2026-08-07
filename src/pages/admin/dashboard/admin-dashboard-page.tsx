import DashboardFilterBar from "@/components/dashboard/dashboard-filter-bar";
import { getCurrentMonthRange, getDashboardErrorMessage } from "@/components/dashboard/dashboard-formatters";
import { DashboardErrorState, DashboardLoadingState } from "@/components/dashboard/dashboard-page-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";
import { useRoute } from "@/hooks/use-route";
import { useWarehouse } from "@/hooks/use-warehouse";
import type { TAdminDashboardParams } from "@/schemas/dashboard.schema";
import { Gauge } from "lucide-react";
import { useState } from "react";
import AdminCharts from "./components/admin-charts";

const AdminDashboardPage = () => {
  const [filters, setFilters] = useState<Omit<TAdminDashboardParams, "top">>({
    ...getCurrentMonthRange(),
    warehouseId: "",
    routeId: "",
    groupBy: "WEEK",
  });
  const { getAdminOverview } = useDashboard();
  const { getWarehouses } = useWarehouse();
  const { getRoutes } = useRoute();
  const query = getAdminOverview({ ...filters, top: 15 });
  const warehousesQuery = getWarehouses();
  const routesQuery = getRoutes({ pageNumber: 1, pageSize: 100 });
  const data = query.data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Tổng quan hệ thống</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi đơn hàng, chuyến, nguồn lực kho và thiết bị trên toàn hệ thống.
          </p>
        </div>
      </div>

      <DashboardFilterBar isFetching={query.isFetching} onRefresh={() => query.refetch()}>
        <div className="space-y-1.5">
          <Label htmlFor="admin-from-date">Từ ngày</Label>
          <Input id="admin-from-date" type="date" value={filters.fromDate} max={filters.toDate} onChange={(event) => setFilters((current) => ({ ...current, fromDate: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-to-date">Đến ngày</Label>
          <Input id="admin-to-date" type="date" value={filters.toDate} min={filters.fromDate} onChange={(event) => setFilters((current) => ({ ...current, toDate: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Kho</Label>
          <Select value={filters.warehouseId || "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, warehouseId: value === "ALL" ? "" : value }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Tất cả kho" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả kho</SelectItem>
              {(warehousesQuery.data ?? []).map((warehouse) => <SelectItem key={warehouse.warehouseId} value={warehouse.warehouseId}>{warehouse.label || warehouse.warehouseName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tuyến</Label>
          <Select value={filters.routeId || "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, routeId: value === "ALL" ? "" : value }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Tất cả tuyến" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả tuyến</SelectItem>
              {(routesQuery.data?.data ?? []).map((route) => <SelectItem key={route.routeId} value={route.routeId}>{route.routeCode} · {route.originCity} → {route.destCity}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Nhóm thời gian</Label>
          <Select
            value={filters.groupBy}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                groupBy: value as TAdminDashboardParams["groupBy"],
              }))
            }
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEK">Theo tuần</SelectItem>
              <SelectItem value="MONTH">Theo tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardFilterBar>

      {query.isLoading ? <DashboardLoadingState /> : query.isError || !data ? (
        <DashboardErrorState message={getDashboardErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : (
        <AdminCharts data={data} />
      )}
    </div>
  );
};

export default AdminDashboardPage;
