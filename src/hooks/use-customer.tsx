import { customerApi } from "@/apis/customer.api";
import type {
  TGetCustomerOrdersQuery,
  TGetCustomersQuery,
} from "@/schemas/customer.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const customerQueryKeys = {
  root: ["customers"] as const,
  list: (params: TGetCustomersQuery) =>
    [...customerQueryKeys.root, "list", params] as const,
  detail: (customerId: string) =>
    [...customerQueryKeys.root, "detail", customerId] as const,
  orders: (customerId: string, params: TGetCustomerOrdersQuery) =>
    [...customerQueryKeys.root, "orders", customerId, params] as const,
};

export const useCustomer = () => {
  const getCustomers = (params: TGetCustomersQuery = {}) =>
    useQuery({
      queryKey: customerQueryKeys.list(params),
      queryFn: () => customerApi.getCustomers(params),
      placeholderData: keepPreviousData,
    });

  const getCustomerById = (customerId: string) =>
    useQuery({
      queryKey: customerQueryKeys.detail(customerId),
      queryFn: () => customerApi.getCustomerById(customerId),
      enabled: !!customerId,
    });

  const getCustomerOrders = (
    customerId: string | undefined,
    params: TGetCustomerOrdersQuery = {}
  ) =>
    useQuery({
      queryKey: customerQueryKeys.orders(customerId ?? "", params),
      queryFn: () => customerApi.getCustomerOrders(customerId!, params),
      enabled: !!customerId,
    });

  return {
    getCustomers,
    getCustomerById,
    getCustomerOrders,
  };
};
