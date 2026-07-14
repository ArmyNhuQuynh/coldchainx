import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoute } from "@/hooks/use-route";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TRoute } from "@/schemas/route.schema";
import { getRouteStatusLabel } from "@/types/enums/route-status.enum";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  route: TRoute;
};

const RouteDetailHeader = ({ route }: Props) => {
  const navigate = useNavigate();
  const { deleteRoute } = useRoute();
  const status = getRouteStatusLabel(route.status);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Xóa tuyến ${route.routeCode}?`);
    if (!confirmed) return;

    try {
      await deleteRoute.mutateAsync(route.routeId);
      toast.success("Xóa tuyến thành công");
      navigate(PATH_ADMIN_DASHBOARD.route.root);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">Chi tiết tuyến</h1>
          <span className="rounded-md border bg-muted/30 px-2.5 py-1 text-sm font-semibold text-primary">
            {route.routeCode || route.routeId}
          </span>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <p className="text-base font-medium">
          {route.originCity} → {route.destCity}
        </p>
        <p className="text-sm text-muted-foreground">
          Thời gian vận chuyển dự kiến: {route.transitTime || "—"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.route.root)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          disabled={deleteRoute.isPending}
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
        <Button
          onClick={() =>
            navigate(PATH_ADMIN_DASHBOARD.route.edit(route.routeId))
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default RouteDetailHeader;
