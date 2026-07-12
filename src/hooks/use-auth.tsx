import { authApi } from "@/apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const loginMutation =  useMutation({
        mutationFn: authApi.login,
    })
    const refreshTokensMutation = useMutation({
        mutationFn: authApi.refreshTokens,
    })
    const createWarehouseWorkerMutation = useMutation({
        mutationFn: authApi.createWarehouseWorker,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    })
    return {
        loginMutation,
        refreshTokensMutation,
        createWarehouseWorkerMutation,
    }
}
