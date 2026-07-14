import type {
  TWeightTier,
  TWeightTierFormValues,
} from "@/schemas/weight-tier.schema";

export type WeightTierFormState = {
  minWeightKg: string;
  maxWeightKg: string;
  pricePerKg: string;
};

export type WeightTierFormErrors = Partial<
  Record<keyof WeightTierFormState, string>
>;

export const EMPTY_WEIGHT_TIER_FORM: WeightTierFormState = {
  minWeightKg: "0",
  maxWeightKg: "",
  pricePerKg: "0",
};

export const formatKg = (value: number) =>
  `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} kg`;

export const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export const formatWeightTierRange = (tier: TWeightTier) => {
  if (tier.maxWeightKg === null || tier.maxWeightKg === undefined) {
    return `Từ ${formatKg(tier.minWeightKg)}`;
  }

  return `${formatKg(tier.minWeightKg)} - ${formatKg(tier.maxWeightKg)}`;
};

export const getCoverageNotes = (tiers: TWeightTier[]) => {
  if (tiers.length === 0) {
    return ["Tuyến này chưa có bảng giá. Báo giá tự động có thể không tạo được."];
  }

  const notes: string[] = [];
  const firstTier = tiers[0];

  if (firstTier.minWeightKg > 0) {
    notes.push(`Thiếu giá cho khoảng 0 - ${formatKg(firstTier.minWeightKg)}.`);
  }

  for (let index = 1; index < tiers.length; index += 1) {
    const previous = tiers[index - 1];
    const current = tiers[index];

    if (previous.maxWeightKg === null || previous.maxWeightKg === undefined) {
      break;
    }

    if (current.minWeightKg > previous.maxWeightKg) {
      notes.push(
        `Thiếu giá cho khoảng ${formatKg(previous.maxWeightKg)} - ${formatKg(
          current.minWeightKg
        )}.`
      );
    }
  }

  const lastTier = tiers[tiers.length - 1];
  if (lastTier.maxWeightKg !== null && lastTier.maxWeightKg !== undefined) {
    notes.push(`Chưa có mức giá cho hàng trên ${formatKg(lastTier.maxWeightKg)}.`);
  }

  return notes;
};

export const toWeightTierFormState = (
  tier?: TWeightTier | null
): WeightTierFormState => ({
  minWeightKg: String(
    tier?.minWeightKg ?? EMPTY_WEIGHT_TIER_FORM.minWeightKg
  ),
  maxWeightKg:
    tier?.maxWeightKg === null || tier?.maxWeightKg === undefined
      ? ""
      : String(tier.maxWeightKg),
  pricePerKg: String(tier?.pricePerKg ?? EMPTY_WEIGHT_TIER_FORM.pricePerKg),
});

export const parseWeightTierForm = (
  values: WeightTierFormState
): TWeightTierFormValues => ({
  minWeightKg: parseRequiredNumber(values.minWeightKg),
  maxWeightKg:
    values.maxWeightKg.trim() === "" ? null : Number(values.maxWeightKg),
  pricePerKg: parseRequiredNumber(values.pricePerKg),
});

export const collectWeightTierFormErrors = (
  issues: Array<{ path: PropertyKey[]; message: string }>
): WeightTierFormErrors =>
  issues.reduce<WeightTierFormErrors>((result, issue) => {
    const key = issue.path[0] as keyof WeightTierFormState | undefined;
    if (key && !result[key]) {
      result[key] = issue.message;
    }
    return result;
  }, {});

const parseRequiredNumber = (value: string) =>
  value.trim() === "" ? Number.NaN : Number(value);
