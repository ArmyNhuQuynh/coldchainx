import { apiRequest } from "@/lib/http";
import type {
  TClaim,
  TClaimInvestigation,
  TClaimListParams,
  TClaimPage,
  TPayoutClaimRequest,
  TRejectClaimRequest,
  TReviewClaimRequest,
} from "@/schemas/claim.schema";
import type { BaseResponse } from "@/types/response.type";

const CLAIMS_URL = "/v1/claims";

const getClaims = async (
  params: TClaimListParams = {}
): Promise<TClaimPage> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TClaimPage>>(
    CLAIMS_URL,
    { params }
  );
  return response.data.data;
};

const getClaim = async (claimId: string): Promise<TClaim> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TClaim>>(
    `${CLAIMS_URL}/${claimId}`
  );
  return response.data.data;
};

const getInvestigation = async (
  claimId: string
): Promise<TClaimInvestigation> => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TClaimInvestigation>
  >(`${CLAIMS_URL}/${claimId}/osd-investigation`);
  return response.data.data;
};

const approveByDispatcher = async (
  claimId: string,
  data: TReviewClaimRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<object>>(
    `${CLAIMS_URL}/${claimId}/dispatcher-approve`,
    data
  );
  return response.data;
};

const rejectByDispatcher = async (
  claimId: string,
  data: TRejectClaimRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<object>>(
    `${CLAIMS_URL}/${claimId}/dispatcher-reject`,
    data
  );
  return response.data;
};

const payoutByAccountant = async (
  claimId: string,
  data: TPayoutClaimRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<object>>(
    `${CLAIMS_URL}/${claimId}/payout-accountant`,
    data
  );
  return response.data;
};

export const claimApi = {
  getClaims,
  getClaim,
  getInvestigation,
  approveByDispatcher,
  rejectByDispatcher,
  payoutByAccountant,
};
