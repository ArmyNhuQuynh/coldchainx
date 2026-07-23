import { incidentApi } from "@/apis/incident.api";
import type {
  TApproveIncidentExpenseRequest,
  TConfirmTransloadRequest,
  TDispatchRescueRequest,
  TReimburseIncidentExpenseRequest,
  TResolveIncidentRequest,
} from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const incidentQueryKeys = {
  root: ["incidents"] as const,
  all: () => [...incidentQueryKeys.root, "all"] as const,
  detail: (incidentId: string) =>
    [...incidentQueryKeys.root, "detail", incidentId] as const,
  candidates: (incidentId: string) =>
    [...incidentQueryKeys.root, "rescue-candidates", incidentId] as const,
};

export const useIncident = () => {
  const queryClient = useQueryClient();

  const invalidateIncidentData = (incidentId?: string) => {
    void queryClient.invalidateQueries({ queryKey: incidentQueryKeys.root });
    void queryClient.invalidateQueries({ queryKey: ["monitoring"] });
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

  const dispatchRescue = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TDispatchRescueRequest;
    }) => incidentApi.dispatchRescue(incidentId, data),
    onSuccess: (_, variables) => invalidateIncidentData(variables.incidentId),
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
    dispatchRescue,
    confirmTransload,
    approveExpense,
    reimburseExpense,
    resolveIncident,
  };
};
