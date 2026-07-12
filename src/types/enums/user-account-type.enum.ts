export const USER_ACCOUNT_TYPE = {
  SALES: "sales",
  WAREHOUSE: "warehouse",
} as const;

export type TUserAccountType =
  (typeof USER_ACCOUNT_TYPE)[keyof typeof USER_ACCOUNT_TYPE];

