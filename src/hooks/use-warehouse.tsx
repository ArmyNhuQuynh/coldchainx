import { warehouseApi } from "@/apis/warehouse.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useWarehouse = () => {
  const getWarehouses = () =>
    useQuery({
      queryKey: ["warehouses", "lookup"],
      queryFn: warehouseApi.getWarehouses,
      placeholderData: keepPreviousData,
    });

  return {
    getWarehouses,
  };
};

