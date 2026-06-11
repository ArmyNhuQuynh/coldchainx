import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { useQueryParams } from "@/hooks/use-query-params";
import { columns } from "./shipment-table/colum";
import { useOrder } from "@/hooks/use-order";

type Props = {};

const ShipmentTable = (_: Props) => {
  const { getOrders } = useOrder();

  const {
    currentPage,
    pageSize,
    setPage,
    setPageSize,
  } = useQueryParams({
    defaultFilter: [],
  });

  const { data, isLoading } = getOrders({
    pageNumber: currentPage,
    pageSize,
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
        isLoading={isLoading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={() => {}}
        searchValues={[]}
        onSortChange={() => {}}
        sortValues={[]}
      />
    );
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export default ShipmentTable;