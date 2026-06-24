import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type { TAuthResponse, TLoginRequest } from "@/schemas/auth.schema";

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


export const authApi = {
    login,
    refreshTokens,
}
