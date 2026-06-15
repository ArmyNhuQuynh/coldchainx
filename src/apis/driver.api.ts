import { apiRequest } from "@/lib/http";
import type { TDriver } from "@/schemas/driver.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getDrivers = async () => {
  const response = await apiRequest.baseApi.get<BaseResponse<TDriver[]>>(
    API_SUFFIX.DRIVERS_API
  );
  return response.data;
};

const getDriverById = async (id: string) =>
  await apiRequest.baseApi.get<BaseResponse<TDriver>>(
    `${API_SUFFIX.DRIVERS_API}/${id}`
  );

export const driverApi = {
  getDrivers,
  getDriverById,
};
