export type TInvoiceLine = {
  lineId: string;
  invoiceId: string;
  orderId: string;
  chargeType: string;
  description: string;
  quantity?: number | null;
  unitPrice: number;
  amount: number;
  taxRate?: number | null;
};

export type TInvoice = {
  invoiceId: string;
  invoiceCode: string;
  customerId: string;
  vatInvoiceNo?: string | null;
  pdfUrl?: string | null;
  subTotal: number;
  taxRate?: number | null;
  taxAmount: number;
  deductionAmount?: number | null;
  grandTotal: number;
  paidAmount?: number | null;
  issuedDate: string;
  dueDate: string;
  status?: string | null;
  createdAt?: string | null;
  invoiceLines: TInvoiceLine[];
};

export type TInvoicePage = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: TInvoice[];
};

export type TInvoiceListParams = {
  status?: string;
  customerId?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TPaymentTransactionSummary = {
  totalTransactionsCount: number;
  totalCodReceived: number;
  totalClaimOutflow: number;
  netCashFlow: number;
  timestamp: string;
};

export type TPaymentTransaction = {
  transactionId: string;
  transactionCode: string;
  orderId?: string | null;
  trackingCode?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  invoiceId?: string | null;
  claimId?: string | null;
  transactionType: string;
  amount: number;
  paymentMethod: string;
  referenceCode?: string | null;
  evidenceImageUrl?: string | null;
  status: string;
  note?: string | null;
  createdAt: string;
  completedAt?: string | null;
};

export type TPaymentTransactionPage = {
  summary: TPaymentTransactionSummary;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  transactions: TPaymentTransaction[];
};

export type TPaymentTransactionListParams = {
  status?: string;
  transactionType?: string;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TFinancialSummary = {
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  totalTaxVat: number;
  totalCodCollected: number;
  totalClaimPayout: number;
  totalDriverReimbursement: number;
  netOperatingCashFlow: number;
  totalInvoicesCount: number;
  paidInvoicesCount: number;
  unpaidInvoicesCount: number;
  totalClaimsCount: number;
  totalIncidentsCount: number;
};

export type TFinancialSummaryParams = {
  fromDate?: string;
  toDate?: string;
};

export type TFinancialExportParams = TFinancialSummaryParams & {
  status?: string;
  driverId?: string;
};
