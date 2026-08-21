import { incidentApi } from "@/apis/incident.api";
import type {
  TApproveIncidentExpenseRequest,
  TConfirmTransloadRequest,
  TContinueTripRequest,
  TAssessIncidentRiskRequest,
  TDispatchExternalReeferRequest,
  TRecordRescueFallbackRequest,
  TDispatchRescueRequest,
  TDispatchRescueResult,
  TInboundRouteWarehouseRequest,
  TReimburseIncidentExpenseRequest,
  TResolveIncidentRequest,
} from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const incidentQueryKeys = {
  root: ["incidents"] as const,
  all: () => [...incidentQueryKeys.root, "all"] as const,
  detail: (incidentId: string) =>
    [...incidentQueryKeys.root, "detail", incidentId] as const,
  candidates: (incidentId: string) =>
    [...incidentQueryKeys.root, "rescue-candidates", incidentId] as const,
  rescueOptions: (incidentId: string) =>
    [...incidentQueryKeys.root, "rescue-options", incidentId] as const,
  lastRescueResult: (incidentId: string) =>
    [...incidentQueryKeys.root, "last-rescue-result", incidentId] as const,
};

export const useIncident = () => {
  const queryClient = useQueryClient();

  const invalidateIncidentData = (incidentId?: string) => {
    void queryClient.invalidateQueries({ queryKey: incidentQueryKeys.root });
    void queryClient.invalidateQueries({ queryKey: ["monitoring"] });
    void queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    if (incidentId) {
      void queryClient.invalidateQueries({
        queryKey: incidentQueryKeys.detail(incidentId),
      });
    }
  };

  const getAllIncidents = (enabled = true) =>
    useQuery({
      queryKey: incidentQueryKeys.all(),
      queryFn: incidentApi.getAllIncidents,
      enabled,
      placeholderData: keepPreviousData,
      refetchInterval: enabled ? 30_000 : false,
    });

  const getUnresolvedIncidentCount = (enabled = true) =>
    useQuery({
      queryKey: incidentQueryKeys.all(),
      queryFn: incidentApi.getAllIncidents,
      enabled,
      staleTime: 30_000,
      refetchInterval: enabled ? 60_000 : false,
      select: (incidents) =>
        incidents.filter((incident) => incident.status !== INCIDENT_STATUS.RESOLVED)
          .length,
    });

  const getIncident = (incidentId?: string) =>
    useQuery({
      queryKey: incidentQueryKeys.detail(incidentId ?? ""),
      queryFn: () => incidentApi.getIncident(incidentId!),
      enabled: Boolean(incidentId),
      refetchInterval: (query) =>
        query.state.data?.status === INCIDENT_STATUS.RESOLVED ? false : 15_000,
    });

  const getRescueCandidates = (incidentId?: string, enabled = true) =>
    useQuery({
      queryKey: incidentQueryKeys.candidates(incidentId ?? ""),
      queryFn: () => incidentApi.getRescueCandidates(incidentId!),
      enabled: enabled && Boolean(incidentId),
      retry: false,
    });

  const getRescueOptions = (incidentId?: string, enabled = true) =>
    useQuery({
      queryKey: incidentQueryKeys.rescueOptions(incidentId ?? ""),
      queryFn: () => incidentApi.getRescueOptions(incidentId!),
      enabled: enabled && Boolean(incidentId),
      retry: false,
    });

  const assessRisk = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TAssessIncidentRiskRequest;
    }) => incidentApi.assessRisk(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const continueTrip = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TContinueTripRequest;
    }) => incidentApi.continueTrip(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const dispatchExternalReefer = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TDispatchExternalReeferRequest;
    }) => incidentApi.dispatchExternalReefer(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
    onError: (error, variables) => {
      if (!isAxiosError(error)) return;
      const status = error.response?.status;
      if (
        !error.response ||
        status === 404 ||
        status === 409 ||
        (status ?? 0) >= 500
      ) {
        invalidateIncidentData(variables.incidentId);
      }
    },
  });

  const recordFallback = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TRecordRescueFallbackRequest;
    }) => incidentApi.recordFallback(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const inboundRouteWarehouse = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TInboundRouteWarehouseRequest;
    }) => incidentApi.inboundRouteWarehouse(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const dispatchRescue = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TDispatchRescueRequest;
    }) => incidentApi.dispatchRescue(incidentId, data),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<TDispatchRescueResult>(
        incidentQueryKeys.lastRescueResult(variables.incidentId),
        result,
      );
      invalidateIncidentData(variables.incidentId);
    },
  });

  const confirmTransload = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TConfirmTransloadRequest;
    }) => incidentApi.confirmTransload(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const approveExpense = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TApproveIncidentExpenseRequest;
    }) => incidentApi.approveExpense(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const reimburseExpense = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TReimburseIncidentExpenseRequest;
    }) => incidentApi.reimburseExpense(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  const resolveIncident = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TResolveIncidentRequest;
    }) => incidentApi.resolveIncident(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
  });

  return {
    getAllIncidents,
    getUnresolvedIncidentCount,
    getIncident,
    getRescueCandidates,
    getRescueOptions,
    assessRisk,
    continueTrip,
    dispatchExternalReefer,
    inboundRouteWarehouse,
    recordFallback,
    dispatchRescue,
    confirmTransload,
    approveExpense,
    reimburseExpense,
    resolveIncident,
  };
};
