import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWeightTier } from "@/hooks/use-weight-tier";
import { handleApiError } from "@/lib/error";
import {
  WeightTierFormSchema,
  type TWeightTier,
} from "@/schemas/weight-tier.schema";
import { CirclePlus, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import RoutePricingDialog from "./route-pricing/route-pricing-dialog";
import RoutePricingSummary from "./route-pricing/route-pricing-summary";
import RoutePricingTable from "./route-pricing/route-pricing-table";
import {
  collectWeightTierFormErrors,
  EMPTY_WEIGHT_TIER_FORM,
  formatWeightTierRange,
  getCoverageNotes,
  parseWeightTierForm,
  toWeightTierFormState,
  type WeightTierFormErrors,
  type WeightTierFormState,
} from "./route-pricing/route-pricing.utils";

type Props = {
  routeId: string;
};

const RoutePricingCard = ({ routeId }: Props) => {
  const {
    getWeightTiersByRoute,
    createWeightTier,
    updateWeightTier,
    deleteWeightTier,
  } = useWeightTier();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TWeightTier | null>(null);
  const [formValues, setFormValues] = useState<WeightTierFormState>(
    EMPTY_WEIGHT_TIER_FORM
  );
  const [formErrors, setFormErrors] = useState<WeightTierFormErrors>({});

  const tiersQuery = getWeightTiersByRoute(routeId);
  const tiers = useMemo(
    () =>
      [...(tiersQuery.data?.data ?? [])].sort(
        (left, right) => left.minWeightKg - right.minWeightKg
      ),
    [tiersQuery.data?.data]
  );
  const coverageNotes = useMemo(() => getCoverageNotes(tiers), [tiers]);
  const isHealthy = coverageNotes.length === 0;
  const isSubmitting = createWeightTier.isPending || updateWeightTier.isPending;

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingTier(null);
    setFormValues(EMPTY_WEIGHT_TIER_FORM);
    setFormErrors({});
  };

  const openCreateDialog = () => {
    setEditingTier(null);
    setFormValues({
      ...EMPTY_WEIGHT_TIER_FORM,
      minWeightKg: String(getSuggestedMinWeight(tiers)),
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (tier: TWeightTier) => {
    setEditingTier(tier);
    setFormValues(toWeightTierFormState(tier));
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
      return;
    }
    if (!isSubmitting) resetDialog();
  };

  const handleFieldChange = (
    field: keyof WeightTierFormState,
    value: string
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const rawValues = parseWeightTierForm(formValues);
    const numericErrors = getNumericErrors(rawValues);

    if (Object.keys(numericErrors).length > 0) {
      setFormErrors(numericErrors);
      return;
    }

    const parsed = WeightTierFormSchema.safeParse(rawValues);

    if (!parsed.success) {
      setFormErrors(collectWeightTierFormErrors(parsed.error.issues));
      return;
    }

    try {
      if (editingTier) {
        await updateWeightTier.mutateAsync({
          id: editingTier.id,
          data: { routeId, ...parsed.data },
        });
        toast.success("Cập nhật mức giá thành công");
      } else {
        await createWeightTier.mutateAsync({ routeId, ...parsed.data });
        toast.success("Thêm mức giá thành công");
      }

      resetDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (tier: TWeightTier) => {
    const confirmed = window.confirm(
      `Xóa mức giá ${formatWeightTierRange(tier)}?`
    );
    if (!confirmed) return;

    try {
      await deleteWeightTier.mutateAsync({ id: tier.id, routeId });
      toast.success("Xóa mức giá thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Card className="rounded-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Bảng giá theo cân nặng</h2>
              <Badge
                className={
                  isHealthy
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }
              >
                {isHealthy ? "Đủ dữ liệu" : "Cần kiểm tra"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Các mức giá này được dùng để tính báo giá tự động cho order thuộc tuyến.
            </p>
          </div>
          <Button className="rounded-md" onClick={openCreateDialog}>
            <CirclePlus className="mr-2 h-4 w-4" />
            Thêm mức giá
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <RoutePricingSummary tiers={tiers} />
        <RoutePricingTable
          tiers={tiers}
          isLoading={tiersQuery.isFetching}
          isDeleting={deleteWeightTier.isPending}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      </CardContent>

      <RoutePricingDialog
        open={dialogOpen}
        editingTier={editingTier}
        formValues={formValues}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        onOpenChange={handleDialogOpenChange}
        onFieldChange={handleFieldChange}
        onCancel={resetDialog}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

const getSuggestedMinWeight = (tiers: TWeightTier[]) => {
  const lastTier = tiers[tiers.length - 1];
  if (lastTier?.maxWeightKg !== null && lastTier?.maxWeightKg !== undefined) {
    return lastTier.maxWeightKg;
  }
  return 0;
};

const getNumericErrors = (
  values: ReturnType<typeof parseWeightTierForm>
): WeightTierFormErrors => {
  const errors: WeightTierFormErrors = {};

  if (Number.isNaN(values.minWeightKg)) {
    errors.minWeightKg = "Vui lòng nhập mốc cân tối thiểu";
  }

  if (values.maxWeightKg !== null && Number.isNaN(values.maxWeightKg)) {
    errors.maxWeightKg = "Mốc cân tối đa không hợp lệ";
  }

  if (Number.isNaN(values.pricePerKg)) {
    errors.pricePerKg = "Vui lòng nhập giá/kg";
  }

  return errors;
};

export default RoutePricingCard;
