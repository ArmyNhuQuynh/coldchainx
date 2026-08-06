import { permissionApi } from "@/apis/permission.api";
import type {
  TReplaceRolePermissionsRequest,
  TUpsertUserPermissionRequest,
} from "@/schemas/permission.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePermission = () => {
  const queryClient = useQueryClient();

  const getRolePermissionMatrix = () =>
    useQuery({
      queryKey: ["permissions", "matrix"],
      queryFn: permissionApi.getRolePermissionMatrix,
    });

  const getUserPermissions = (userId?: string) =>
    useQuery({
      queryKey: ["permissions", "users", userId],
      queryFn: () => permissionApi.getUserPermissions(userId!),
      enabled: Boolean(userId),
    });

  const replaceRolePermissions = useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: string;
      data: TReplaceRolePermissionsRequest;
    }) => permissionApi.replaceRolePermissions(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", "matrix"] });
      queryClient.invalidateQueries({ queryKey: ["permissions", "users"] });
    },
  });

  const upsertUserPermission = useMutation({
    mutationFn: ({
      userId,
      permissionId,
      data,
    }: {
      userId: string;
      permissionId: string;
      data: TUpsertUserPermissionRequest;
    }) => permissionApi.upsertUserPermission(userId, permissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", "users", variables.userId],
      });
    },
  });

  const revokeUserPermission = useMutation({
    mutationFn: ({
      userId,
      permissionId,
    }: {
      userId: string;
      permissionId: string;
    }) => permissionApi.revokeUserPermission(userId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", "users", variables.userId],
      });
    },
  });

  return {
    getRolePermissionMatrix,
    getUserPermissions,
    replaceRolePermissions,
    upsertUserPermission,
    revokeUserPermission,
  };
};
