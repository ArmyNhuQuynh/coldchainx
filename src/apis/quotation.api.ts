import { apiRequest } from "@/lib/http";
import type {
  TGetQuotationsQuery,
  TQuotation,
  TUpdateQuotation,
} from "@/schemas/quotation.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getQuotations = async (params?: TGetQuotationsQuery) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TQuotation>>
  >(API_SUFFIX.QUOTATIONS_API, { params });
  return response.data;
};

const getQuotationById = async (quoteId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TQuotation>>(
    `${API_SUFFIX.QUOTATIONS_API}/${quoteId}`
  );
  return response.data;
};

const getQuotationsByOrder = async (
  orderId: string,
  params?: TGetQuotationsQuery
) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TQuotation>>
  >(`${API_SUFFIX.ORDERS_API}/${orderId}/quotations`, { params });
  return response.data;
};

const updateQuotation = async (quoteId: string, data: TUpdateQuotation) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TQuotation>>(
    `${API_SUFFIX.QUOTATIONS_API}/${quoteId}`,
    data
  );
  return response.data;
};

const sendQuotation = async (quoteId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TQuotation>>(
    `${API_SUFFIX.QUOTATIONS_API}/${quoteId}/send`
  );
  return response.data;
};

export const quotationApi = {
  getQuotations,
  getQuotationById,
  getQuotationsByOrder,
  updateQuotation,
  sendQuotation,
};
