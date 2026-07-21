export const ORDER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING_REVIEW: "PENDING_REVIEW",
  NEEDS_UPDATE: "NEEDS_UPDATE",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  QUOTING: "QUOTING",
  CONTRACT_PENDING: "CONTRACT_PENDING",
  CONTRACT_SIGNED: "CONTRACT_SIGNED",
  RECEIVING: "RECEIVING",
  IN_WAREHOUSE: "IN_WAREHOUSE",
  IN_STOCK: "IN_STOCK",
  DISCREPANCY_HOLD: "DISCREPANCY_HOLD",
  RETURN_PENDING: "RETURN_PENDING",
  LOADING: "LOADING",
  SEALED: "SEALED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  RETURNED: "RETURNED",
  PARTIALLY_DELIVERED: "PARTIALLY_DELIVERED",
} as const;

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

const normalizeOrderStatus = (status: string) => status.trim().toUpperCase();

export function getOrderStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (normalizeOrderStatus(status)) {
    case ORDER_STATUS.PENDING_REVIEW:
      return {
        label: "Chờ xem xét",
        className: "border-yellow-400 text-yellow-700 bg-transparent",
      };
    case ORDER_STATUS.NEEDS_UPDATE:
      return {
        label: "Cần khách cập nhật",
        className: "border-amber-400 text-amber-700 bg-transparent",
      };
    case ORDER_STATUS.APPROVED:
      return {
        label: "Đã duyệt",
        className: "border-blue-400 text-blue-700 bg-transparent",
      };
    case ORDER_STATUS.REJECTED:
      return {
        label: "Từ chối",
        className: "border-red-400 text-red-700 bg-transparent",
      };
    case ORDER_STATUS.QUOTING:
      return {
        label: "Đang báo giá",
        className: "border-indigo-400 text-indigo-700 bg-transparent",
      };
    case ORDER_STATUS.CONTRACT_PENDING:
      return {
        label: "Chờ hợp đồng",
        className: "border-orange-400 text-orange-700 bg-transparent",
      };
    case ORDER_STATUS.CONTRACT_SIGNED:
      return {
        label: "Đã ký hợp đồng",
        className: "border-cyan-400 text-cyan-700 bg-transparent",
      };
    case ORDER_STATUS.RECEIVING:
      return {
        label: "Đang nhập kho",
        className: "border-sky-400 text-sky-700 bg-transparent",
      };
    case ORDER_STATUS.IN_WAREHOUSE:
      return {
        label: "Trong kho",
        className: "border-violet-400 text-violet-700 bg-transparent",
      };
    case ORDER_STATUS.IN_STOCK:
      return {
        label: "Đã nhập kho",
        className: "border-violet-400 text-violet-700 bg-transparent",
      };
    case ORDER_STATUS.DISCREPANCY_HOLD:
      return {
        label: "Giữ do sai lệch QC",
        className: "border-rose-400 text-rose-700 bg-transparent",
      };
    case ORDER_STATUS.RETURN_PENDING:
      return {
        label: "Chờ hoàn trả",
        className: "border-orange-400 text-orange-700 bg-transparent",
      };
    case ORDER_STATUS.LOADING:
      return {
        label: "Đang xếp hàng",
        className: "border-sky-400 text-sky-700 bg-transparent",
      };
    case ORDER_STATUS.SEALED:
      return {
        label: "Đã niêm phong",
        className: "border-blue-400 text-blue-700 bg-transparent",
      };
    case ORDER_STATUS.SHIPPING:
      return {
        label: "Đang giao hàng",
        className: "border-teal-400 text-teal-700 bg-transparent",
      };
    case ORDER_STATUS.DELIVERED:
      return {
        label: "Đã giao hàng",
        className: "border-emerald-400 text-emerald-700 bg-transparent",
      };
    case ORDER_STATUS.RETURNED:
      return {
        label: "Đã hoàn trả",
        className: "border-neutral-400 text-neutral-700 bg-transparent",
      };
    case ORDER_STATUS.PARTIALLY_DELIVERED:
      return {
        label: "Giao một phần",
        className: "border-amber-400 text-amber-700 bg-transparent",
      };
    case ORDER_STATUS.ACTIVE:
      return {
        label: "Đang hoạt động",
        className: "border-green-400 text-green-700 bg-transparent",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-neutral-400 text-neutral-700 bg-transparent",
      };
  }
}

export const ORDER_STATUS_FILTER_OPTIONS = [
  { label: "Tất cả trạng thái", value: "ALL" },
  ...Object.values(ORDER_STATUS).map((status) => ({
    label: getOrderStatusLabel(status).label,
    value: status,
  })),
];
