import { vehicleApi } from "@/apis/vehicle.api";
import type {
  TVehicleCreateRequest,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useVehicle = () => {
  const queryClient = useQueryClient();

  const getVehicles = () => {
    return useQuery({
      queryKey: ["vehicles"],
      queryFn: vehicleApi.getVehicles,
      placeholderData: keepPreviousData,
    });
  };

  const getVehicleById = (id?: string) => {
    return useQuery({
      queryKey: ["vehicle", id],
      queryFn: () => vehicleApi.getVehicleById(id!),
      enabled: !!id,
    });
  };

  const createVehicle = useMutation({
    mutationFn: (data: TVehicleCreateRequest) => vehicleApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TVehicleUpdateRequest;
    }) => vehicleApi.updateVehicle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
