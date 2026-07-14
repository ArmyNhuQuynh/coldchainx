import { useRoute } from "@/hooks/use-route";
import { useRouteForm } from "@/hooks/use-route-form";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { toCreateRouteRequest } from "@/schemas/route.mapper";
import type { TRouteFormValues } from "@/schemas/route.schema";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RouteForm from "./components/route-form";

const CreateRoutePage = () => {
  const navigate = useNavigate();
  const { createRoute } = useRoute();

  const handleSubmit = async (values: TRouteFormValues) => {
    const response = await createRoute.mutateAsync(toCreateRouteRequest(values));
    const routeId = response.data?.routeId;

    toast.success("Tạo tuyến thành công");
    navigate(
      routeId
        ? PATH_ADMIN_DASHBOARD.route.detail(routeId)
        : PATH_ADMIN_DASHBOARD.route.root
    );
  };

  const routeForm = useRouteForm({ onSubmit: handleSubmit });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CirclePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Thêm tuyến mới</h1>
              <p className="text-muted-foreground">
                Khai báo tuyến vận chuyển để Sale chọn order và Dispatcher điều phối.
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.route.root)}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <RouteForm
        mode="create"
        form={routeForm.form}
        isSubmitting={createRoute.isPending}
        onCancel={() => navigate(PATH_ADMIN_DASHBOARD.route.root)}
        onSubmit={routeForm.handleSubmit}
      />
    </div>
  );
};

export default CreateRoutePage;
