export const CONTRACT_STATUS = {
  DRAFT: "DRAFT",
  PENDING_SIGNATURE: "PENDING_SIGNATURE",
  PENDING_CUSTOMER_SIGNATURE: "PENDING_CUSTOMER_SIGNATURE",
  PENDING_SALES_VERIFICATION: "PENDING_SALES_VERIFICATION",
  ACTIVE: "ACTIVE",
} as const;

export type TContractStatus =
  (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

export const getContractStatusLabel = (
  status: TContractStatus
): { label: string; className: string } => {
  switch (status) {
    case CONTRACT_STATUS.DRAFT:
      return {
        label: "Bản nháp",
        className: "text-yellow-600 bg-yellow-50 border border-yellow-200",
      };
    case CONTRACT_STATUS.PENDING_SIGNATURE:
      return {
        label: "Chờ gửi ký",
        className: "text-orange-600 bg-orange-50 border border-orange-200",
      };
    case CONTRACT_STATUS.PENDING_CUSTOMER_SIGNATURE:
      return {
        label: "Chờ khách hàng ký",
        className: "text-blue-600 bg-blue-50 border border-blue-200",
      };
    case CONTRACT_STATUS.PENDING_SALES_VERIFICATION:
      return {
        label: "Chờ Sale xác minh",
        className: "text-purple-600 bg-purple-50 border border-purple-200",
      };
    case CONTRACT_STATUS.ACTIVE:
      return {
        label: "Đang hiệu lực",
        className: "text-green-600 bg-green-50 border border-green-200",
      };
  }
};
