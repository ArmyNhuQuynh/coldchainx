export const QUOTATION_STATUS = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  ACCEPTED: "ACCEPTED",
} as const;

export type TQuotationStatus =
  (typeof QUOTATION_STATUS)[keyof typeof QUOTATION_STATUS];

export const getQuotationStatusLabel = (
  status: TQuotationStatus
): { label: string; className: string } => {
  switch (status) {
    case QUOTATION_STATUS.DRAFT:
      return {
        label: "Bản nháp",
        className: "text-yellow-600 bg-yellow-50 border border-yellow-200",
      };
    case QUOTATION_STATUS.SENT:
      return {
        label: "Đã gửi",
        className: "text-blue-600 bg-blue-50 border border-blue-200",
      };
    case QUOTATION_STATUS.ACCEPTED:
      return {
        label: "Đã chấp nhận",
        className: "text-green-600 bg-green-50 border border-green-200",
      };
  }
};
