import { z } from "zod";
import { CONTRACT_STATUS } from "@/types/enums/contract-status.enum";

export const ContractStatusSchema = z.union([
  z.literal(CONTRACT_STATUS.DRAFT),
  z.literal(CONTRACT_STATUS.PENDING_SIGNATURE),
  z.literal(CONTRACT_STATUS.PENDING_CUSTOMER_SIGNATURE),
  z.literal(CONTRACT_STATUS.PENDING_SALES_VERIFICATION),
  z.literal(CONTRACT_STATUS.ACTIVE),
]);

export const ContractInfoSchema = z.object({
  contractId: z.string().uuid({ message: "ID hợp đồng không hợp lệ" }),
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  contractNumber: z.string({ message: "Số hợp đồng không hợp lệ" }),
  fileUrl: z.string().nullable(),
  signedFileUrl: z.string().nullable(),
  sentAt: z.string().nullable(),
  uploadedSignedAt: z.string().nullable(),
  verifiedAt: z.string().nullable(),
  status: ContractStatusSchema,
});

export const ContractDraftSchema = ContractInfoSchema.extend({
  fileUrl: z.string(),
  draftHtmlContent: z.string().nullable(),
});

export const UpdateContractDraftSchema = z.object({
  editedHtmlContent: z
    .string()
    .min(1, { message: "Nội dung hợp đồng không được để trống" })
    .refine((value) => value.trimStart().startsWith("<"), {
      message: "Nội dung hợp đồng phải là HTML hợp lệ",
    }),
});

export type TContractInfo = z.infer<typeof ContractInfoSchema>;
export type TContractDraft = z.infer<typeof ContractDraftSchema>;
export type TUpdateContractDraft = z.infer<typeof UpdateContractDraftSchema>;
