import { dashboardApi } from "@/apis/dashboard.api";
import type {
  TAccountantDashboardParams,
  TAdminDashboardParams,
  TDateRangeDashboardParams,
  TDispatcherDashboardParams,
} from "@/schemas/dashboard.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const DASHBOARD_STALE_TIME = 60_000;

export const useDashboard = () => {
  const getSalesOverview = (params: TDateRangeDashboardParams) =>
    useQuery({
      queryKey: ["dashboard", "sales", params],
      queryFn: () => dashboardApi.getSalesOverview(params),
      placeholderData: keepPreviousData,
      staleTime: DASHBOARD_STALE_TIME,
    });

  const getDispatcherOverview = (params: TDispatcherDashboardParams) =>
    useQuery({
      queryKey: ["dashboard", "dispatcher", params],
      queryFn: () => dashboardApi.getDispatcherOverview(params),
      placeholderData: keepPreviousData,
      staleTime: DASHBOARD_STALE_TIME,
    });

  const getAdminOverview = (params: TAdminDashboardParams) =>
    useQuery({
      queryKey: ["dashboard", "admin", params],
      queryFn: () => dashboardApi.getAdminOverview(params),
      placeholderData: keepPreviousData,
      staleTime: DASHBOARD_STALE_TIME,
    });

  const getAccountantOverview = (params: TAccountantDashboardParams) =>
    useQuery({
      queryKey: ["dashboard", "accountant", params],
      queryFn: () => dashboardApi.getAccountantOverview(params),
      placeholderData: keepPreviousData,
      staleTime: DASHBOARD_STALE_TIME,
    });

  return {
    getSalesOverview,
    getDispatcherOverview,
    getAdminOverview,
    getAccountantOverview,
  };
};
