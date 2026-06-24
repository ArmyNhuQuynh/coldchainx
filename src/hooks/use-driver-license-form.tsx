import { handleApiError } from "@/lib/error";
import { getDriverLicenseFormDefaultValues } from "@/schemas/driver.mapper";
import {
  DriverLicenseRequestSchema,
  type TDriverLicense,
  type TDriverLicenseRequest,
} from "@/schemas/driver.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseDriverLicenseFormProps = {
  license?: TDriverLicense | null;
  onSubmit: (values: TDriverLicenseRequest) => Promise<void> | void;
};

export const useDriverLicenseForm = ({
  license,
  onSubmit,
}: UseDriverLicenseFormProps) => {
  const form = useForm<TDriverLicenseRequest>({
    resolver: zodResolver(DriverLicenseRequestSchema),
    defaultValues: getDriverLicenseFormDefaultValues(license),
  });

  useEffect(() => {
    form.reset(getDriverLicenseFormDefaultValues(license));
  }, [form, license]);

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
