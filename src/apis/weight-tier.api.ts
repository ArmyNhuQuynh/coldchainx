import { apiRequest } from "@/lib/http";
import type {
  TWeightTier,
  TWeightTierListParams,
  TWeightTierListResponse,
  TWeightTierRequest,
} from "@/schemas/weight-tier.schema";
import type { BaseResponse } from "@/types/response.type";
import {
  getEnvelopeData,
  normalizeWeightTier,
  normalizeWeightTierPage,
  type ApiEnvelope,
} from "./weight-tier-normalizers";
import { API_SUFFIX } from "./util.api";

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getWeightTiers = async (params: TWeightTierListParams) => {
  const response = await apiRequest.baseApi.get<
    ApiEnvelope<TWeightTierListResponse>
  >(API_SUFFIX.WEIGHT_TIERS_API, { params: cleanParams(params) });

  return {
    ...response.data,
    data: normalizeWeightTierPage(getEnvelopeData(response.data)),
  };
};

const getWeightTierById = async (id: string) => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TWeightTier>>(
    `${API_SUFFIX.WEIGHT_TIERS_API}/${id}`
  );
  const weightTier = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: weightTier ? normalizeWeightTier(weightTier) : weightTier,
  };
};

const getWeightTiersByRoute = async (routeId: string) => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TWeightTier[]>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/weight-tiers`
  );
  const items = getEnvelopeData(response.data) ?? [];

  return {
    ...response.data,
    data: items.map(normalizeWeightTier),
  };
};

const createWeightTier = async (data: TWeightTierRequest) => {
  const response = await apiRequest.baseApi.post<ApiEnvelope<TWeightTier>>(
    API_SUFFIX.WEIGHT_TIERS_API,
    data
  );
  const weightTier = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: weightTier ? normalizeWeightTier(weightTier) : weightTier,
  };
};

const updateWeightTier = async (id: string, data: TWeightTierRequest) => {
  const response = await apiRequest.baseApi.put<ApiEnvelope<TWeightTier>>(
    `${API_SUFFIX.WEIGHT_TIERS_API}/${id}`,
    data
  );
  const weightTier = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: weightTier ? normalizeWeightTier(weightTier) : weightTier,
  };
};

const deleteWeightTier = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.WEIGHT_TIERS_API}/${id}`
  );
  return response.data;
};

export const weightTierApi = {
  getWeightTiers,
  getWeightTierById,
  getWeightTiersByRoute,
  createWeightTier,
  updateWeightTier,
  deleteWeightTier,
};
