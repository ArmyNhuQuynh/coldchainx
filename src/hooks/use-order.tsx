import { orderApi } from "@/apis/order.api";
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TGetOrdersQuery, TReviewOrder } from "@/schemas/order.schema";

export const useOrder = () => {

  const queryClient = useQueryClient(); 

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

   const reviewOrder = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TReviewOrder }) =>
      orderApi.reviewOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    getOrders,
    getOrderById,
    reviewOrder,
  };
};



