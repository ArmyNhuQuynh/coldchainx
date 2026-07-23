import { iotDeviceApi } from "@/apis/iot-device.api";
import { monitoringApi } from "@/apis/monitoring.api";
import type {
  TIotDeviceAssignRequest,
  TIotDeviceCreateRequest,
  TIotDeviceUpdateRequest,
} from "@/schemas/iot-device.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useIotDevice = () => {
  const queryClient = useQueryClient();

  const getIotDevices = () =>
    useQuery({
      queryKey: ["iot-devices"],
      queryFn: iotDeviceApi.getIotDevices,
      placeholderData: keepPreviousData,
    });

  const getIotDeviceById = (id?: string) =>
    useQuery({
      queryKey: ["iot-device", id],
      queryFn: () => iotDeviceApi.getIotDeviceById(id!),
      enabled: !!id,
    });

  const createIotDevice = useMutation({
    mutationFn: (data: TIotDeviceCreateRequest) =>
      iotDeviceApi.createIotDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iot-devices"] });
    },
  });

  const updateIotDevice = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TIotDeviceUpdateRequest;
    }) => iotDeviceApi.updateIotDevice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["iot-devices"] });
      queryClient.invalidateQueries({ queryKey: ["iot-device", id] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const assignIotDevice = useMutation({
    mutationFn: ({
      data,
    }: {
      deviceId: string;
      data: TIotDeviceAssignRequest;
    }) => monitoringApi.assignDevice(data),
    onSuccess: (_, { deviceId }) => {
      queryClient.invalidateQueries({ queryKey: ["iot-devices"] });
      queryClient.invalidateQueries({
        queryKey: ["iot-device", deviceId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteIotDevice = useMutation({
    mutationFn: (id: string) => iotDeviceApi.deleteIotDevice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["iot-devices"] });
      queryClient.invalidateQueries({ queryKey: ["iot-device", id] });
    },
  });

  return {
    getIotDevices,
    getIotDeviceById,
    createIotDevice,
    updateIotDevice,
    assignIotDevice,
    deleteIotDevice,
  };
};
