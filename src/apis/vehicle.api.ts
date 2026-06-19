import { apiRequest } from "@/lib/http";
import type {
  TVehicle,
  TVehicleCreateRequest,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

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

export const vehicleApi = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
