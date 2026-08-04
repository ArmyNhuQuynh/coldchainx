import { z } from "zod";

export type TClaimEvidence = {
  evidenceId: string;
  evidenceType: string;
  imageUrl?: string | null;
  uploadedBy?: string;
  uploadedByUsername?: string;
  createdAt?: string | null;
  uploadedAt?: string | null;
};

export type TClaim = {
  claimId: string;
  claimCode: string;
  orderId?: string | null;
  orderTrackingCode?: string | null;
  claimType: string;
  description: string;
  faultOwner?: string | null;
  status?: string | null;
  resolutionNote?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
  evidences: TClaimEvidence[];
};

export type TClaimPage = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: TClaim[];
};

export type TClaimListParams = {
  orderId?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TClaimInvestigation = {
  claimId: string;
  claimCode: string;
  orderId?: string | null;
  trackingCode?: string | null;
  customerCompanyName?: string | null;
  claimType: string;
  description: string;
  status?: string | null;
  faultOwner?: string | null;
  resolutionNote?: string | null;
  internalChargebackOption?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
  evidencePhotos: TClaimEvidence[];
  iotTemperatureAnalysis?: {
    status?: string | null;
    sensorDeviceId?: string | null;
    standardRange?: string | null;
    peakTemperatureRecorded?: string | null;
    violationDurationMinutes?: number | null;
    logTimestamp?: string | null;
    details?: string | null;
    aiRecommendation?: string | null;
    suggestedFaultOwner?: string | null;
  } | null;
  availableActions?: Array<{
    action: string;
    method: string;
    endpoint: string;
    description: string;
  }>;
};

export type TReviewClaimRequest = {
  note?: string;
};

export type TRejectClaimRequest = {
  note: string;
};

export type TPayoutClaimRequest = {
  bankTransferImageUrl?: string;
  payoutTransactionCode?: string;
  refundAmount: number;
  paymentMethod: string;
  note?: string;
};

export const PayoutClaimFormSchema = z.object({
  refundAmount: z.coerce
    .number()
    .positive("Số tiền giải ngân phải lớn hơn 0"),
  paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
  payoutTransactionCode: z.string().trim().optional(),
  bankTransferImageUrl: z
    .string()
    .trim()
    .url("Đường dẫn chứng từ không hợp lệ")
    .or(z.literal(""))
    .optional(),
  note: z.string().trim().max(1000, "Ghi chú tối đa 1000 ký tự").optional(),
});

export type TPayoutClaimFormValues = z.infer<typeof PayoutClaimFormSchema>;
