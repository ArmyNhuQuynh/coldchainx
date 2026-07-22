import { incidentApi } from "@/apis/incident.api";
import type {
  TConfirmTransloadRequest,
  TDispatchRescueRequest,
  TReimburseIncidentExpenseRequest,
  TReviewIncidentExpenseRequest,
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

  const reviewExpense = useMutation({
    mutationFn: ({
      incidentId,
      data,
    }: {
      incidentId: string;
      data: TReviewIncidentExpenseRequest;
    }) => incidentApi.reviewExpense(incidentId, data),
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

  return {
    getAllIncidents,
    getUnresolvedIncidentCount,
    getIncident,
    getRescueCandidates,
    dispatchRescue,
    confirmTransload,
    reviewExpense,
    reimburseExpense,
  };
};
