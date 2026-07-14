import { useRoute } from "@/hooks/use-route";
import { useRouteForm } from "@/hooks/use-route-form";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toUpdateRouteRequest } from "@/schemas/route.mapper";
import type { TRouteFormValues } from "@/schemas/route.schema";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import RouteForm from "../create-route/components/route-form";

const EditRoutePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getRouteById, updateRoute } = useRoute();
  const { data, isLoading } = getRouteById(id);

  const route = data?.data;

  const handleSubmit = async (values: TRouteFormValues) => {
    if (!id) return;

    await updateRoute.mutateAsync({
      id,
      data: toUpdateRouteRequest(values),
    });
    toast.success("Cập nhật tuyến thành công");
    navigate(PATH_ADMIN_DASHBOARD.route.detail(id));
  };

  const routeForm = useRouteForm({ route, onSubmit: handleSubmit });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!route || !id) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy tuyến
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
              <h1 className="text-3xl font-semibold">Chỉnh sửa tuyến</h1>
              <p className="text-muted-foreground">
                {route.routeCode || route.routeId}
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.route.detail(id))}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <RouteForm
        mode="edit"
        form={routeForm.form}
        isSubmitting={updateRoute.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.route.detail(id))}
        onSubmit={routeForm.handleSubmit}
      />
    </div>
  );
};

export default EditRoutePage;
