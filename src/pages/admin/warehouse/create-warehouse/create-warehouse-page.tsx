import { useWarehouse } from "@/hooks/use-warehouse";
import { useWarehouseForm } from "@/hooks/use-warehouse-form";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toWarehouseRequest } from "@/schemas/warehouse.mapper";
import type { TWarehouseFormValues } from "@/schemas/warehouse.schema";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WarehouseForm from "./components/warehouse-form";

const CreateWarehousePage = () => {
  const navigate = useNavigate();
  const { createWarehouse } = useWarehouse();

  const handleSubmit = async (values: TWarehouseFormValues) => {
    const response = await createWarehouse.mutateAsync(toWarehouseRequest(values));
    const warehouseId = response.data.warehouseId;

    toast.success("Tạo kho thành công");
    navigate(
      warehouseId
        ? PATH_ADMIN_DASHBOARD.warehouse.detail(warehouseId)
        : PATH_ADMIN_DASHBOARD.warehouse.root
    );
  };

  const warehouseForm = useWarehouseForm({ onSubmit: handleSubmit });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CirclePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Thêm kho mới</h1>
              <p className="text-muted-foreground">
                Khai báo kho lưu trữ và cấu hình vận hành ban đầu.
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.root)}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <WarehouseForm
        mode="create"
        form={warehouseForm.form}
        isSubmitting={createWarehouse.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.root)}
        onSubmit={warehouseForm.handleSubmit}
      />
    </div>
  );
};

export default CreateWarehousePage;
