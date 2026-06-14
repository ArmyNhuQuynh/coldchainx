import { useVehicle } from "@/hooks/use-vehicle";
import VehicleTable from "./components/vehicle-table";
import VehicleStats from "./components/vehicle-stats";

const ListVehiclePage = () => {
  const { getVehicles } = useVehicle();
  const { data, isLoading } = getVehicles();

  const vehicles = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <h1 className="text-3xl font-semibold">Quản lý xe tải</h1>
        <p className="mt-1 text-muted-foreground">
          Theo dõi đội xe lạnh, tải trọng và trạng thái vận hành
        </p>
      </div>
      </div>

      <VehicleStats vehicles={vehicles} isLoading={isLoading} />
      <VehicleTable />
    </div>
  );
};

export default ListVehiclePage;
