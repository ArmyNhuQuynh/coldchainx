import { apiRequest } from "@/lib/http";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type { TGetOrdersQuery, TOrder, TReviewOrder } from "@/schemas/order.schema";


const getOrders = async (params?: TGetOrdersQuery) => {
    const response = await apiRequest.baseApi.get<BaseResponse<PaginationResponse<TOrder>>>(
        API_SUFFIX.ORDERS_API,
        { params }
    );
    return response.data; 
};

const getOrderById = async (id: string) =>
  await apiRequest.baseApi.get<BaseResponse<TOrder>>(
    `${API_SUFFIX.ORDERS_API}/${id}`
  );

const reviewOrder = async (id: string, data: TReviewOrder) =>
  await apiRequest.baseApi.post<BaseResponse<null>>(
    `${API_SUFFIX.ORDERS_API}/${id}/review`,
    data
  );

export const orderApi = {
    getOrders,
    getOrderById,
    reviewOrder
};