import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";

const checkVehicleIot = async (tripId: string, vehicleId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<any>>(
    `/api/Dispatch/vehicle-iot-check/${tripId}/${vehicleId}`
  );
  return response.data;
};

export const dispatchApi = {
  checkVehicleIot,
};
