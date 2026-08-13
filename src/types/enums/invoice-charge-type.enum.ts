export const INVOICE_CHARGE_TYPE = {
  TRANSPORT_FEE: "TRANSPORT_FEE",
  INBOUND_MEASUREMENT_ADJUSTMENT: "INBOUND_MEASUREMENT_ADJUSTMENT",
  COLD_CHAIN_FREIGHT_AND_COD: "COLD_CHAIN_FREIGHT_AND_COD",
} as const;

export const getInvoiceChargeTypeLabel = (chargeType?: string | null) => {
  switch (chargeType?.trim().toUpperCase()) {
    case INVOICE_CHARGE_TYPE.TRANSPORT_FEE:
      return "Phí vận chuyển";
    case INVOICE_CHARGE_TYPE.INBOUND_MEASUREMENT_ADJUSTMENT:
      return "Điều chỉnh phí theo số đo nhập kho";
    case INVOICE_CHARGE_TYPE.COLD_CHAIN_FREIGHT_AND_COD:
      return "Cước vận chuyển lạnh và thu hộ";
    default:
      return "Khoản phí khác";
  }
};
