export const ORDER_STATUS = {
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  QUOTING: "QUOTING",
  CONTRACT_PENDING: "CONTRACT_PENDING",
  CONTRACT_SIGNED: "CONTRACT_SIGNED",
  IN_WAREHOUSE: "IN_WAREHOUSE",
  LOADING: "LOADING",
  DELIVERED: "DELIVERED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export function getOrderStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case ORDER_STATUS.PENDING_REVIEW:
      return {
        label: "Chờ xem xét",
        className: "text-yellow-600 bg-yellow-50 border border-yellow-200",
      };
    case ORDER_STATUS.APPROVED:
      return {
        label: "Đã duyệt",
        className: "text-blue-600 bg-blue-50 border border-blue-200",
      };
    case ORDER_STATUS.REJECTED:
      return {
        label: "Từ chối",
        className: "text-red-600 bg-red-50 border border-red-200",
      };
    case ORDER_STATUS.QUOTING:
      return {
        label: "Đang báo giá",
        className: "text-indigo-600 bg-indigo-50 border border-indigo-200",
      };
    case ORDER_STATUS.CONTRACT_PENDING:
      return {
        label: "Chờ hợp đồng",
        className: "text-orange-600 bg-orange-50 border border-orange-200",
      };
    case ORDER_STATUS.CONTRACT_SIGNED:
      return {
        label: "Đã ký hợp đồng",
        className: "text-cyan-600 bg-cyan-50 border border-cyan-200",
      };
    case ORDER_STATUS.IN_WAREHOUSE:
      return {
        label: "Trong kho",
        className: "text-violet-600 bg-violet-50 border border-violet-200",
      };
    case ORDER_STATUS.LOADING:
      return {
        label: "Đang xếp hàng",
        className: "text-sky-600 bg-sky-50 border border-sky-200",
      };
    case ORDER_STATUS.DELIVERED:
      return {
        label: "Đã giao hàng",
        className: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      };
    case ORDER_STATUS.IN_PROGRESS:
      return {
        label: "Đang vận chuyển",
        className: "text-teal-600 bg-teal-50 border border-teal-200",
      };
    case ORDER_STATUS.COMPLETED:
      return {
        label: "Hoàn thành",
        className: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      };
    case ORDER_STATUS.CANCELLED:
      return {
        label: "Đã hủy",
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };
    default:
      return {
        label: "Không xác định",
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };
  }
}
