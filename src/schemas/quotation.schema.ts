import { z } from "zod";
import { QUOTATION_STATUS } from "@/types/enums/quotation-status.enum";

export interface TGetQuotationsQuery {
  pageNumber?: number;
  pageSize?: number;
}

export const QuotationStatusSchema = z.union([
  z.literal(QUOTATION_STATUS.DRAFT),
  z.literal(QUOTATION_STATUS.SENT),
  z.literal(QUOTATION_STATUS.ACCEPTED),
]);

export const QuotationAdditionalChargeSchema = z.object({
  name: z.string().min(1, { message: "Tên phụ phí không được để trống" }),
  amount: z.number().min(0, { message: "Phụ phí không được là số âm" }),
  note: z.string().nullable(),
});

export const QuotationSchema = z.object({
  quoteId: z.string().uuid({ message: "ID báo giá không hợp lệ" }),
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }).nullable(),
  trackingCode: z.string().nullable(),
  customerId: z.string().uuid({ message: "ID khách hàng không hợp lệ" }).nullable(),
  customerName: z.string().nullable(),
  baseFreight: z.number(),
  lastMileSurcharge: z.number().nullable(),
  additionalCharges: z.array(QuotationAdditionalChargeSchema),
  additionalChargesTotal: z.number(),
  vatPercentage: z.number().nullable(),
  vatAmount: z.number(),
  finalAmount: z.number(),
  chargeableWeightKg: z.number().nullable(),
  volumetricWeightKg: z.number().nullable(),
  pricePerKg: z.number().nullable(),
  distanceKm: z.number().nullable(),
  systemBaseFreight: z.number().nullable(),
  manualAdjustment: z.number().nullable(),
  overrideReason: z.string().nullable(),
  pricingSource: z.string(),
  fileUrl: z.string().nullable(),
  status: QuotationStatusSchema,
  createdAt: z.string().nullable(),
});

export const UpdateQuotationAdditionalChargeSchema = z.object({
  name: z.string().min(1, { message: "Tên phụ phí không được để trống" }),
  amount: z.number().min(0, { message: "Phụ phí không được là số âm" }),
  note: z.string().nullable().optional(),
});

export const UpdateQuotationSchema = z.object({
  baseFreight: z.number().min(0, { message: "Cước cơ bản không được là số âm" }).nullable().optional(),
  lastMileSurcharge: z.number().min(0, { message: "Phụ phí chặng cuối không được là số âm" }).nullable().optional(),
  vatPercentage: z.number().min(0).max(20, { message: "VAT phải nằm trong khoảng 0 đến 20" }).nullable().optional(),
  additionalCharges: z.array(UpdateQuotationAdditionalChargeSchema).nullable().optional(),
  overrideReason: z.string().nullable().optional(),
});

export const QuotationFormAdditionalChargeSchema = z.object({
  name: z.string().min(1, { message: "Tên phụ phí không được để trống" }),
  amount: z.number().min(0, { message: "Phụ phí không được là số âm" }),
  note: z.string(),
});

export const QuotationFormSchema = z.object({
  baseFreight: z.number().min(0, { message: "Cước cơ bản không được là số âm" }),
  lastMileSurcharge: z.number().min(0, { message: "Phụ phí chặng cuối không được là số âm" }).nullable(),
  vatPercentage: z.number().min(0).max(20, { message: "VAT phải nằm trong khoảng 0 đến 20" }),
  additionalCharges: z.array(QuotationFormAdditionalChargeSchema),
  overrideReason: z.string(),
});

export const QuotationListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    totalRecords: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    data: z.array(QuotationSchema),
  }),
});

export type TQuotation = z.infer<typeof QuotationSchema>;
export type TQuotationAdditionalCharge = z.infer<typeof QuotationAdditionalChargeSchema>;
export type TUpdateQuotation = z.infer<typeof UpdateQuotationSchema>;
export type TUpdateQuotationAdditionalCharge = z.infer<
  typeof UpdateQuotationAdditionalChargeSchema
>;
export type TQuotationFormValues = z.infer<typeof QuotationFormSchema>;
export type TQuotationListResponse = z.infer<typeof QuotationListResponseSchema>;
