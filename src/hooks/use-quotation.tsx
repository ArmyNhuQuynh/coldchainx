import { quotationApi } from "@/apis/quotation.api";
import type {
  TGetQuotationsQuery,
  TUpdateQuotation,
} from "@/schemas/quotation.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useQuotation = () => {
  const queryClient = useQueryClient();

  const getQuotations = (params: TGetQuotationsQuery = {}) => {
    const { pageNumber = 1, pageSize = 10 } = params;

    return useQuery({
      queryKey: ["quotations", { pageNumber, pageSize }],
      queryFn: () => quotationApi.getQuotations({ pageNumber, pageSize }),
      placeholderData: keepPreviousData,
    });
  };

  const getQuotationById = (quoteId?: string) => {
    return useQuery({
      queryKey: ["quotation", quoteId],
      queryFn: () => quotationApi.getQuotationById(quoteId!),
      enabled: !!quoteId,
    });
  };

  const getQuotationsByOrder = (
    orderId?: string,
    params: TGetQuotationsQuery = {},
    enabled = true
  ) => {
    const { pageNumber = 1, pageSize = 10 } = params;

    return useQuery({
      queryKey: ["order-quotations", orderId, { pageNumber, pageSize }],
      queryFn: () =>
        quotationApi.getQuotationsByOrder(orderId!, { pageNumber, pageSize }),
      enabled: enabled && !!orderId,
      placeholderData: keepPreviousData,
    });
  };

  const invalidateQuotationQueries = (quoteId: string, orderId?: string | null) => {
    queryClient.invalidateQueries({ queryKey: ["quotation", quoteId] });
    queryClient.invalidateQueries({ queryKey: ["quotations"] });

    if (orderId) {
      queryClient.invalidateQueries({ queryKey: ["order-quotations", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  };

  const updateQuotation = useMutation({
    mutationFn: ({ quoteId, data }: { quoteId: string; data: TUpdateQuotation }) =>
      quotationApi.updateQuotation(quoteId, data),
    onSuccess: (response, { quoteId }) => {
      invalidateQuotationQueries(quoteId, response.data.orderId);
    },
  });

  const sendQuotation = useMutation({
    mutationFn: (quoteId: string) => quotationApi.sendQuotation(quoteId),
    onSuccess: (response, quoteId) => {
      invalidateQuotationQueries(quoteId, response.data.orderId);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    getQuotations,
    getQuotationById,
    getQuotationsByOrder,
    updateQuotation,
    sendQuotation,
  };
};
