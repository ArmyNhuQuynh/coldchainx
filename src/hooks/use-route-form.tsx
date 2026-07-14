import { getRouteFormDefaultValues } from "@/schemas/route.mapper";
import type { TRoute, TRouteFormValues } from "@/schemas/route.schema";
import { RouteFormSchema } from "@/schemas/route.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UseRouteFormProps = {
  route?: TRoute;
  onSubmit: (values: TRouteFormValues) => Promise<void> | void;
};

export const useRouteForm = ({ route, onSubmit }: UseRouteFormProps) => {
  const form = useForm<TRouteFormValues>({
    resolver: zodResolver(RouteFormSchema),
    defaultValues: getRouteFormDefaultValues(route),
  });

  useEffect(() => {
    form.reset(getRouteFormDefaultValues(route));
  }, [form, route]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    handleSubmit,
  };
};
