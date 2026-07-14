import { DataTable } from "@/components/table/data-table";
import type { TRoute } from "@/schemas/route.schema";
import { columns } from "./route-table/columns";

type Props = {
  routes: TRoute[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (route: TRoute) => void;
};

const RouteTable = ({
  routes,
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
      data={routes}
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

export default RouteTable;
