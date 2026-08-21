import { dispatchApi } from "@/apis/dispatch.api";
import type {
  TDispatchPackingRequest,
  TManualDispatchRequest,
  TWarehouseRedispatchRequest,
} from "@/schemas/dispatch.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDispatchPlanning = () => {
  const queryClient = useQueryClient();

  const simulatePacking = useMutation({
    mutationFn: (data: TDispatchPackingRequest) =>
      dispatchApi.simulatePacking(data),
  });

  const manualDispatch = useMutation({
    mutationFn: (data: TManualDispatchRequest) => dispatchApi.manualDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver"] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  const createTripFromWarehouse = useMutation({
    mutationFn: (data: TWarehouseRedispatchRequest) =>
      dispatchApi.createTripFromWarehouse(data),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dispatch"] }),
        queryClient.invalidateQueries({ queryKey: ["drivers"] }),
        queryClient.invalidateQueries({ queryKey: ["driver"] }),
        queryClient.invalidateQueries({ queryKey: ["incidents"] }),
      ]),
  });

  return {
    simulatePacking,
    manualDispatch,
    createTripFromWarehouse,
  };
};
