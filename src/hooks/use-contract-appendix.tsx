import { contractAppendixApi } from "@/apis/contract-appendix.api";
import type { TUpdateAppendixDraft } from "@/schemas/contract-appendix.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContractAppendix = () => {
  const queryClient = useQueryClient();

  const getAppendixByOrderId = (orderId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-appendix-by-order", orderId],
      queryFn: () => contractAppendixApi.getAppendixByOrderId(orderId!),
      enabled: enabled && !!orderId,
      retry: false,
    });
  };

  const getAppendixById = (appendixId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-appendix", appendixId],
      queryFn: () => contractAppendixApi.getAppendixById(appendixId!),
      enabled: enabled && !!appendixId,
    });
  };

  const getAppendixHtml = (appendixId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-appendix-html", appendixId],
      queryFn: () => contractAppendixApi.getAppendixHtml(appendixId!),
      enabled: enabled && !!appendixId,
    });
  };

  const invalidateAppendixQueries = (
    appendixId: string,
    orderId?: string | null
  ) => {
    queryClient.invalidateQueries({
      queryKey: ["contract-appendix", appendixId],
    });
    queryClient.invalidateQueries({
      queryKey: ["contract-appendix-html", appendixId],
    });

    if (orderId) {
      queryClient.invalidateQueries({
        queryKey: ["contract-appendix-by-order", orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  };

  const updateAppendixDraft = useMutation({
    mutationFn: ({
      appendixId,
      data,
    }: {
      appendixId: string;
      data: TUpdateAppendixDraft;
    }) => contractAppendixApi.updateAppendixDraft(appendixId, data),
    onSuccess: (response, { appendixId }) => {
      invalidateAppendixQueries(appendixId, response.data.orderId);
    },
  });

  const sendAppendix = useMutation({
    mutationFn: (appendixId: string) =>
      contractAppendixApi.sendAppendix(appendixId),
    onSuccess: (response, appendixId) => {
      invalidateAppendixQueries(appendixId, response.data.orderId);
    },
  });

  const executeAppendix = useMutation({
    mutationFn: (appendixId: string) =>
      contractAppendixApi.executeAppendix(appendixId),
    onSuccess: (response, appendixId) => {
      invalidateAppendixQueries(appendixId, response.data.orderId);
      queryClient.invalidateQueries({ queryKey: ["discrepancies"] });
    },
  });

  return {
    getAppendixByOrderId,
    getAppendixById,
    getAppendixHtml,
    updateAppendixDraft,
    sendAppendix,
    executeAppendix,
  };
};
