export const USER_ROLE = {
  ADMIN: "Admin",
  SALES: "Sales",
  DISPATCHER: "Dispatcher",
  ACCOUNTANT: "Accountant",
  WAREHOUSE_OPERATOR: "WarehouseOperator",
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE_OPTIONS = [
  { label: "Admin", value: USER_ROLE.ADMIN },
  { label: "Sale", value: USER_ROLE.SALES },
  { label: "Dispatcher", value: USER_ROLE.DISPATCHER },
  { label: "Kế toán", value: USER_ROLE.ACCOUNTANT },
  { label: "Nhân viên kho", value: USER_ROLE.WAREHOUSE_OPERATOR },
];

const normalizeRoleToken = (role: string) =>
  role.trim().replace(/[\s_-]/g, "").toLowerCase();

export const normalizeUserRole = (role?: string | null) => {
  if (!role) return null;

  switch (normalizeRoleToken(role)) {
    case "admin":
      return USER_ROLE.ADMIN;
    case "sale":
    case "sales":
      return USER_ROLE.SALES;
    case "dispatcher":
      return USER_ROLE.DISPATCHER;
    case "account":
    case "accountant":
      return USER_ROLE.ACCOUNTANT;
    case "warehouse":
    case "warehouseoperator":
    case "warehouseworker":
      return USER_ROLE.WAREHOUSE_OPERATOR;
    default:
      return role.trim();
  }
};

export const isWarehouseOperatorRole = (role?: string | null) =>
  normalizeUserRole(role) === USER_ROLE.WAREHOUSE_OPERATOR;

export const getUserRoleLabel = (role?: string | null) => {
  const normalized = normalizeUserRole(role);
  return (
    USER_ROLE_OPTIONS.find((option) => option.value === normalized)?.label ||
    role ||
    "Chưa có role"
  );
};

export const getUserRoleClassName = (role?: string | null) => {
  switch (normalizeUserRole(role)) {
    case USER_ROLE.ADMIN:
      return "border-red-200 bg-red-50 text-red-700";
    case USER_ROLE.SALES:
      return "border-amber-200 bg-amber-50 text-amber-700";
    case USER_ROLE.DISPATCHER:
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case USER_ROLE.ACCOUNTANT:
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case USER_ROLE.WAREHOUSE_OPERATOR:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};
