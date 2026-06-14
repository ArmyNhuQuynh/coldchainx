import { vehicleApi } from "@/apis/vehicle.api";
import { handleApiError } from "@/lib/error";
import type {
  TVehicle,
  TVehicleCreateRequest,
  TVehicleFormValues,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import { VehicleFormSchema } from "@/schemas/vehicle.schema";
import { VEHICLE_STATUS } from "@/types/enums/vehicle-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type VehicleFormPayload = TVehicleCreateRequest | TVehicleUpdateRequest;

type UseVehicleFormProps = {
  vehicle?: TVehicle;
  onSubmit: (payload: VehicleFormPayload) => Promise<void> | void;
};

const getVehicleFormDefaultValues = (vehicle?: TVehicle): TVehicleFormValues => ({
  truckPlate: vehicle?.truckPlate ?? null,
  brand: vehicle?.brand ?? null,
  manufactureYear: vehicle?.manufactureYear ?? null,
  chassisNumber: vehicle?.chassisNumber ?? null,
  engineNumber: vehicle?.engineNumber ?? null,
  standardFuelLiters: vehicle?.standardFuelLiters ?? null,
  vehicleType: vehicle?.vehicleType ?? null,
  maxWeight: vehicle?.maxWeight ?? null,
  maxCbm: vehicle?.maxCbm ?? null,
  minTemp: vehicle?.minTemp ?? null,
  maxTemp: vehicle?.maxTemp ?? null,
  status: vehicle?.status ?? VEHICLE_STATUS.ACTIVE,
});

const toVehiclePayload = (values: TVehicleFormValues): VehicleFormPayload => ({
  truckPlate: values.truckPlate,
  brand: values.brand,
  manufactureYear: values.manufactureYear,
  chassisNumber: values.chassisNumber,
  engineNumber: values.engineNumber,
  standardFuelLiters: values.standardFuelLiters,
  vehicleType: values.vehicleType,
  maxWeight: values.maxWeight!,
  maxCbm: values.maxCbm!,
  minTemp: values.minTemp!,
  maxTemp: values.maxTemp!,
  status: values.status,
});

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

export const useVehicleForm = ({ vehicle, onSubmit }: UseVehicleFormProps) => {
  const form = useForm<TVehicleFormValues>({
    resolver: zodResolver(VehicleFormSchema),
    defaultValues: getVehicleFormDefaultValues(vehicle),
  });

  useEffect(() => {
    form.reset(getVehicleFormDefaultValues(vehicle));
  }, [form, vehicle]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(toVehiclePayload(values));
    } catch (error) {
      handleApiError(error);
    }
  });

  return {
    form,
    handleSubmit,
  };
};
