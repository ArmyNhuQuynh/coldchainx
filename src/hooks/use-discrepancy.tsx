import { discrepancyApi } from "@/apis/discrepancy.api";
import type { TResolveDiscrepancyRequest } from "@/schemas/discrepancy.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDiscrepancy = () => {
  const queryClient = useQueryClient();

  const getPendingDiscrepancies = () => {
    return useQuery({
      queryKey: ["discrepancies", "pending"],
      queryFn: discrepancyApi.getPendingDiscrepancies,
    });
  };

  const getDiscrepancyDetail = (lpnId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["discrepancy", lpnId],
      queryFn: () => discrepancyApi.getDiscrepancyDetail(lpnId!),
      enabled: enabled && !!lpnId,
    });
  };

  const resolveDiscrepancy = useMutation({
    mutationFn: (data: TResolveDiscrepancyRequest) =>
      discrepancyApi.resolveDiscrepancy(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discrepancies"] });
      queryClient.invalidateQueries({
        queryKey: ["discrepancy", variables.lpnId],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    getPendingDiscrepancies,
    getDiscrepancyDetail,
    resolveDiscrepancy,
    getDiscrepancyPdfUrl: discrepancyApi.getDiscrepancyPdfUrl,
  };
};
