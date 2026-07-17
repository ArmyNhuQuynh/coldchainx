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

const getAllOrders = async (params?: Omit<TGetOrdersQuery, "pageNumber" | "pageSize">) => {
  const firstPage = await getOrders({
    ...params,
    pageNumber: 1,
    pageSize: 100,
  });

  const totalPages = firstPage.data.totalPages;
  if (totalPages <= 1) return firstPage;

  const restPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getOrders({
        ...params,
        pageNumber: index + 2,
        pageSize: 100,
      })
    )
  );

  return {
    ...firstPage,
    data: {
      ...firstPage.data,
      currentPage: 1,
      data: [
        ...firstPage.data.data,
        ...restPages.flatMap((page) => page.data.data),
      ],
    },
  };
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
    getAllOrders,
    getOrderById,
    reviewOrder
};
