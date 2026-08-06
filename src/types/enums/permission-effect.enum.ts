export const PERMISSION_EFFECT = {
  ALLOW: "ALLOW",
  DENY: "DENY",
} as const;

export type TPermissionEffect =
  (typeof PERMISSION_EFFECT)[keyof typeof PERMISSION_EFFECT];

export const PERMISSION_EFFECT_OPTIONS = [
  { value: PERMISSION_EFFECT.ALLOW, label: "Cho phép" },
  { value: PERMISSION_EFFECT.DENY, label: "Từ chối" },
];

export const getPermissionEffectLabel = (effect?: string | null) =>
  effect?.trim().toUpperCase() === PERMISSION_EFFECT.DENY
    ? "Từ chối"
    : "Cho phép";
