import { financeApi } from "@/apis/finance.api";
import type {
  TFinancialExportParams,
  TFinancialSummaryParams,
  TInvoiceListParams,
  TPaymentTransactionListParams,
} from "@/schemas/finance.schema";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const financeQueryKeys = {
  root: ["finance"] as const,
  invoices: (params: TInvoiceListParams) =>
    [...financeQueryKeys.root, "invoices", params] as const,
  invoice: (invoiceId: string) =>
    [...financeQueryKeys.root, "invoice", invoiceId] as const,
  orderInvoices: (orderId: string) =>
    [...financeQueryKeys.root, "order-invoices", orderId] as const,
  transactions: (params: TPaymentTransactionListParams) =>
    [...financeQueryKeys.root, "transactions", params] as const,
  summary: (params: TFinancialSummaryParams) =>
    [...financeQueryKeys.root, "summary", params] as const,
};

export const useFinance = () => {
  const getInvoices = (params: TInvoiceListParams, enabled = true) =>
    useQuery({
      queryKey: financeQueryKeys.invoices(params),
      queryFn: () => financeApi.getInvoices(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  const getInvoice = (invoiceId?: string) =>
    useQuery({
      queryKey: financeQueryKeys.invoice(invoiceId ?? ""),
      queryFn: () => financeApi.getInvoice(invoiceId!),
      enabled: Boolean(invoiceId),
    });

  const getInvoicesByOrder = (orderId?: string) =>
    useQuery({
      queryKey: financeQueryKeys.orderInvoices(orderId ?? ""),
      queryFn: () => financeApi.getInvoicesByOrder(orderId!),
      enabled: Boolean(orderId),
    });

  const getPaymentTransactions = (
    params: TPaymentTransactionListParams,
    enabled = true
  ) =>
    useQuery({
      queryKey: financeQueryKeys.transactions(params),
      queryFn: () => financeApi.getPaymentTransactions(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  const getFinancialSummary = (
    params: TFinancialSummaryParams,
    enabled = true
  ) =>
    useQuery({
      queryKey: financeQueryKeys.summary(params),
      queryFn: () => financeApi.getFinancialSummary(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  const exportVatInvoices = useMutation({
    mutationFn: (params: TFinancialExportParams) =>
      financeApi.exportVatInvoices(params),
  });

  const exportCodSettlement = useMutation({
    mutationFn: (params: TFinancialExportParams) =>
      financeApi.exportCodSettlement(params),
  });

  const exportClaimsExpenses = useMutation({
    mutationFn: (params: TFinancialExportParams) =>
      financeApi.exportClaimsExpenses(params),
  });

  return {
    getInvoices,
    getInvoice,
    getInvoicesByOrder,
    getPaymentTransactions,
    getFinancialSummary,
    exportVatInvoices,
    exportCodSettlement,
    exportClaimsExpenses,
  };
};
