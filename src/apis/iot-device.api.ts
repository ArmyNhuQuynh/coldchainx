import { apiRequest } from "@/lib/http";
import type {
  TIotDeviceCreateRequest,
  TIotDeviceUpdateRequest,
} from "@/schemas/iot-device.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import {
  normalizeCreatedIotDeviceId,
  normalizeIotDevice,
  normalizeIotDeviceList,
} from "./iot-device-normalizers";

const getIotDevices = async () => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    API_SUFFIX.IOT_DEVICES_API
  );
  return normalizeIotDeviceList(response.data);
};

const getIotDeviceById = async (id: string) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `${API_SUFFIX.IOT_DEVICES_API}/${id}`
  );
  const device = normalizeIotDevice(
    response.data.data ?? response.data.Data ?? response.data
  );
  return device;
};

const createIotDevice = async (data: TIotDeviceCreateRequest) => {
  const response = await apiRequest.baseApi.post<BaseResponse<unknown>>(
    API_SUFFIX.IOT_DEVICES_API,
    data
  );
  return normalizeCreatedIotDeviceId(response.data);
};

const updateIotDevice = async (
  id: string,
  data: TIotDeviceUpdateRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<boolean>>(
    `${API_SUFFIX.IOT_DEVICES_API}/${id}`,
    data
  );
  return response.data;
};

const deleteIotDevice = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.IOT_DEVICES_API}/${id}`
  );
  return response.data;
};

export const iotDeviceApi = {
  getIotDevices,
  getIotDeviceById,
  createIotDevice,
  updateIotDevice,
  deleteIotDevice,
};
