import { z } from "zod";

export const WeightTierSchema = z.object({
  id: z.string().uuid("ID bảng giá không hợp lệ"),
  routeId: z.string().uuid("ID tuyến không hợp lệ"),
  minWeightKg: z.number({ message: "Mốc cân tối thiểu không hợp lệ" }),
  maxWeightKg: z.number().nullable().optional(),
  pricePerKg: z.number({ message: "Giá/kg không hợp lệ" }),
});

export const WeightTierListResponseSchema = z.object({
  totalRecords: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  data: z.array(WeightTierSchema),
});

export const WeightTierRequestSchema = z.object({
  routeId: z.string().uuid("ID tuyến không hợp lệ"),
  minWeightKg: z.number().min(0, "Mốc cân tối thiểu không được âm"),
  maxWeightKg: z.number().nullable().optional(),
  pricePerKg: z.number().min(0, "Giá/kg không được âm"),
});

export const WeightTierFormSchema = z
  .object({
    minWeightKg: z.number().min(0, "Mốc cân tối thiểu không được âm"),
    maxWeightKg: z.number().nullable(),
    pricePerKg: z.number().min(0, "Giá/kg không được âm"),
  })
  .superRefine((values, context) => {
    if (
      values.maxWeightKg !== null &&
      values.maxWeightKg <= values.minWeightKg
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxWeightKg"],
        message: "Mốc cân tối đa phải lớn hơn mốc tối thiểu",
      });
    }
  });

export type TWeightTier = z.infer<typeof WeightTierSchema>;
export type TWeightTierListResponse = z.infer<
  typeof WeightTierListResponseSchema
>;
export type TWeightTierRequest = z.infer<typeof WeightTierRequestSchema>;
export type TWeightTierFormValues = z.infer<typeof WeightTierFormSchema>;

export type TWeightTierListParams = {
  pageNumber: number;
  pageSize: number;
};

export const WEIGHT_TIER_FORM_DEFAULTS: TWeightTierFormValues = {
  minWeightKg: 0,
  maxWeightKg: null,
  pricePerKg: 0,
};
