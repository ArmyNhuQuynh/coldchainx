import { useRoute } from "@/hooks/use-route";
import { useParams } from "react-router-dom";
import RouteDetailHeader from "./components/route-detail-header";
import RouteDetailInfo from "./components/route-detail-info";
import RouteOriginWarehousesCard from "./components/route-origin-warehouses-card";
import RouteStopsCard from "./components/route-stops-card";

const DetailRoutePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getRouteById, getRouteOriginWarehouses } = useRoute();
  const { data, isLoading } = getRouteById(id);
  const originWarehousesQuery = getRouteOriginWarehouses(id);

  const route = data?.data;

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
      <RouteDetailHeader route={route} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RouteDetailInfo route={route} />
          <RouteStopsCard routeId={id} />
        </div>
        <div>
          <RouteOriginWarehousesCard
            warehouses={originWarehousesQuery.data?.data ?? []}
            isLoading={originWarehousesQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailRoutePage;
