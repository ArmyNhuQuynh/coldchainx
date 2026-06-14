import { DataTable } from "@/components/table/data-table";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import { columns } from "./vehicle-table/columns";

type Props = {};

const VehicleTable = (_: Props) => {
  const { getVehicles } = useVehicle();
  const { data, isLoading } = getVehicles();

  const vehicles = data?.data ?? [];
  const pageSize = vehicles.length || 10;

  try {
    return (
      <DataTable
        data={vehicles}
        totalItems={vehicles.length}
        columns={columns}
        currentPage={1}
        pageSize={pageSize}
        isLoading={isLoading}
        isPagingProp={false}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
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

export default VehicleTable;
