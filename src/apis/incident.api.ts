import { apiRequest } from "@/lib/http";
import type {
  TApproveIncidentExpenseRequest,
  TConfirmTransloadRequest,
  TContinueTripRequest,
  TAssessIncidentRiskRequest,
  TIncidentRiskAssessmentResult,
  TIncidentRescuePlan,
  TDispatchExternalReeferRequest,
  TExternalReeferWorkflowResult,
  TRecordRescueFallbackRequest,
  TRescueFallbackResult,
  TDispatchRescueRequest,
  TDispatchRescueResult,
  TIncident,
  TIncidentListParams,
  TIncidentPage,
  TIncidentWorkflowResult,
  TInboundRouteWarehouseRequest,
  TReimburseIncidentExpenseRequest,
  TResolveIncidentRequest,
  TRescueCandidate,
} from "@/schemas/incident.schema";
import type { BaseResponse } from "@/types/response.type";

const INCIDENTS_URL = "/v1/incidents";

const getIncidents = async (
  params: TIncidentListParams = {}
): Promise<TIncidentPage> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TIncidentPage>>(
    INCIDENTS_URL,
    { params }
  );
  return response.data.data;
};

const getAllIncidents = async (): Promise<TIncident[]> => {
  const pageSize = 100;
  const firstPage = await getIncidents({ pageNumber: 1, pageSize });

  if (firstPage.totalPages <= 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getIncidents({ pageNumber: index + 2, pageSize })
    )
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
};

const getIncident = async (incidentId: string): Promise<TIncident> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TIncident>>(
    `${INCIDENTS_URL}/${incidentId}`
  );
  return response.data.data;
};

const getRescueCandidates = async (
  incidentId: string
): Promise<TRescueCandidate[]> => {
  const response = await apiRequest.baseApi.get<BaseResponse<TRescueCandidate[]>>(
    `${INCIDENTS_URL}/${incidentId}/rescue-candidates`
  );
  return response.data.data;
};

const assessRisk = async (
  incidentId: string,
  data: TAssessIncidentRiskRequest
): Promise<TIncidentRiskAssessmentResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TIncidentRiskAssessmentResult>
  >(`${INCIDENTS_URL}/${incidentId}/assess-risk`, data);
  return response.data.data;
};

const continueTrip = async (
  incidentId: string,
  data: TContinueTripRequest
): Promise<TIncidentWorkflowResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TIncidentWorkflowResult>
  >(`${INCIDENTS_URL}/${incidentId}/continue-trip`, data);
  return response.data.data;
};

const getRescueOptions = async (
  incidentId: string
): Promise<TIncidentRescuePlan> => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TIncidentRescuePlan>
  >(`${INCIDENTS_URL}/${incidentId}/rescue-options`);
  return response.data.data;
};

const dispatchExternalReefer = async (
  incidentId: string,
  data: TDispatchExternalReeferRequest
): Promise<TExternalReeferWorkflowResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TExternalReeferWorkflowResult>
  >(`${INCIDENTS_URL}/${incidentId}/external-reefer-dispatch`, data);
  return response.data.data;
};

const inboundRouteWarehouse = async (
  incidentId: string,
  data: TInboundRouteWarehouseRequest
): Promise<TExternalReeferWorkflowResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TExternalReeferWorkflowResult>
  >(`${INCIDENTS_URL}/${incidentId}/inbound-route-warehouse`, data);
  return response.data.data;
};

const recordFallback = async (
  incidentId: string,
  data: TRecordRescueFallbackRequest
): Promise<TRescueFallbackResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TRescueFallbackResult>
  >(`${INCIDENTS_URL}/${incidentId}/record-fallback`, data);
  return response.data.data;
};

const dispatchRescue = async (
  incidentId: string,
  data: TDispatchRescueRequest
): Promise<TDispatchRescueResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TDispatchRescueResult>
  >(`${INCIDENTS_URL}/${incidentId}/dispatch-rescue`, data);
  return response.data.data;
};

const confirmTransload = async (
  incidentId: string,
  data: TConfirmTransloadRequest
): Promise<TIncidentWorkflowResult> => {
  const response = await apiRequest.baseApi.post<
    BaseResponse<TIncidentWorkflowResult>
  >(`${INCIDENTS_URL}/${incidentId}/confirm-transload`, data);
  return response.data.data;
};

const approveExpense = async (
  incidentId: string,
  data: TApproveIncidentExpenseRequest
): Promise<TIncident> => {
  const response = await apiRequest.baseApi.post<BaseResponse<TIncident>>(
    `${INCIDENTS_URL}/${incidentId}/expenses/approve`,
    data
  );
  return response.data.data;
};

const reimburseExpense = async (
  incidentId: string,
  data: TReimburseIncidentExpenseRequest
): Promise<TIncident> => {
  const formData = new FormData();
  formData.append("ReimbursedAmount", String(data.reimbursedAmount));
  if (data.note?.trim()) formData.append("Note", data.note.trim());
  formData.append("ReceiptFile", data.receiptFile);

  const response = await apiRequest.baseApi.post<BaseResponse<TIncident>>(
    `${INCIDENTS_URL}/${incidentId}/expenses/reimburse`,
    formData
  );
  return response.data.data;
};

const resolveIncident = async (
  incidentId: string,
  data: TResolveIncidentRequest
): Promise<boolean> => {
  const response = await apiRequest.baseApi.post<BaseResponse<boolean>>(
    `${INCIDENTS_URL}/${incidentId}/resolve`,
    data
  );
  return response.data.data;
};

export const incidentApi = {
  getIncidents,
  getAllIncidents,
  getIncident,
  getRescueCandidates,
  assessRisk,
  continueTrip,
  getRescueOptions,
  dispatchExternalReefer,
  inboundRouteWarehouse,
  recordFallback,
  dispatchRescue,
  confirmTransload,
  approveExpense,
  reimburseExpense,
  resolveIncident,
};
