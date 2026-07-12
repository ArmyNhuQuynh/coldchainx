import { DataTable } from "@/components/table/data-table";
import type { TWarehouse } from "@/schemas/warehouse.schema";
import { columns } from "./warehouse-table/columns";

type Props = {
  warehouses: TWarehouse[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (warehouse: TWarehouse) => void;
};

const WarehouseTable = ({
  warehouses,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: Props) => {
  return (
    <DataTable
      data={warehouses}
      totalItems={totalItems}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={onRowClick}
      onSearchChange={() => {}}
      searchValues={[]}
      onSortChange={() => {}}
      sortValues={[]}
    />
  );
};

export default WarehouseTable;
