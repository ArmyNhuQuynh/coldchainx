export const INCIDENT_EXPENSE_STATUS = {
  NOT_REQUESTED: "NOT_REQUESTED",
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REIMBURSED: "REIMBURSED",
} as const;

export type TIncidentExpenseStatus =
  (typeof INCIDENT_EXPENSE_STATUS)[keyof typeof INCIDENT_EXPENSE_STATUS];

export const normalizeIncidentExpenseStatus = (
  status?: string | null
): TIncidentExpenseStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case INCIDENT_EXPENSE_STATUS.NOT_REQUESTED:
      return INCIDENT_EXPENSE_STATUS.NOT_REQUESTED;
    case INCIDENT_EXPENSE_STATUS.PENDING_REVIEW:
      return INCIDENT_EXPENSE_STATUS.PENDING_REVIEW;
    case INCIDENT_EXPENSE_STATUS.APPROVED:
      return INCIDENT_EXPENSE_STATUS.APPROVED;
    case INCIDENT_EXPENSE_STATUS.REJECTED:
      return INCIDENT_EXPENSE_STATUS.REJECTED;
    case INCIDENT_EXPENSE_STATUS.REIMBURSED:
      return INCIDENT_EXPENSE_STATUS.REIMBURSED;
    default:
      return null;
  }
};

export const getIncidentExpenseStatusLabel = (status?: string | null) => {
  switch (normalizeIncidentExpenseStatus(status)) {
    case INCIDENT_EXPENSE_STATUS.NOT_REQUESTED:
      return {
        label: "Không yêu cầu",
        className: "border-muted-foreground/40 bg-transparent text-muted-foreground",
      };
    case INCIDENT_EXPENSE_STATUS.PENDING_REVIEW:
      return {
        label: "Chờ duyệt",
        className: "border-amber-500 bg-transparent text-amber-700",
      };
    case INCIDENT_EXPENSE_STATUS.APPROVED:
      return {
        label: "Đã duyệt",
        className: "border-blue-500 bg-transparent text-blue-700",
      };
    case INCIDENT_EXPENSE_STATUS.REJECTED:
      return {
        label: "Đã từ chối",
        className: "border-rose-500 bg-transparent text-rose-700",
      };
    case INCIDENT_EXPENSE_STATUS.REIMBURSED:
      return {
        label: "Đã hoàn tiền",
        className: "border-emerald-500 bg-transparent text-emerald-700",
      };
    default:
      return {
        label: status || "Không xác định",
        className: "border-muted-foreground/40 bg-transparent text-muted-foreground",
      };
  }
};
