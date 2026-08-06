import { apiRequest } from "@/lib/http";
import type {
  TEffectivePermissions,
  TReplaceRolePermissionsRequest,
  TRolePermissionMatrix,
  TUpsertUserPermissionRequest,
  TUserPermission,
} from "@/schemas/permission.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getRolePermissionMatrix = async () => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TRolePermissionMatrix>
  >(`${API_SUFFIX.ADMIN_PERMISSIONS_API}/matrix`);
  return response.data;
};

const replaceRolePermissions = async (
  roleId: string,
  data: TReplaceRolePermissionsRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<boolean>>(
    `${API_SUFFIX.ADMIN_PERMISSIONS_API}/roles/${roleId}`,
    data
  );
  return response.data;
};

const getUserPermissions = async (userId: string) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TEffectivePermissions>
  >(`${API_SUFFIX.ADMIN_PERMISSIONS_API}/users/${userId}`);
  return response.data;
};

const upsertUserPermission = async (
  userId: string,
  permissionId: string,
  data: TUpsertUserPermissionRequest
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TUserPermission>>(
    `${API_SUFFIX.ADMIN_PERMISSIONS_API}/users/${userId}/${permissionId}`,
    data
  );
  return response.data;
};

const revokeUserPermission = async (
  userId: string,
  permissionId: string
) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.ADMIN_PERMISSIONS_API}/users/${userId}/${permissionId}`
  );
  return response.data;
};

export const permissionApi = {
  getRolePermissionMatrix,
  replaceRolePermissions,
  getUserPermissions,
  upsertUserPermission,
  revokeUserPermission,
};
