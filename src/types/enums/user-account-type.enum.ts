export const USER_ACCOUNT_TYPE = {
  STAFF: "staff",
  WAREHOUSE: "warehouse",
} as const;

export type TUserAccountType =
  (typeof USER_ACCOUNT_TYPE)[keyof typeof USER_ACCOUNT_TYPE];
