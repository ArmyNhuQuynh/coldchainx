import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { useVehicle } from "@/hooks/use-vehicle";
import { columns } from "./vehicle-table/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { TVehicle } from "@/schemas/vehicle.schema";

const VehicleTable = () => {
  const { getVehicles } = useVehicle();
  const { data, isLoading } = getVehicles();

  const [search, setSearch] = useState("");

  const allVehicles: TVehicle[] = data?.data ?? [];

  const filtered = allVehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.truckPlate?.toLowerCase().includes(q) ||
      v.brand?.toLowerCase().includes(q) ||
      v.vehicleType?.toLowerCase().includes(q)
    );
  });

  const total = filtered.length;

  try {
    return (
      <div className="space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo biển số, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Lọc
          </Button>
        </div>

        {/* Table */}
        <DataTable
          data={filtered}
          totalItems={total}
          columns={columns}
          currentPage={1}
          pageSize={total}
          isLoading={isLoading}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onSearchChange={() => {}}
          searchValues={[]}
          onSortChange={() => {}}
          sortValues={[]}
        />
      </div>
    );
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export default VehicleTable;