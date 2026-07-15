import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRoute } from "@/hooks/use-route";
import { cn } from "@/lib/utils";
import { ROUTE_LIST_DEFAULT_PARAMS } from "@/schemas/route.schema";
import type { TRoute } from "@/schemas/route.schema";
import { getRouteStatusLabel } from "@/types/enums/route-status.enum";
import { useEffect, useMemo, useState } from "react";
import RoutePricingCard from "./route-pricing/route-pricing-card";

const RoutePricingTab = () => {
  const { getRoutes } = useRoute();
  const [search, setSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const routeParams = useMemo(
    () => ({ ...ROUTE_LIST_DEFAULT_PARAMS, pageSize: 200 }),
    []
  );
  const routesQuery = getRoutes(routeParams);
  const routes = routesQuery.data?.data ?? [];

  const filteredRoutes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return routes;

    return routes.filter((route) =>
      [
        route.routeCode,
        route.originCity,
        route.destCity,
        route.transitTime,
        route.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [routes, search]);

  useEffect(() => {
    if (!selectedRouteId && filteredRoutes.length > 0) {
      setSelectedRouteId(filteredRoutes[0].routeId);
      return;
    }

    if (
      selectedRouteId &&
      routes.length > 0 &&
      !routes.some((route) => route.routeId === selectedRouteId)
    ) {
      setSelectedRouteId(routes[0].routeId);
    }
  }, [filteredRoutes, routes, selectedRouteId]);

  const selectedRoute =
    routes.find((route) => route.routeId === selectedRouteId) ?? null;

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="rounded-lg">
        <CardHeader className="border-b pb-4">
          <h2 className="text-lg font-semibold">Danh sách tuyến</h2>
          <p className="text-sm text-muted-foreground">
            Chọn tuyến để chỉnh bảng giá cân nặng.
          </p>
          <Input
            value={search}
            placeholder="Tìm mã tuyến, điểm đi, điểm đến..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </CardHeader>
        <CardContent className="max-h-[620px] space-y-2 overflow-y-auto pt-4">
          {routesQuery.isFetching && (
            <div className="rounded-md border px-3 py-6 text-center text-sm text-muted-foreground">
              Đang tải tuyến...
            </div>
          )}

          {!routesQuery.isFetching && filteredRoutes.length === 0 && (
            <div className="rounded-md border px-3 py-6 text-center text-sm text-muted-foreground">
              Không có tuyến phù hợp.
            </div>
          )}

          {!routesQuery.isFetching &&
            filteredRoutes.map((route) => (
              <RouteOption
                key={route.routeId}
                route={route}
                selected={route.routeId === selectedRouteId}
                onClick={() => setSelectedRouteId(route.routeId)}
              />
            ))}
        </CardContent>
      </Card>

      {selectedRoute ? (
        <RoutePricingCard
          routeId={selectedRoute.routeId}
          routeLabel={`${selectedRoute.routeCode} · ${selectedRoute.originCity} → ${selectedRoute.destCity}`}
        />
      ) : (
        <Card className="rounded-lg">
          <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
            Chọn một tuyến để xem bảng giá.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

type RouteOptionProps = {
  route: TRoute;
  selected: boolean;
  onClick: () => void;
};

const RouteOption = ({ route, selected, onClick }: RouteOptionProps) => {
  const status = getRouteStatusLabel(route.status);

  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-md border px-3 py-3 text-left transition hover:border-primary/60 hover:bg-muted/40",
        selected && "border-primary bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{route.routeCode}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {route.originCity} → {route.destCity}
          </p>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Thời gian vận chuyển: {route.transitTime}
      </p>
    </button>
  );
};

export default RoutePricingTab;
