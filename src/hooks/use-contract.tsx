import { contractApi } from "@/apis/contract.api";
import type { TUpdateContractDraft } from "@/schemas/contract.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContract = () => {
  const queryClient = useQueryClient();

  const getContractById = (contractId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract", contractId],
      queryFn: () => contractApi.getContractById(contractId!),
      enabled: enabled && !!contractId,
    });
  };

  const getContractByOrderId = (orderId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-by-order", orderId],
      queryFn: () => contractApi.getContractByOrderId(orderId!),
      enabled: enabled && !!orderId,
    });
  };

  const getContractHtml = (contractId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-html", contractId],
      queryFn: () => contractApi.getContractHtml(contractId!),
      enabled: enabled && !!contractId,
    });
  };

  const previewContract = (orderId?: string, enabled = true) => {
    return useQuery({
      queryKey: ["contract-preview", orderId],
      queryFn: () => contractApi.previewContract(orderId!),
      enabled: enabled && !!orderId,
    });
  };

  const invalidateContractQueries = (
    contractId: string,
    orderId?: string | null
  ) => {
    queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
    queryClient.invalidateQueries({ queryKey: ["contract-html", contractId] });

    if (orderId) {
      queryClient.invalidateQueries({
        queryKey: ["contract-by-order", orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["contract-preview", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  };

  const updateContractDraft = useMutation({
    mutationFn: ({
      contractId,
      data,
    }: {
      contractId: string;
      data: TUpdateContractDraft;
    }) => contractApi.updateContractDraft(contractId, data),
    onSuccess: (response, { contractId }) => {
      invalidateContractQueries(contractId, response.data.orderId);
    },
  });

  const sendContract = useMutation({
    mutationFn: (contractId: string) => contractApi.sendContract(contractId),
    onSuccess: (response, contractId) => {
      invalidateContractQueries(contractId, response.data.orderId);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const verifyContract = useMutation({
    mutationFn: (contractId: string) => contractApi.verifyContract(contractId),
    onSuccess: (response, contractId) => {
      invalidateContractQueries(contractId, response.data.orderId);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    getContractById,
    getContractByOrderId,
    getContractHtml,
    previewContract,
    updateContractDraft,
    sendContract,
    verifyContract,
  };
};
