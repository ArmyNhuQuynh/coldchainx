import { apiRequest } from "@/lib/http";
import type {
  TCustomer,
  TCustomerOrderSummary,
  TGetCustomerOrdersQuery,
  TGetCustomersQuery,
} from "@/schemas/customer.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getCustomers = async (params?: TGetCustomersQuery) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TCustomer>>
  >(API_SUFFIX.CUSTOMERS_API, { params });

  return response.data;
};

const getCustomerById = async (customerId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TCustomer>>(
    `${API_SUFFIX.CUSTOMERS_API}/${customerId}`
  );

  return response.data;
};

const getCustomerOrders = async (
  customerId: string,
  params?: TGetCustomerOrdersQuery
) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TCustomerOrderSummary>>
  >(`${API_SUFFIX.CUSTOMERS_API}/${customerId}/orders`, { params });

  return response.data;
};

export const customerApi = {
  getCustomers,
  getCustomerById,
  getCustomerOrders,
};
