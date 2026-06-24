import { z } from "zod";

export const PendingDiscrepancySchema = z.object({
  lpnId: z.string().uuid(),
  lpnCode: z.string(),
  orderId: z.string().uuid(),
  trackingCode: z.string(),
  customerName: z.string().nullable().optional(),
  itemName: z.string(),
  expectedWeightKg: z.number(),
  actualWeightKg: z.number(),
  expectedCbm: z.number(),
  actualCbm: z.number(),
  diffPercent: z.number(),
  discrepancyReason: z.string().nullable().optional(),
  asnId: z.string().uuid().nullable().optional(),
  asnCode: z.string().nullable().optional(),
  receiptId: z.string().uuid(),
  evidenceImageUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const DiscrepancyReceiptInfoSchema = z.object({
  receiptId: z.string().uuid(),
  receiptCode: z.string(),
  warehouseId: z.string().uuid(),
  warehouseName: z.string(),
  recordedTemperature: z.number().nullable().optional(),
  delivererName: z.string(),
  receiverName: z.string(),
  note: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const DiscrepancyDetailSchema = z.object({
  lpnId: z.string().uuid(),
  lpnCode: z.string(),
  orderId: z.string().uuid(),
  trackingCode: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  expectedWeightKg: z.number(),
  actualWeightKg: z.number(),
  expectedCbm: z.number(),
  actualCbm: z.number(),
  requiredTemperature: z.number().nullable().optional(),
  recordedTemperature: z.number().nullable().optional(),
  evidenceImageUrl: z.string().nullable().optional(),
  discrepancyReason: z.string().nullable().optional(),
  createdAt: z.string(),
  receiptInfo: DiscrepancyReceiptInfoSchema.nullable().optional(),
});

export const ResolveDiscrepancyRequestSchema = z.object({
  lpnId: z.string().uuid(),
  accept: z.boolean(),
  penaltyAmount: z.number().optional(),
  penaltyReason: z.string().optional(),
});

export const ResolveDiscrepancyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  penaltyBillId: z.string().uuid().nullable().optional(),
});

export type TPendingDiscrepancy = z.infer<typeof PendingDiscrepancySchema>;
export type TDiscrepancyReceiptInfo = z.infer<
  typeof DiscrepancyReceiptInfoSchema
>;
export type TDiscrepancyDetail = z.infer<typeof DiscrepancyDetailSchema>;
export type TResolveDiscrepancyRequest = z.infer<
  typeof ResolveDiscrepancyRequestSchema
>;
export type TResolveDiscrepancyResponse = z.infer<
  typeof ResolveDiscrepancyResponseSchema
>;

export type TDiscrepancyTableRow = TPendingDiscrepancy & {
  id: string;
  status: "DISCREPANCY_HOLD";
};
