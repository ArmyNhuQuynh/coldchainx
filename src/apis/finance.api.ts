import { apiRequest } from "@/lib/http";
import type {
  TFinancialExportParams,
  TFinancialSummary,
  TFinancialSummaryParams,
  TInvoice,
  TInvoiceListParams,
  TInvoicePage,
  TPaymentTransactionListParams,
  TPaymentTransactionPage,
} from "@/schemas/finance.schema";
import type { BaseResponse } from "@/types/response.type";

const INVOICES_URL = "/v1/invoices";
const TRANSACTIONS_URL = "/payments/transactions";
const REPORTS_URL = "/v1/financial-reports";

const withInclusiveEndDate = <T extends { toDate?: string }>(params: T): T => ({
  ...params,
  toDate:
    params.toDate && /^\d{4}-\d{2}-\d{2}$/.test(params.toDate)
      ? `${params.toDate}T23:59:59.999`
      : params.toDate,
});

const getInvoices = async (
  params: TInvoiceListParams = {}
): Promise<TInvoicePage> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TInvoicePage>>(
    INVOICES_URL,
    { params }
  );
  return response.data.data;
};

const getInvoice = async (invoiceId: string): Promise<TInvoice> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TInvoice>>(
    `${INVOICES_URL}/${invoiceId}`
  );
  return response.data.data;
};

const getInvoicesByOrder = async (orderId: string): Promise<TInvoice[]> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TInvoice[]>>(
    `/v1/orders/${orderId}/invoices`
  );
  return response.data.data;
};

const getPaymentTransactions = async (
  params: TPaymentTransactionListParams = {}
): Promise<TPaymentTransactionPage> => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TPaymentTransactionPage>
  >(TRANSACTIONS_URL, { params: withInclusiveEndDate(params) });
  return response.data.data;
};

const getFinancialSummary = async (
  params: TFinancialSummaryParams = {}
): Promise<TFinancialSummary> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TFinancialSummary>>(
    `${REPORTS_URL}/summary`,
    { params: withInclusiveEndDate(params) }
  );
  return response.data.data;
};

const getDownloadFilename = (
  disposition: string | undefined,
  fallbackName: string
) => {
  const encoded = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) return decodeURIComponent(encoded);

  const plain = disposition?.match(/filename="?([^";]+)"?/i)?.[1];
  return plain || fallbackName;
};

const downloadCsv = async (
  endpoint: string,
  params: TFinancialExportParams,
  fallbackName: string
) => {
  const response = await apiRequest.baseApi.get<Blob>(endpoint, {
    params: withInclusiveEndDate(params),
    responseType: "blob",
  });
  const filename = getDownloadFilename(
    response.headers["content-disposition"],
    fallbackName
  );
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const exportVatInvoices = (params: TFinancialExportParams) =>
  downloadCsv(
    `${REPORTS_URL}/vat-invoices/export`,
    params,
    "bang-ke-hoa-don-vat.csv"
  );

const exportCodSettlement = (params: TFinancialExportParams) =>
  downloadCsv(
    `${REPORTS_URL}/cod-settlement/export`,
    params,
    "bang-ke-doi-soat-cod.csv"
  );

const exportClaimsExpenses = (params: TFinancialExportParams) =>
  downloadCsv(
    `${REPORTS_URL}/claims-expenses/export`,
    params,
    "bang-ke-chi-phi-boi-thuong.csv"
  );

export const financeApi = {
  getInvoices,
  getInvoice,
  getInvoicesByOrder,
  getPaymentTransactions,
  getFinancialSummary,
  exportVatInvoices,
  exportCodSettlement,
  exportClaimsExpenses,
};
