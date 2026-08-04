export const CLAIM_STATUS = {
  OPEN: "OPEN",
  PENDING_REVIEW: "PENDING_REVIEW",
  PENDING_DISPATCHER_REVIEW: "PENDING_DISPATCHER_REVIEW",
  PENDING_ACCOUNTANT_REVIEW: "PENDING_ACCOUNTANT_REVIEW",
  RESOLVED_PAID: "RESOLVED_PAID",
  REJECTED: "REJECTED",
} as const;

export type TClaimStatus =
  (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

export const getClaimStatusLabel = (status?: string | null) => {
  switch (status?.trim().toUpperCase()) {
    case CLAIM_STATUS.OPEN:
      return "Mới tạo";
    case CLAIM_STATUS.PENDING_REVIEW:
    case CLAIM_STATUS.PENDING_DISPATCHER_REVIEW:
      return "Chờ điều phối duyệt";
    case CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW:
      return "Chờ kế toán giải ngân";
    case CLAIM_STATUS.RESOLVED_PAID:
      return "Đã giải ngân";
    case CLAIM_STATUS.REJECTED:
      return "Đã từ chối";
    default:
      return status || "Chưa cập nhật";
  }
};

export const getClaimStatusClassName = (status?: string | null) => {
  switch (status?.trim().toUpperCase()) {
    case CLAIM_STATUS.PENDING_REVIEW:
    case CLAIM_STATUS.PENDING_DISPATCHER_REVIEW:
      return "border-amber-400 text-amber-700";
    case CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW:
      return "border-blue-400 text-blue-700";
    case CLAIM_STATUS.RESOLVED_PAID:
      return "border-emerald-400 text-emerald-700";
    case CLAIM_STATUS.REJECTED:
      return "border-rose-400 text-rose-700";
    default:
      return "border-neutral-400 text-neutral-700";
  }
};
