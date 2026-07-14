import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TWeightTier } from "@/schemas/weight-tier.schema";
import { Pencil, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatWeightTierRange,
} from "./route-pricing.utils";

type Props = {
  tiers: TWeightTier[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (tier: TWeightTier) => void;
  onDelete: (tier: TWeightTier) => void;
};

const RoutePricingTable = ({
  tiers,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}: Props) => (
  <div className="overflow-hidden rounded-md border">
    <Table>
      <TableHeader className="bg-muted/40">
        <TableRow>
          <TableHead>Khoảng cân tính phí</TableHead>
          <TableHead className="text-right">Giá/kg</TableHead>
          <TableHead className="w-[150px] text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell
              colSpan={3}
              className="h-24 text-center text-muted-foreground"
            >
              Đang tải bảng giá...
            </TableCell>
          </TableRow>
        )}

        {!isLoading && tiers.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={3}
              className="h-24 text-center text-muted-foreground"
            >
              Chưa có mức giá nào cho tuyến này.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          tiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">
                {formatWeightTierRange(tier)}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(tier.pricePerKg)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tier)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() => onDelete(tier)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </div>
);

export default RoutePricingTable;
