import { userApi } from "@/apis/user.api";
import type {
  TAdminUpdateUserRequest,
  TChangeUserRoleRequest,
  TChangeUserStatusRequest,
  TChangeUserWarehouseRequest,
  TCreateSaleUserRequest,
  TResetUserPasswordRequest,
  TUserListParams,
} from "@/schemas/user.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();

  const getUsers = (params: TUserListParams) =>
    useQuery({
      queryKey: ["users", params],
      queryFn: () => userApi.getUsers(params),
      placeholderData: keepPreviousData,
    });

  const getUserById = (id?: string) =>
    useQuery({
      queryKey: ["user", id],
      queryFn: () => userApi.getUserById(id!),
      enabled: !!id,
    });

  const createSaleUser = useMutation({
    mutationFn: (data: TCreateSaleUserRequest) => userApi.createSaleUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TAdminUpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const changeUserRole = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TChangeUserRoleRequest }) =>
      userApi.changeUserRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const changeUserStatus = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TChangeUserStatusRequest }) =>
      userApi.changeUserStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const changeUserWarehouse = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TChangeUserWarehouseRequest;
    }) => userApi.changeUserWarehouse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const resetUserPassword = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TResetUserPasswordRequest }) =>
      userApi.resetUserPassword(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  return {
    getUsers,
    getUserById,
    createSaleUser,
    updateUser,
    changeUserRole,
    changeUserStatus,
    changeUserWarehouse,
    resetUserPassword,
  };
};
