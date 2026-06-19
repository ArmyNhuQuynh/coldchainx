import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TQuotationFormValues } from "@/schemas/quotation.schema";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<TQuotationFormValues>;
};

const ShipmentQuotationAdditionalCharges = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalCharges",
  });

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Phụ phí bổ sung</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", amount: 0, note: "" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm phụ phí
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">
          Chưa có phụ phí bổ sung
        </p>
      ) : (
        fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-2.5 rounded-md border p-2.5 lg:grid-cols-[1fr_140px_1fr_auto]"
          >
            <FormField
              control={form.control}
              name={`additionalCharges.${index}.name`}
              render={({ field: nameField }) => (
                <FormItem>
                  <FormLabel>Tên phụ phí</FormLabel>
                  <FormControl>
                    <Input {...nameField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalCharges.${index}.amount`}
              render={({ field: amountField }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...amountField}
                      onChange={(event) =>
                        amountField.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalCharges.${index}.note`}
              render={({ field: noteField }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Input {...noteField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="self-end text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default ShipmentQuotationAdditionalCharges;
