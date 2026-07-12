import { warehouseApi } from "@/apis/warehouse.api";
import type {
  TWarehouseListParams,
  TWarehouseRequest,
} from "@/schemas/warehouse.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useWarehouse = () => {
  const queryClient = useQueryClient();

  const getWarehouses = () =>
    useQuery({
      queryKey: ["warehouses", "lookup"],
      queryFn: warehouseApi.getWarehouses,
      placeholderData: keepPreviousData,
    });

  const getWarehouseList = (params: TWarehouseListParams) =>
    useQuery({
      queryKey: ["warehouses", "list", params],
      queryFn: () => warehouseApi.getWarehouseList(params),
      placeholderData: keepPreviousData,
    });

  const getWarehouseById = (id?: string) =>
    useQuery({
      queryKey: ["warehouse", id],
      queryFn: () => warehouseApi.getWarehouseById(id!),
      enabled: !!id,
    });

  const createWarehouse = useMutation({
    mutationFn: (data: TWarehouseRequest) => warehouseApi.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  const updateWarehouse = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TWarehouseRequest }) =>
      warehouseApi.updateWarehouse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
    },
  });

  const deleteWarehouse = useMutation({
    mutationFn: (id: string) => warehouseApi.deleteWarehouse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
    },
  });

  return {
    getWarehouses,
    getWarehouseList,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
};
