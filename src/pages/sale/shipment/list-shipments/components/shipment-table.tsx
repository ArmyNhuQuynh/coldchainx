import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { useQueryParams } from "@/hooks/use-query-params";
import { columns } from "./shipment-table/colum";
import { useOrder } from "@/hooks/use-order";
import { useRoute } from "@/hooks/use-route";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/types/enums/order-status.enum";

type Props = {};

const ShipmentTable = (_: Props) => {
  const { getOrders } = useOrder();
  const { getRoutes } = useRoute();

  const {
    currentPage,
    pageSize,
    filter,
    setPage,
    setPageSize,
    setFilter,
  } = useQueryParams({
    defaultFilter: [
      { id: "routeId", value: "ALL" },
      { id: "status", value: "ALL" },
    ],
  });

  const routeId = filter.find((item) => item.id === "routeId")?.value as string;
  const status = filter.find((item) => item.id === "status")?.value as string;
  const routesQuery = getRoutes({ pageNumber: 1, pageSize: 100 });
  const routes = routesQuery.data?.data ?? [];

  const { data, isLoading, isFetching, refetch } = getOrders({
    pageNumber: currentPage,
    pageSize,
    status: status && status !== "ALL" ? status : undefined,
    routeId: routeId && routeId !== "ALL" ? routeId : undefined,
  });

  const orders = data?.data.data ?? [];
  const total = data?.data.totalRecords ?? 0;

  try {
    return (
      <DataTable
        data={orders}
        totalItems={total}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isLoading || isFetching}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setFilter}
        searchValues={[
          {
            id: "routeId",
            value: routeId || "ALL",
            isSelect: true,
            searchPlaceholder: "Tuyến vận chuyển",
            options: [
              { label: "Tất cả tuyến", value: "ALL" },
              ...routes.map((route) => ({
                label: `${route.routeCode} · ${route.originCity} → ${route.destCity}`,
                value: route.routeId,
              })),
            ],
          },
          {
            id: "status",
            value: status || "ALL",
            isSelect: true,
            searchPlaceholder: "Trạng thái",
            options: ORDER_STATUS_FILTER_OPTIONS,
          },
        ]}
        onSortChange={() => {}}
        sortValues={[]}
        showRefresh
        onRefresh={() => refetch()}
      />
    );
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export default ShipmentTable;
