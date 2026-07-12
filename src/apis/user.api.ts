import { apiRequest } from "@/lib/http";
import type {
  TAdminUpdateUserRequest,
  TChangeUserRoleRequest,
  TChangeUserStatusRequest,
  TCreateSaleUserRequest,
  TResetUserPasswordRequest,
  TUserListParams,
  TUserListResponse,
  TUserProfile,
} from "@/schemas/user.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const cleanParams = (params: TUserListParams) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getUsers = async (params: TUserListParams) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TUserListResponse>>(
    API_SUFFIX.USERS_API,
    { params: cleanParams(params) }
  );
  return response.data;
};

const getUserById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TUserProfile>>(
    `${API_SUFFIX.USERS_API}/${id}`
  );
  return response.data;
};

const createSaleUser = async (data: TCreateSaleUserRequest) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TUserProfile>>(
    API_SUFFIX.USERS_API,
    data
  );
  return response.data;
};

const updateUser = async (id: string, data: TAdminUpdateUserRequest) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TUserProfile>>(
    `${API_SUFFIX.USERS_API}/${id}`,
    data
  );
  return response.data;
};

const changeUserRole = async (id: string, data: TChangeUserRoleRequest) => {
  const response = await apiRequest.baseApi.patch<BaseResponse<boolean>>(
    `${API_SUFFIX.USERS_API}/${id}/role`,
    data
  );
  return response.data;
};

const changeUserStatus = async (id: string, data: TChangeUserStatusRequest) => {
  const response = await apiRequest.baseApi.patch<BaseResponse<boolean>>(
    `${API_SUFFIX.USERS_API}/${id}/status`,
    data
  );
  return response.data;
};

const resetUserPassword = async (
  id: string,
  data: TResetUserPasswordRequest
) => {
  const response = await apiRequest.baseApi.post<BaseResponse<boolean>>(
    `${API_SUFFIX.USERS_API}/${id}/reset-password`,
    data
  );
  return response.data;
};

export const userApi = {
  getUsers,
  getUserById,
  createSaleUser,
  updateUser,
  changeUserRole,
  changeUserStatus,
  resetUserPassword,
};
