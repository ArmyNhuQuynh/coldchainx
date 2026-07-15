export const MAINTENANCE_TICKET_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

export type TMaintenanceTicketStatus =
  (typeof MAINTENANCE_TICKET_STATUS)[keyof typeof MAINTENANCE_TICKET_STATUS];

export function normalizeMaintenanceTicketStatus(
  status: string | null | undefined
): TMaintenanceTicketStatus | null {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case "OPEN":
    case "PENDING":
      return MAINTENANCE_TICKET_STATUS.OPEN;
    case "IN_PROGRESS":
    case "PROCESSING":
      return MAINTENANCE_TICKET_STATUS.IN_PROGRESS;
    case "RESOLVED":
    case "COMPLETED":
    case "DONE":
      return MAINTENANCE_TICKET_STATUS.RESOLVED;
    case "CANCELLED":
    case "CANCELED":
      return MAINTENANCE_TICKET_STATUS.CANCELLED;
    default:
      return null;
  }
}

export function getMaintenanceTicketStatusLabel(
  status: string | null | undefined
): { label: string; className: string } {
  switch (normalizeMaintenanceTicketStatus(status)) {
    case MAINTENANCE_TICKET_STATUS.OPEN:
      return {
        label: "Đang mở",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case MAINTENANCE_TICKET_STATUS.IN_PROGRESS:
      return {
        label: "Đang xử lý",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case MAINTENANCE_TICKET_STATUS.RESOLVED:
      return {
        label: "Đã hoàn tất",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case MAINTENANCE_TICKET_STATUS.CANCELLED:
      return {
        label: "Đã hủy",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    default:
      return {
        label: status ?? "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
}
