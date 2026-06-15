import { handleApiError } from "@/lib/error";
import type {
  TVehicle,
  TVehicleFormValues,
} from "@/schemas/vehicle.schema";
import { VehicleFormSchema } from "@/schemas/vehicle.schema";
import { getVehicleFormDefaultValues } from "@/schemas/vehicle.mapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseVehicleFormProps = {
  vehicle?: TVehicle;
  onSubmit: (values: TVehicleFormValues) => Promise<void> | void;
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
      await onSubmit(values);
    } catch (error) {
      handleApiError(error);
    }
  });

  return {
    form,
    handleSubmit,
  };
};
