import { apiRequest } from "@/lib/http";
import type {
  TDriver,
  TDriverCreateRequest,
  TDriverImportResult,
  TDriverLicense,
  TDriverLicenseRequest,
  TDriverUpdateRequest,
} from "@/schemas/driver.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getDrivers = async () => {
  const response = await apiRequest.baseApi.get<BaseResponse<TDriver[]>>(
    API_SUFFIX.DRIVERS_API
  );
  return response.data;
};

const getDriverById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TDriver>>(
    `${API_SUFFIX.DRIVERS_API}/${id}`
  );
  return response.data;
};

const createDriver = async (data: TDriverCreateRequest) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TDriver>>(
    API_SUFFIX.DRIVERS_API,
    data
  );
  return response.data;
};

const updateDriver = async (id: string, data: TDriverUpdateRequest) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TDriver>>(
    `${API_SUFFIX.DRIVERS_API}/${id}`,
    data
  );
  return response.data;
};

const deleteDriver = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.DRIVERS_API}/${id}`
  );
  return response.data;
};

const importDrivers = async (file: File) => {
  const formData = new FormData();
  formData.append("ExcelFile", file);

  const response = await apiRequest.baseApi.post<
    BaseResponse<TDriverImportResult>
  >(`${API_SUFFIX.DRIVERS_API}/import`, formData);
  return response.data;
};

const getDriverLicenses = async (driverId?: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TDriverLicense[]>>(
    API_SUFFIX.DRIVER_LICENSES_API,
    {
      params: driverId ? { driverId } : undefined,
    }
  );
  return response.data;
};

const createDriverLicense = async (
  driverId: string,
  data: TDriverLicenseRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TDriverLicense>>(
    `${API_SUFFIX.DRIVERS_API}/${driverId}/licenses`,
    data
  );
  return response.data;
};

const updateDriverLicense = async (
  licenseId: string,
  data: TDriverLicenseRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TDriverLicense>>(
    `${API_SUFFIX.DRIVER_LICENSES_API}/${licenseId}`,
    data
  );
  return response.data;
};

const deleteDriverLicense = async (licenseId: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.DRIVER_LICENSES_API}/${licenseId}`
  );
  return response.data;
};

const importDriverLicenses = async (file: File) => {
  const formData = new FormData();
  formData.append("ExcelFile", file);

  const response = await apiRequest.baseApi.post<
    BaseResponse<TDriverImportResult>
  >(`${API_SUFFIX.DRIVER_LICENSES_API}/import`, formData);
  return response.data;
};

export const driverApi = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  importDrivers,
  getDriverLicenses,
  createDriverLicense,
  updateDriverLicense,
  deleteDriverLicense,
  importDriverLicenses,
};
