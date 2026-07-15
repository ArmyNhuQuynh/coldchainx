import { apiRequest } from "@/lib/http";
import type {
  TServiceCatalog,
  TServiceCatalogCreateRequest,
  TServiceCatalogUpdateRequest,
} from "@/schemas/service-catalog.schema";
import type { BaseResponse } from "@/types/response.type";
import {
  getEnvelopeData,
  normalizeServiceCatalog,
  type ApiEnvelope,
} from "./service-catalog-normalizers";
import { API_SUFFIX } from "./util.api";

const getServiceCatalogs = async () => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TServiceCatalog[]>>(
    API_SUFFIX.SERVICE_CATALOGS_API
  );
  const items = getEnvelopeData(response.data) ?? [];

  return {
    ...response.data,
    data: items.map(normalizeServiceCatalog),
  };
};

const getActiveServiceCatalogs = async () => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TServiceCatalog[]>>(
    `${API_SUFFIX.SERVICE_CATALOGS_API}/active`
  );
  const items = getEnvelopeData(response.data) ?? [];

  return {
    ...response.data,
    data: items.map(normalizeServiceCatalog),
  };
};

const getServiceCatalogById = async (id: string) => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TServiceCatalog>>(
    `${API_SUFFIX.SERVICE_CATALOGS_API}/${id}`
  );
  const service = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: service ? normalizeServiceCatalog(service) : service,
  };
};

const createServiceCatalog = async (data: TServiceCatalogCreateRequest) => {
  const response = await apiRequest.baseApi.post<ApiEnvelope<TServiceCatalog>>(
    API_SUFFIX.SERVICE_CATALOGS_API,
    data
  );
  const service = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: service ? normalizeServiceCatalog(service) : service,
  };
};

const updateServiceCatalog = async (
  id: string,
  data: TServiceCatalogUpdateRequest
) => {
  const response = await apiRequest.baseApi.put<ApiEnvelope<TServiceCatalog>>(
    `${API_SUFFIX.SERVICE_CATALOGS_API}/${id}`,
    data
  );
  const service = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: service ? normalizeServiceCatalog(service) : service,
  };
};

const deleteServiceCatalog = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.SERVICE_CATALOGS_API}/${id}`
  );
  return response.data;
};

export const serviceCatalogApi = {
  getServiceCatalogs,
  getActiveServiceCatalogs,
  getServiceCatalogById,
  createServiceCatalog,
  updateServiceCatalog,
  deleteServiceCatalog,
};
