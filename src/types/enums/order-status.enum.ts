export const ORDER_STATUS = {
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export function getOrderStatusLabel(status: TOrderStatus): {
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