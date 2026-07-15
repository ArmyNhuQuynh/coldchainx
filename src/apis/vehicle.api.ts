import { apiRequest } from "@/lib/http";
import type {
  TCompleteMaintenanceTicketRequest,
  TCreateMaintenanceTicketRequest,
  TMaintenanceForecast,
  TMaintenanceTicket,
  TMaintenanceTicketPage,
  TMaintenanceTicketQuery,
  TVehicle,
  TVehicleCreateRequest,
  TVehicleDocument,
  TVehicleDocumentRequest,
  TVehicleImportResult,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import { normalizeMaintenanceTicketPage } from "./vehicle-normalizers";

const getVehicles = async () => {
  const response = await apiRequest.baseApi.get<BaseResponse<TVehicle[]>>(
    API_SUFFIX.VEHICLES_API
  );
  return response.data;
};

const getVehicleById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TVehicle>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`
  );
  return response.data;
};

const createVehicle = async (data: TVehicleCreateRequest) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TVehicle>>(
    API_SUFFIX.VEHICLES_API,
    data
  );
  return response.data;
};

const updateVehicle = async (id: string, data: TVehicleUpdateRequest) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TVehicle>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`,
    data
  );
  return response.data;
};

const deleteVehicle = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`
  );
  return response.data;
};

const importVehicles = async (file: File) => {
  const formData = new FormData();
  formData.append("ExcelFile", file);

  const response = await apiRequest.baseApi.post<
    BaseResponse<TVehicleImportResult>
  >(`${API_SUFFIX.VEHICLES_API}/import`, formData);
  return response.data;
};

const getVehicleDocuments = async (vehicleId?: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TVehicleDocument[]>>(
    API_SUFFIX.VEHICLE_DOCUMENTS_API,
    {
      params: vehicleId ? { vehicleId } : undefined,
    }
  );
  return response.data;
};

const createVehicleDocument = async (
  vehicleId: string,
  data: TVehicleDocumentRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TVehicleDocument>>(
    `${API_SUFFIX.VEHICLES_API}/${vehicleId}/documents`,
    data
  );
  return response.data;
};

const updateVehicleDocument = async (
  docId: string,
  data: TVehicleDocumentRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TVehicleDocument>>(
    `${API_SUFFIX.VEHICLE_DOCUMENTS_API}/${docId}`,
    data
  );
  return response.data;
};

const deleteVehicleDocument = async (docId: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.VEHICLE_DOCUMENTS_API}/${docId}`
  );
  return response.data;
};

const importVehicleDocuments = async (file: File) => {
  const formData = new FormData();
  formData.append("ExcelFile", file);

  const response = await apiRequest.baseApi.post<
    BaseResponse<TVehicleImportResult>
  >(`${API_SUFFIX.VEHICLE_DOCUMENTS_API}/import`, formData);
  return response.data;
};

const getMaintenanceTickets = async (
  params: TMaintenanceTicketQuery = {}
): Promise<BaseResponse<TMaintenanceTicketPage>> => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TMaintenanceTicketPage | TMaintenanceTicket[]>
  >(API_SUFFIX.MAINTENANCE_TICKETS_API, { params });

  return {
    ...response.data,
    data: normalizeMaintenanceTicketPage(response.data.data),
  };
};

const getMaintenanceTicketById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TMaintenanceTicket>>(
    `${API_SUFFIX.MAINTENANCE_TICKETS_API}/${id}`
  );
  return response.data;
};

const createMaintenanceTicket = async (
  vehicleId: string,
  data: TCreateMaintenanceTicketRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TMaintenanceTicket>>(
    `${API_SUFFIX.VEHICLES_API}/${vehicleId}/maintenance-tickets`,
    data
  );
  return response.data;
};

const updateMaintenanceTicketStatus = async (id: string, status: string) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TMaintenanceTicket>>(
    `${API_SUFFIX.MAINTENANCE_TICKETS_API}/${id}/status`,
    null,
    { params: { status } }
  );
  return response.data;
};

const completeMaintenanceTicket = async (
  ticketId: string,
  data: TCompleteMaintenanceTicketRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TMaintenanceTicket>>(
    `${API_SUFFIX.MAINTENANCE_TICKETS_API}/${ticketId}/complete`,
    data
  );
  return response.data;
};

const uploadMaintenanceTicketDocument = async (ticketId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest.baseApi.post<BaseResponse<TMaintenanceTicket>>(
    `${API_SUFFIX.MAINTENANCE_TICKETS_API}/${ticketId}/documents`,
    formData
  );
  return response.data;
};

const getVehicleMaintenanceHistory = async (vehicleId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TMaintenanceTicket[]>>(
    `${API_SUFFIX.VEHICLES_API}/${vehicleId}/maintenance-history`
  );
  return response.data;
};

const getVehicleMaintenanceForecast = async (
  vehicleId: string,
  tripId?: string
) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TMaintenanceForecast>>(
    `${API_SUFFIX.VEHICLES_API}/${vehicleId}/maintenance-forecast`,
    {
      params: tripId ? { tripId } : undefined,
    }
  );
  return response.data;
};

const markVehicleUnavailable = async (vehicleId: string, reason?: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TVehicle>>(
    `${API_SUFFIX.VEHICLES_API}/${vehicleId}/mark-unavailable`,
    null,
    {
      params: reason ? { reason } : undefined,
    }
  );
  return response.data;
};

export const vehicleApi = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  importVehicles,
  getVehicleDocuments,
  createVehicleDocument,
  updateVehicleDocument,
  deleteVehicleDocument,
  importVehicleDocuments,
  getMaintenanceTickets,
  getMaintenanceTicketById,
  createMaintenanceTicket,
  updateMaintenanceTicketStatus,
  completeMaintenanceTicket,
  uploadMaintenanceTicketDocument,
  getVehicleMaintenanceHistory,
  getVehicleMaintenanceForecast,
  markVehicleUnavailable,
};
