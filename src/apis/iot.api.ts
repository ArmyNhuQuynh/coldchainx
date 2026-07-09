import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";

export type TIotDevice = {
  deviceId: string;
  deviceCode: string;
  deviceType: string;
  status: string;
  vehicleId?: string | null;
  lastPingTime?: string | null;
  createdAt: string;
};

export const getIotDevices = async () => {
  const response = await apiRequest.baseApi.get<BaseResponse<TIotDevice[]>>("/api/iot-devices");
  return response.data;
};

export const assignIotDevice = async (vehicleId: string, deviceId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<boolean>>("/api/fleet/assign-device", {
    vehicleId,
    deviceId,
  });
  return response.data;
};

export const iotApi = {
  getIotDevices,
  assignIotDevice,
};
