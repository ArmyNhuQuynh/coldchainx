export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const USER_STATUS_REQUEST = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type TUserStatusRequest =
  (typeof USER_STATUS_REQUEST)[keyof typeof USER_STATUS_REQUEST];

export const normalizeUserStatus = (
  status?: string | number | null
): TUserStatus | null => {
  if (status == null || status === "") return null;

  const normalized = String(status).trim().toUpperCase();

  switch (normalized) {
    case "ACTIVE":
    case "0":
      return USER_STATUS.ACTIVE;
    case "INACTIVE":
    case "1":
      return USER_STATUS.INACTIVE;
    default:
      return null;
  }
};

export const toUserStatusRequest = (status?: string | number | null) =>
  normalizeUserStatus(status) === USER_STATUS.INACTIVE
    ? USER_STATUS_REQUEST.INACTIVE
    : USER_STATUS_REQUEST.ACTIVE;

export const getUserStatusLabel = (status?: string | number | null) => {
  switch (normalizeUserStatus(status)) {
    case USER_STATUS.ACTIVE:
      return {
        label: "Hoạt động",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case USER_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-50 text-slate-700",
      };
    default:
      return {
        label: status ? String(status) : "Không xác định",
        className: "border-orange-200 bg-orange-50 text-orange-700",
      };
  }
};

export const USER_STATUS_OPTIONS = [
  { label: getUserStatusLabel(USER_STATUS.ACTIVE).label, value: USER_STATUS_REQUEST.ACTIVE },
  {
    label: getUserStatusLabel(USER_STATUS.INACTIVE).label,
    value: USER_STATUS_REQUEST.INACTIVE,
  },
];

