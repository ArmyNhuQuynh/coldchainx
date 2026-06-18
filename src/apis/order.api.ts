import { apiRequest } from "@/lib/http";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type {
  TGetOrdersQuery,
  TOrder,
  TReviewOrder,
  TReviewOrderResponse,
} from "@/schemas/order.schema";


const getOrders = async (params?: TGetOrdersQuery) => {
    const response = await apiRequest.baseApi.get<BaseResponse<PaginationResponse<TOrder>>>(
        API_SUFFIX.ORDERS_API,
        { params }
    );
    return response.data; 
};

const getOrderById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TOrder>>(
    `${API_SUFFIX.ORDERS_API}/${id}`
  );
  return response.data;
};

const reviewOrder = async (id: string, data: TReviewOrder) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TReviewOrderResponse>>(
    `${API_SUFFIX.ORDERS_API}/${id}/review`,
    data
  );
  return response.data;
};

export const orderApi = {
    getOrders,
    getOrderById,
    reviewOrder
};
