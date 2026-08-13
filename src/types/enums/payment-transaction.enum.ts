export const PAYMENT_TRANSACTION_TYPE = {
  IN: "IN",
  OUT: "OUT",
} as const;

export const PAYMENT_TRANSACTION_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING_VERIFY: "PENDING_VERIFY",
  FAILED: "FAILED",
} as const;

export const PAYMENT_METHOD = {
  CASH: "CASH",
  QR: "QR",
  PAYOS: "PAYOS",
  PAYOS_QR: "PAYOS_QR",
  PAYOS_QR_PROOF: "PAYOS_QR_PROOF",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export const getTransactionTypeLabel = (type?: string | null) =>
  type?.trim().toUpperCase() === PAYMENT_TRANSACTION_TYPE.OUT
    ? "Tiền chi"
    : "Tiền thu";

export const getTransactionStatusLabel = (status?: string | null) => {
  switch (status?.trim().toUpperCase()) {
    case PAYMENT_TRANSACTION_STATUS.COMPLETED:
      return "Hoàn tất";
    case PAYMENT_TRANSACTION_STATUS.PENDING_VERIFY:
      return "Chờ xác minh";
    case PAYMENT_TRANSACTION_STATUS.FAILED:
      return "Thất bại";
    default:
      return status || "Chưa cập nhật";
  }
};

export const getPaymentMethodLabel = (method?: string | null) => {
  switch (method?.trim().toUpperCase()) {
    case PAYMENT_METHOD.CASH:
      return "Tiền mặt";
    case PAYMENT_METHOD.QR:
    case PAYMENT_METHOD.PAYOS_QR:
    case PAYMENT_METHOD.PAYOS_QR_PROOF:
      return "QR";
    case PAYMENT_METHOD.PAYOS:
      return "PayOS";
    case PAYMENT_METHOD.BANK_TRANSFER:
      return "Chuyển khoản";
    default:
      return method || "Chưa cập nhật";
  }
};
