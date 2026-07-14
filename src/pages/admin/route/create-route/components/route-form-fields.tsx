import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TRouteFormValues } from "@/schemas/route.schema";
import type { Control, FieldPath } from "react-hook-form";

type FieldProps = {
  control: Control<TRouteFormValues>;
  name: FieldPath<TRouteFormValues>;
  label: string;
  placeholder?: string;
  description?: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = FieldProps & {
  options: SelectOption[];
};

export const RouteTextField = ({
  control,
  name,
  label,
  placeholder,
  description,
}: FieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className="h-11 rounded-xl bg-background/60"
              placeholder={placeholder}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const RouteSelectField = ({
  control,
  name,
  label,
  placeholder,
  description,
  options,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={typeof field.value === "string" ? field.value : undefined}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="h-11 w-full rounded-xl bg-background/60">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="min-h-0">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
