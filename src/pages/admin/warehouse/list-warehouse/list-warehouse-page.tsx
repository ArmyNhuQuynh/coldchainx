import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWarehouse } from "@/hooks/use-warehouse";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import {
  WAREHOUSE_LIST_DEFAULT_PARAMS,
  type TWarehouseListParams,
} from "@/schemas/warehouse.schema";
import {
  normalizeWarehouseStatus,
  WAREHOUSE_STATUS,
} from "@/types/enums/warehouse-status.enum";
import { Boxes, CirclePlusIcon, Warehouse, Wrench, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseFilterBar from "./components/warehouse-filter-bar";
import WarehouseTable from "./components/warehouse-table";

const ListWarehousePage = () => {
  const navigate = useNavigate();
  const { getWarehouseList } = useWarehouse();
  const [filters, setFilters] = useState(WAREHOUSE_LIST_DEFAULT_PARAMS);

  const params: TWarehouseListParams = useMemo(
    () => ({
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      search: filters.search?.trim() || undefined,
    }),
    [filters]
  );

  const { data, isFetching, refetch } = getWarehouseList(params);
  const response = data?.data;
  const warehouses = response?.data ?? [];
  const totalItems = response?.totalRecords ?? 0;

  const updateFilters = (updates: Partial<TWarehouseListParams>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const warehouseStats = [
    {
      title: "Tổng kho",
      value: totalItems,
      color: "text-foreground",
      icon: Warehouse,
    },
    {
      title: "Trang hiện tại",
      value: warehouses.length,
      color: "text-blue-500",
      icon: Boxes,
    },
    {
      title: "Hoạt động",
      value: warehouses.filter(
        (warehouse) =>
          normalizeWarehouseStatus(warehouse.status) === WAREHOUSE_STATUS.ACTIVE
      ).length,
      color: "text-green-500",
      icon: CheckCircle,
    },
    {
      title: "Bảo trì",
      value: warehouses.filter(
        (warehouse) =>
          normalizeWarehouseStatus(warehouse.status) ===
          WAREHOUSE_STATUS.MAINTENANCE
      ).length,
      color: "text-orange-500",
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý kho</h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi danh sách kho, sức chứa pallet, dải nhiệt và trạng thái vận hành
          </p>
        </div>
        <Button
          className="rounded-xl"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.warehouse.create)}
        >
          <CirclePlusIcon className="mr-2 h-4 w-4" />
          Thêm kho
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {warehouseStats.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl px-4 py-6 flex flex-col items-center justify-center"
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

      <WarehouseFilterBar
        search={filters.search ?? ""}
        isLoading={isFetching}
        onSearchChange={(search) => updateFilters({ search, pageNumber: 1 })}
        onReset={() => setFilters(WAREHOUSE_LIST_DEFAULT_PARAMS)}
        onRefresh={() => refetch()}
      />

      <WarehouseTable
        warehouses={warehouses}
        totalItems={totalItems}
        currentPage={response?.currentPage ?? filters.pageNumber}
        pageSize={response?.pageSize ?? filters.pageSize}
        isLoading={isFetching}
        onPageChange={(pageNumber) => updateFilters({ pageNumber })}
        onPageSizeChange={(pageSize) =>
          updateFilters({ pageSize, pageNumber: 1 })
        }
        onRowClick={(warehouse) =>
          navigate(PATH_ADMIN_DASHBOARD.warehouse.detail(warehouse.warehouseId))
        }
      />
    </div>
  );
};

export default ListWarehousePage;
