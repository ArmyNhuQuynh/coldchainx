import { handleApiError } from "@/lib/error";
import { getWarehouseFormDefaultValues } from "@/schemas/warehouse.mapper";
import type {
  TWarehouse,
  TWarehouseFormValues,
} from "@/schemas/warehouse.schema";
import { WarehouseFormSchema } from "@/schemas/warehouse.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseWarehouseFormProps = {
  warehouse?: TWarehouse;
  onSubmit: (values: TWarehouseFormValues) => Promise<void> | void;
};

export const useWarehouseForm = ({
  warehouse,
  onSubmit,
}: UseWarehouseFormProps) => {
  const form = useForm<TWarehouseFormValues>({
    resolver: zodResolver(WarehouseFormSchema),
    defaultValues: getWarehouseFormDefaultValues(warehouse),
  });

  useEffect(() => {
    form.reset(getWarehouseFormDefaultValues(warehouse));
  }, [form, warehouse]);

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
