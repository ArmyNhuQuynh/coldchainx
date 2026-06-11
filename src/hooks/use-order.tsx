import { orderApi } from "@/apis/order.api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { TGetOrdersQuery } from "@/schemas/order.schema";

export const useOrder = () => {
  const getOrders = (params: TGetOrdersQuery = {}) => {
    const { pageNumber = 1, pageSize = 10 } = params;

    return useQuery({
      queryKey: ["orders", { pageNumber, pageSize }],
      queryFn: () => orderApi.getOrders({ pageNumber, pageSize }),
      placeholderData: keepPreviousData,
    });
  };


  const getOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
  });
  };
  return {
    getOrders,
    getOrderById,
  };
};



