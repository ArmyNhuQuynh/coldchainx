export const DRIVER_STATUS = {
  ACTIVE: "ACTIVE",
  PLANNING: "PLANNING",
  ON_TRIP: "ON_TRIP",
  RELAX: "RELAX",
  SUSPENDED_DOCS: "SUSPENDED_DOCS",
  INACTIVE: "INACTIVE",
} as const;

export type TDriverStatus =
  (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export function normalizeDriverStatus(
  status: string | number | null | undefined
): TDriverStatus | null {
  if (status == null || status === "") return null;

  const normalized = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "_");

  switch (normalized) {
    case "ACTIVE":
    case "AVAILABLE":
    case "0":
      return DRIVER_STATUS.ACTIVE;
    case "PLANNING":
    case "1":
      return DRIVER_STATUS.PLANNING;
    case "ON_TRIP":
    case "ONTRIP":
    case "2":
      return DRIVER_STATUS.ON_TRIP;
    case "RELAX":
    case "5":
      return DRIVER_STATUS.RELAX;
    case "SUSPENDED_DOCS":
      return DRIVER_STATUS.SUSPENDED_DOCS;
    case "INACTIVE":
    case "OFFLINE":
    case "3":
    case "4":
      return DRIVER_STATUS.INACTIVE;
    default:
      return null;
  }
}

export function getDriverStatusLabel(
  status: string | number | null | undefined
): { label: string; className: string } {
  switch (normalizeDriverStatus(status)) {
    case DRIVER_STATUS.ACTIVE:
      return {
        label: "Sẵn sàng",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case DRIVER_STATUS.PLANNING:
      return {
        label: "Đã xếp lịch",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case DRIVER_STATUS.ON_TRIP:
      return {
        label: "Đang vận chuyển",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case DRIVER_STATUS.RELAX:
      return {
        label: "Đang nghỉ",
        className: "border-violet-200 bg-violet-50 text-violet-700",
      };
    case DRIVER_STATUS.SUSPENDED_DOCS:
      return {
        label: "GPLX thiếu hoặc hết hạn",
        className: "border-orange-200 bg-orange-50 text-orange-700",
      };
    case DRIVER_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
}

export const DRIVER_MANUAL_STATUS_OPTIONS = [
  DRIVER_STATUS.ACTIVE,
  DRIVER_STATUS.INACTIVE,
].map((value) => ({
  value,
  label: getDriverStatusLabel(value).label,
}));

export const isDriverStatusManuallyEditable = (
  status: string | number | null | undefined
) => {
  const normalized = normalizeDriverStatus(status);
  return (
    normalized === DRIVER_STATUS.ACTIVE ||
    normalized === DRIVER_STATUS.INACTIVE
  );
};
