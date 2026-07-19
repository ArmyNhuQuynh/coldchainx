import { dispatchApi } from "@/apis/dispatch.api";
import type {
  TDispatchPackingRequest,
  TManualDispatchRequest,
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
    },
  });

  return {
    simulatePacking,
    manualDispatch,
  };
};
