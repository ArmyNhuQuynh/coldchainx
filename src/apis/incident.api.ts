import { apiRequest } from "@/lib/http";
import type {
  TConfirmTransloadRequest,
  TConfirmTransloadResult,
  TDispatchRescueRequest,
  TDispatchRescueResult,
  TIncident,
  TIncidentListParams,
  TIncidentPage,
  TReimburseIncidentExpenseRequest,
  TRescueCandidate,
  TReviewIncidentExpenseRequest,
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
): Promise<TConfirmTransloadResult> => {
  const formData = new FormData();
  if (data.handoverTemperature !== undefined) {
    formData.append("HandoverTemperature", String(data.handoverTemperature));
  }
  if (data.note?.trim()) formData.append("Note", data.note.trim());
  data.photos.forEach((photo) => formData.append("Photos", photo));

  const response = await apiRequest.baseApi.post<
    BaseResponse<TConfirmTransloadResult>
  >(`${INCIDENTS_URL}/${incidentId}/transload/confirm`, formData);
  return response.data.data;
};

const reviewExpense = async (
  incidentId: string,
  data: TReviewIncidentExpenseRequest
): Promise<TIncident> => {
  const response = await apiRequest.baseApi.post<BaseResponse<TIncident>>(
    `${INCIDENTS_URL}/${incidentId}/expense-review`,
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
    `${INCIDENTS_URL}/${incidentId}/reimburse`,
    formData
  );
  return response.data.data;
};

export const incidentApi = {
  getIncidents,
  getAllIncidents,
  getIncident,
  getRescueCandidates,
  dispatchRescue,
  confirmTransload,
  reviewExpense,
  reimburseExpense,
};

