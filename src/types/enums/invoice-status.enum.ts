export const INVOICE_STATUS = {
  PENDING: "PENDING",
  UNPAID: "UNPAID",
  PAID: "PAID",
} as const;

export const INVOICE_STATUS_OPTIONS = [
  { label: "Chờ thanh toán", value: INVOICE_STATUS.PENDING },
  { label: "Chưa thanh toán", value: INVOICE_STATUS.UNPAID },
  { label: "Đã thanh toán", value: INVOICE_STATUS.PAID },
] as const;

export const getInvoiceStatusLabel = (status?: string | null) => {
  switch (status?.trim().toUpperCase()) {
    case INVOICE_STATUS.PENDING:
      return "Chờ thanh toán";
    case INVOICE_STATUS.UNPAID:
      return "Chưa thanh toán";
    case INVOICE_STATUS.PAID:
      return "Đã thanh toán";
    default:
      return status || "Chưa cập nhật";
  }
};

export const getInvoiceStatusClassName = (status?: string | null) => {
  switch (status?.trim().toUpperCase()) {
    case INVOICE_STATUS.PAID:
      return "border-emerald-400 text-emerald-700";
    case INVOICE_STATUS.PENDING:
    case INVOICE_STATUS.UNPAID:
      return "border-amber-400 text-amber-700";
    default:
      return "border-slate-400 text-slate-700";
  }
};
