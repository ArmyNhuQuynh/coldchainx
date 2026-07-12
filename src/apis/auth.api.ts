import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type {
  TAuthResponse,
  TCreateWarehouseWorkerRequest,
  TLoginRequest,
} from "@/schemas/auth.schema";

const login = async (request: TLoginRequest) => apiRequest.baseApi.post<BaseResponse<TAuthResponse>>(`${API_SUFFIX.AUTH_API}/login`, request);

const refreshTokens = async (refreshToken: string) =>
  apiRequest.baseApi.post<BaseResponse<TAuthResponse>>(
    `${API_SUFFIX.AUTH_API}/refresh-tokens`,
    JSON.stringify(refreshToken),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

const createWarehouseWorker = async (
  data: TCreateWarehouseWorkerRequest
) => {
  const formData = new FormData();
  formData.append("Username", data.username);
  formData.append("Password", data.password);
  formData.append("FullName", data.fullName);
  formData.append("Email", data.email ?? "");
  formData.append("Phone", data.phone ?? "");
  formData.append("WarehouseId", data.warehouseId);

  const response = await apiRequest.baseApi.post<BaseResponse<TAuthResponse>>(
    `${API_SUFFIX.AUTH_API}/create-warehouse-worker`,
    formData
  );
  return response.data;
};

export const authApi = {
    login,
    refreshTokens,
    createWarehouseWorker,
}
