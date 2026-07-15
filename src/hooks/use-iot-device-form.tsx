import { handleApiError } from "@/lib/error";
import { getIotDeviceFormDefaultValues } from "@/schemas/iot-device.mapper";
import {
  IotDeviceFormSchema,
  type TIotDevice,
  type TIotDeviceFormValues,
} from "@/schemas/iot-device.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseIotDeviceFormProps = {
  device?: TIotDevice;
  onSubmit: (values: TIotDeviceFormValues) => Promise<void> | void;
};

export const useIotDeviceForm = ({
  device,
  onSubmit,
}: UseIotDeviceFormProps) => {
  const form = useForm<TIotDeviceFormValues>({
    resolver: zodResolver(IotDeviceFormSchema),
    defaultValues: getIotDeviceFormDefaultValues(device),
  });

  useEffect(() => {
    form.reset(getIotDeviceFormDefaultValues(device));
  }, [device, form]);

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
