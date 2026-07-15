import type { TWeightTier } from "@/schemas/weight-tier.schema";
import { formatCurrency } from "./route-pricing.utils";

type Props = {
  tiers: TWeightTier[];
};

const RoutePricingSummary = ({ tiers }: Props) => {
  const minPrice = tiers.length
    ? Math.min(...tiers.map((tier) => tier.pricePerKg))
    : null;
  const maxPrice = tiers.length
    ? Math.max(...tiers.map((tier) => tier.pricePerKg))
    : null;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SummaryItem label="Số mức giá" value={tiers.length} />
      <SummaryItem
        label="Giá thấp nhất"
        value={minPrice === null ? "-" : formatCurrency(minPrice)}
      />
      <SummaryItem
        label="Giá cao nhất"
        value={maxPrice === null ? "-" : formatCurrency(maxPrice)}
      />
    </div>
  );
};

type SummaryItemProps = {
  label: string;
  value: string | number;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => (
  <div className="rounded-md border bg-muted/20 px-3 py-2">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-lg font-semibold">{value}</p>
  </div>
);

export default RoutePricingSummary;
