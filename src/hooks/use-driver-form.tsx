import { handleApiError } from "@/lib/error";
import {
  getDriverFormDefaultValues,
  type DriverFormMode,
} from "@/schemas/driver.mapper";
import {
  DriverFormSchema,
  type TDriver,
  type TDriverFormValues,
} from "@/schemas/driver.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseDriverFormProps = {
  mode: DriverFormMode;
  driver?: TDriver;
  onSubmit: (values: TDriverFormValues) => Promise<void> | void;
};

export const useDriverForm = ({
  mode,
  driver,
  onSubmit,
}: UseDriverFormProps) => {
  const form = useForm<TDriverFormValues>({
    resolver: zodResolver(DriverFormSchema),
    defaultValues: getDriverFormDefaultValues(mode, driver),
  });

  useEffect(() => {
    form.reset(getDriverFormDefaultValues(mode, driver));
  }, [driver, form, mode]);

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
