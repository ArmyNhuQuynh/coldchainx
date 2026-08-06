import { apiRequest } from "@/lib/http";
import type {
  TAccountantDashboardParams,
  TAccountantOverview,
  TAdminDashboardParams,
  TAdminOverview,
  TDateRangeDashboardParams,
  TDispatcherDashboardParams,
  TDispatcherOverview,
  TSalesOverview,
} from "@/schemas/dashboard.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getSalesOverview = async (params: TDateRangeDashboardParams) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TSalesOverview>>(
    `${API_SUFFIX.DASHBOARDS_API}/sales/overview`,
    { params: cleanParams(params) }
  );
  return response.data;
};

const getDispatcherOverview = async (params: TDispatcherDashboardParams) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TDispatcherOverview>
  >(`${API_SUFFIX.DASHBOARDS_API}/dispatcher/overview`, {
    params: cleanParams(params),
  });
  return response.data;
};

const getAdminOverview = async (params: TAdminDashboardParams) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TAdminOverview>>(
    `${API_SUFFIX.DASHBOARDS_API}/admin/overview`,
    { params: cleanParams(params) }
  );
  return response.data;
};

const getAccountantOverview = async (params: TAccountantDashboardParams) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TAccountantOverview>
  >(`${API_SUFFIX.DASHBOARDS_API}/accountant/overview`, {
    params: cleanParams(params),
  });
  return response.data;
};

export const dashboardApi = {
  getSalesOverview,
  getDispatcherOverview,
  getAdminOverview,
  getAccountantOverview,
};
