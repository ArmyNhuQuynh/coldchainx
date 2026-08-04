import { claimApi } from "@/apis/claim.api";
import type {
  TClaimListParams,
  TPayoutClaimRequest,
  TRejectClaimRequest,
  TReviewClaimRequest,
} from "@/schemas/claim.schema";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const claimQueryKeys = {
  root: ["claims"] as const,
  list: (params: TClaimListParams) =>
    [...claimQueryKeys.root, "list", params] as const,
  detail: (claimId: string) =>
    [...claimQueryKeys.root, "detail", claimId] as const,
  investigation: (claimId: string) =>
    [...claimQueryKeys.root, "investigation", claimId] as const,
};

export const useClaim = () => {
  const queryClient = useQueryClient();
  const invalidateClaims = () =>
    queryClient.invalidateQueries({ queryKey: claimQueryKeys.root });

  const getClaims = (params: TClaimListParams, enabled = true) =>
    useQuery({
      queryKey: claimQueryKeys.list(params),
      queryFn: () => claimApi.getClaims(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  const getClaim = (claimId?: string) =>
    useQuery({
      queryKey: claimQueryKeys.detail(claimId ?? ""),
      queryFn: () => claimApi.getClaim(claimId!),
      enabled: Boolean(claimId),
    });

  const getInvestigation = (claimId?: string) =>
    useQuery({
      queryKey: claimQueryKeys.investigation(claimId ?? ""),
      queryFn: () => claimApi.getInvestigation(claimId!),
      enabled: Boolean(claimId),
    });

  const approveByDispatcher = useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: TReviewClaimRequest }) =>
      claimApi.approveByDispatcher(claimId, data),
    onSuccess: invalidateClaims,
  });

  const rejectByDispatcher = useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: TRejectClaimRequest }) =>
      claimApi.rejectByDispatcher(claimId, data),
    onSuccess: invalidateClaims,
  });

  const payoutByAccountant = useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: TPayoutClaimRequest }) =>
      claimApi.payoutByAccountant(claimId, data),
    onSuccess: invalidateClaims,
  });

  return {
    getClaims,
    getClaim,
    getInvestigation,
    approveByDispatcher,
    rejectByDispatcher,
    payoutByAccountant,
  };
};
