import { z } from "zod";
import { APPENDIX_STATUS } from "@/types/enums/appendix-status.enum";

export const AppendixStatusSchema = z.union([
  z.literal(APPENDIX_STATUS.DRAFT),
  z.literal(APPENDIX_STATUS.SENT),
  z.literal(APPENDIX_STATUS.ACCEPTED),
  z.literal(APPENDIX_STATUS.REJECTED),
  z.literal(APPENDIX_STATUS.EXECUTED),
]);

export const PenaltyBillSchema = z.object({
  penaltyBillId: z.string().uuid(),
  billCode: z.string(),
  lpnId: z.string().uuid(),
  orderId: z.string().uuid(),
  handlingFee: z.number(),
  storageFee: z.number(),
  totalAmount: z.number(),
  reason: z.string(),
  isPaid: z.boolean(),
  createdAt: z.string(),
  paidAt: z.string().nullable().optional(),
});

export const InboundReturnSlipSchema = z.object({
  returnSlipId: z.string().uuid(),
  orderId: z.string().uuid(),
  lpnId: z.string().uuid(),
  slipCode: z.string(),
  returnedWeightKg: z.number(),
  returnedCbm: z.number(),
  returnedQty: z.number(),
  reason: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const ContractAppendixSchema = z.object({
  appendixId: z.string().uuid(),
  contractId: z.string().uuid().nullable().optional(),
  orderId: z.string().uuid(),
  appendixNumber: z.string(),
  adjustedPrice: z.number(),
  reason: z.string().nullable().optional(),
  status: AppendixStatusSchema.or(z.string()),
  draftHtmlContent: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  sentAt: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),
  penaltyBill: PenaltyBillSchema.nullable().optional(),
  returnSlip: InboundReturnSlipSchema.nullable().optional(),
});

export const UpdateAppendixDraftSchema = z.object({
  editedHtmlContent: z
    .string()
    .min(1, { message: "Nội dung phụ lục không được để trống" })
    .refine((value) => value.trimStart().startsWith("<"), {
      message: "Nội dung phụ lục phải là HTML hợp lệ",
    }),
});

export type TPenaltyBill = z.infer<typeof PenaltyBillSchema>;
export type TInboundReturnSlip = z.infer<typeof InboundReturnSlipSchema>;
export type TContractAppendix = z.infer<typeof ContractAppendixSchema>;
export type TUpdateAppendixDraft = z.infer<typeof UpdateAppendixDraftSchema>;
