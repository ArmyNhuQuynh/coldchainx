import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  QuotationFormSchema,
  type TQuotation,
  type TQuotationFormValues,
  type TUpdateQuotation,
} from "@/schemas/quotation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ShipmentQuotationAdditionalCharges from "./shipment-quotation-additional-charges";

type Props = {
  quotation: TQuotation;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: TUpdateQuotation) => Promise<void>;
};

const getDefaultValues = (quotation: TQuotation): TQuotationFormValues => ({
  baseFreight: quotation.baseFreight,
  lastMileSurcharge: quotation.lastMileSurcharge,
  vatPercentage: quotation.vatPercentage ?? 8,
  additionalCharges: quotation.additionalCharges.map((charge) => ({
    name: charge.name,
    amount: charge.amount,
    note: charge.note ?? "",
  })),
  overrideReason: quotation.overrideReason ?? "",
});

const ShipmentQuotationForm = ({ quotation, isPending, onCancel, onSubmit }: Props) => {
  const form = useForm<TQuotationFormValues>({
    resolver: zodResolver(QuotationFormSchema),
    defaultValues: getDefaultValues(quotation),
  });
  useEffect(() => {
    form.reset(getDefaultValues(quotation));
  }, [form, quotation]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      baseFreight: values.baseFreight,
      lastMileSurcharge: values.lastMileSurcharge,
      vatPercentage: values.vatPercentage,
      additionalCharges: values.additionalCharges.map((charge) => ({
        name: charge.name,
        amount: charge.amount,
        note: charge.note || null,
      })),
      overrideReason: values.overrideReason || null,
    });
  });

  const numberFieldValue = (value: number | null) => value ?? "";
  const parseNullableNumber = (value: string) => (value === "" ? null : Number(value));

  return (
    <>
      <DialogHeader>
        <DialogTitle>Chỉnh sửa báo giá</DialogTitle>
        <DialogDescription>
          Cập nhật các giá trị được BE cho phép đối với báo giá DRAFT.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="baseFreight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cước cơ bản</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastMileSurcharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phụ phí chặng cuối</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={numberFieldValue(field.value)}
                      onChange={(event) => field.onChange(parseNullableNumber(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vatPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={20} {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ShipmentQuotationAdditionalCharges form={form} />

          <FormField
            control={form.control}
            name="overrideReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lý do điều chỉnh</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Nhập lý do điều chỉnh báo giá..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ShipmentQuotationForm;
