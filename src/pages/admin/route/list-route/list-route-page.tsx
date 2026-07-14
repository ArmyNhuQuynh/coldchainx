import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRoute } from "@/hooks/use-route";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import {
  ROUTE_LIST_DEFAULT_PARAMS,
  type TRouteListParams,
} from "@/schemas/route.schema";
import {
  normalizeRouteStatus,
  ROUTE_STATUS,
} from "@/types/enums/route-status.enum";
import {
  ArrowRightLeft,
  CheckCircle,
  CirclePlusIcon,
  MapPin,
  Route,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteFilterBar from "./components/route-filter-bar";
import RouteTable from "./components/route-table";

const ListRoutePage = () => {
  const navigate = useNavigate();
  const { getRoutes } = useRoute();
  const [filters, setFilters] = useState(ROUTE_LIST_DEFAULT_PARAMS);

  const queryParams: TRouteListParams = useMemo(
    () => ({
      ...filters,
      originCity: filters.originCity?.trim() || undefined,
      destCity: filters.destCity?.trim() || undefined,
    }),
    [filters]
  );

  const { data, isFetching, refetch } = getRoutes(queryParams);
  const routes = data?.data ?? [];
  const totalItems = routes.length;
  const pageSize = filters.pageSize;
  const currentPage = filters.pageNumber;
  const pageStart = (currentPage - 1) * pageSize;
  const pagedRoutes = routes.slice(pageStart, pageStart + pageSize);

  const updateFilters = (updates: Partial<TRouteListParams>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const routeStats = [
    {
      title: "Tổng tuyến",
      value: totalItems,
      color: "text-foreground",
      icon: Route,
    },
    {
      title: "Trang hiện tại",
      value: pagedRoutes.length,
      color: "text-blue-500",
      icon: MapPin,
    },
    {
      title: "Hoạt động",
      value: routes.filter(
        (route) => normalizeRouteStatus(route.status) === ROUTE_STATUS.ACTIVE
      ).length,
      color: "text-green-500",
      icon: CheckCircle,
    },
    {
      title: "Ngừng hoạt động",
      value: routes.filter(
        (route) => normalizeRouteStatus(route.status) === ROUTE_STATUS.INACTIVE
      ).length,
      color: "text-slate-500",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý tuyến</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý tuyến vận chuyển nền, điểm đi/đến, thời gian vận chuyển và điểm dừng
          </p>
        </div>
        <Button
          className="rounded-xl"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.route.create)}
        >
          <CirclePlusIcon className="mr-2 h-4 w-4" />
          Thêm tuyến
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {routeStats.map((item) => (
          <Card
            key={item.title}
            className="flex flex-col items-center justify-center rounded-2xl px-4 py-6"
          >
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-5 w-5" />
              <p className="text-sm">{item.title}</p>
            </div>
            <h2 className={`text-4xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </Card>
        ))}
      </div>

      <RouteFilterBar
        originCity={filters.originCity ?? ""}
        destCity={filters.destCity ?? ""}
        status={filters.status}
        isLoading={isFetching}
        onOriginCityChange={(originCity) =>
          updateFilters({ originCity, pageNumber: 1 })
        }
        onDestCityChange={(destCity) =>
          updateFilters({ destCity, pageNumber: 1 })
        }
        onStatusChange={(status) =>
          updateFilters({
            status: status as TRouteListParams["status"],
            pageNumber: 1,
          })
        }
        onReset={() => setFilters(ROUTE_LIST_DEFAULT_PARAMS)}
        onRefresh={() => refetch()}
      />

      <RouteTable
        routes={pagedRoutes}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isFetching}
        onPageChange={(pageNumber) => updateFilters({ pageNumber })}
        onPageSizeChange={(pageSize) =>
          updateFilters({ pageSize, pageNumber: 1 })
        }
        onRowClick={(route) =>
          navigate(PATH_ADMIN_DASHBOARD.route.detail(route.routeId))
        }
      />
    </div>
  );
};

export default ListRoutePage;
