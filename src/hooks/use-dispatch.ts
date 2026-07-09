import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchApi } from "@/apis/dispatch.api";
import { toast } from "sonner";

export const useDispatchOperations = () => {
  const queryClient = useQueryClient();

  const checkVehicleIot = useMutation({
    mutationFn: ({ tripId, vehicleId }: { tripId: string; vehicleId: string }) =>
      dispatchApi.checkVehicleIot(tripId, vehicleId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Kiểm tra IoT thành công. Bắt đầu giám sát.");
        queryClient.invalidateQueries({ queryKey: ["tracking"] });
      } else {
        toast.error(res.message || "Lỗi kiểm tra IoT.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đã xảy ra lỗi");
    },
  });

  return {
    checkVehicleIot,
  };
};
