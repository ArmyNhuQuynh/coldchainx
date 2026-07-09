import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { iotApi } from "@/apis/iot.api";
import { toast } from "sonner";

export const useIot = () => {
  const queryClient = useQueryClient();

  const getIotDevices = () =>
    useQuery({
      queryKey: ["iot-devices"],
      queryFn: iotApi.getIotDevices,
    });

  const assignIotDevice = useMutation({
    mutationFn: ({ vehicleId, deviceId }: { vehicleId: string; deviceId: string }) =>
      iotApi.assignIotDevice(vehicleId, deviceId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Gán thiết bị IoT thành công");
        queryClient.invalidateQueries({ queryKey: ["iot-devices"] });
        queryClient.invalidateQueries({ queryKey: ["vehicle"] });
      } else {
        toast.error(res.message || "Gán thiết bị thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi hệ thống khi gán thiết bị");
    },
  });

  return {
    getIotDevices,
    assignIotDevice,
  };
};
