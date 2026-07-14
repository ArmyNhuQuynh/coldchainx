import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWarehouse } from "@/hooks/use-warehouse";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TWarehouse } from "@/schemas/warehouse.schema";
import { getWarehouseStatusLabel } from "@/types/enums/warehouse-status.enum";
import { getWarehouseTypeLabel } from "@/types/enums/warehouse-type.enum";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  warehouse: TWarehouse;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const WarehouseDetailHeader = ({ warehouse }: Props) => {
  const navigate = useNavigate();
  const { deleteWarehouse } = useWarehouse();
  const status = hasValue(warehouse.status)
    ? getWarehouseStatusLabel(warehouse.status)
    : null;
  const summary = [
    warehouse.warehouseType
      ? getWarehouseTypeLabel(warehouse.warehouseType)
      : null,
    warehouse.address,
  ].filter(hasValue);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Xóa kho ${warehouse.warehouseCode || warehouse.warehouseName}?`
    );
    if (!confirmed) return;

    try {
      await deleteWarehouse.mutateAsync(warehouse.warehouseId);
      toast.success("Xóa kho thành công");
      navigate(PATH_ADMIN_DASHBOARD.warehouse.root);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Chi tiết kho</h1>
          <span className="text-2xl font-bold text-primary">
            {warehouse.warehouseCode || warehouse.warehouseId}
          </span>
          {status && <Badge className={status.className}>{status.label}</Badge>}
        </div>
        <p className="text-lg font-medium">{warehouse.warehouseName}</p>
        {summary.length > 0 && (
          <p className="text-muted-foreground">{summary.join(" • ")}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.root)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          disabled={deleteWarehouse.isPending}
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa
        </Button>
        <Button
          onClick={() =>
            navigate(PATH_ADMIN_DASHBOARD.warehouse.edit(warehouse.warehouseId))
          }
        >
          <Pencil className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default WarehouseDetailHeader;
