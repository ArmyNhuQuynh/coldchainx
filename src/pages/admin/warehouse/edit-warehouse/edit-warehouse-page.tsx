import { useWarehouse } from "@/hooks/use-warehouse";
import { useWarehouseForm } from "@/hooks/use-warehouse-form";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toWarehouseRequest } from "@/schemas/warehouse.mapper";
import type { TWarehouseFormValues } from "@/schemas/warehouse.schema";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import WarehouseForm from "../create-warehouse/components/warehouse-form";

const EditWarehousePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getWarehouseById, updateWarehouse } = useWarehouse();
  const { data, isLoading } = getWarehouseById(id);

  const warehouse = data?.data;

  const handleSubmit = async (values: TWarehouseFormValues) => {
    if (!id) return;

    await updateWarehouse.mutateAsync({
      id,
      data: toWarehouseRequest(values),
    });
    toast.success("Cập nhật kho thành công");
    navigate(PATH_ADMIN_DASHBOARD.warehouse.detail(id));
  };

  const warehouseForm = useWarehouseForm({ warehouse, onSubmit: handleSubmit });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!warehouse || !id) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy kho
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Chỉnh sửa kho</h1>
              <p className="text-muted-foreground">
                {warehouse.warehouseCode || warehouse.warehouseId}
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.detail(id))}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <WarehouseForm
        mode="edit"
        form={warehouseForm.form}
        isSubmitting={updateWarehouse.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.detail(id))}
        onSubmit={warehouseForm.handleSubmit}
      />
    </div>
  );
};

export default EditWarehousePage;
