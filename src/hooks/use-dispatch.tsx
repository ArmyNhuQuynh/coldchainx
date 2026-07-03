import { dispatchApi } from "@/apis/dispatch.api";
import type { TManualDispatchRequest } from "@/schemas/dispatch.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDispatchPlanning = () => {
  const queryClient = useQueryClient();

  const manualDispatch = useMutation({
    mutationFn: (data: TManualDispatchRequest) => dispatchApi.manualDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });

  return {
    manualDispatch,
  };
};
