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
import type { TVehicleFormValues } from "@/schemas/vehicle.schema";
import type { Control, FieldPath } from "react-hook-form";

type FieldProps = {
  control: Control<TVehicleFormValues>;
  name: FieldPath<TVehicleFormValues>;
  label: string;
  placeholder?: string;
  description?: string;
};

type NumberFieldProps = FieldProps & {
  min?: number;
  step?: number;
  unit?: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = FieldProps & {
  options: SelectOption[];
  emptyLabel?: string;
};

const EMPTY_SELECT_VALUE = "__empty__";

export const VehicleTextField = ({
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

export const VehicleNumberField = ({
  control,
  name,
  label,
  placeholder,
  description,
  min,
  step = 1,
  unit,
}: NumberFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                inputMode="decimal"
                min={min}
                step={step}
                className="h-11 rounded-xl bg-background/60 pr-14"
                placeholder={placeholder}
                value={typeof field.value === "number" ? field.value : ""}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
              {unit && (
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const VehicleSelectField = ({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  emptyLabel = "Chưa chọn",
}: SelectFieldProps) => {
  return (
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
};

export const VehicleFileField = ({
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
              type="file"
              accept="image/*"
              className="h-11 rounded-xl bg-background/60 file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium"
              aria-label={placeholder ?? label}
              onChange={(event) => {
                field.onChange(event.target.files?.[0] ?? null);
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          {field.value instanceof File ? (
            <FormDescription>{field.value.name}</FormDescription>
          ) : (
            description && <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
