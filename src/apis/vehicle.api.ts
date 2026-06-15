import { apiRequest } from "@/lib/http";
import type {
  TVehicle,
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

const getVehicleById = async (id: string) =>
  await apiRequest.baseApi.get<BaseResponse<TVehicle>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`
  );

const createVehicle = async (data: FormData) =>
  await apiRequest.baseApi.post<BaseResponse<TVehicle>>(
    API_SUFFIX.VEHICLES_API,
    data
  );

const updateVehicle = async (id: string, data: TVehicleUpdateRequest) =>
  await apiRequest.baseApi.put<BaseResponse<TVehicle>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`,
    data
  );

const deleteVehicle = async (id: string) =>
  await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.VEHICLES_API}/${id}`
  );

export const vehicleApi = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
