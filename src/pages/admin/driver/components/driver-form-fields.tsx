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
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type FieldProps<TValues extends FieldValues> = {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string;
  description?: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps<TValues extends FieldValues> = FieldProps<TValues> & {
  options: SelectOption[];
  emptyLabel?: string;
};

const EMPTY_SELECT_VALUE = "__empty__";

export const DriverTextField = <TValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
}: FieldProps<TValues>) => (
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

export const DriverDateField = <TValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: FieldProps<TValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type="date"
            className="h-11 rounded-xl bg-background/60"
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

export const DriverSelectField = <TValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  emptyLabel = "Chưa chọn",
}: SelectFieldProps<TValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select
          value={typeof field.value === "string" ? field.value : EMPTY_SELECT_VALUE}
          onValueChange={(value) =>
            field.onChange(value === EMPTY_SELECT_VALUE ? null : value)
          }
        >
          <FormControl>
            <SelectTrigger className="h-11 w-full rounded-xl bg-background/60">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="min-h-0">
            <SelectItem value={EMPTY_SELECT_VALUE}>{emptyLabel}</SelectItem>
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
