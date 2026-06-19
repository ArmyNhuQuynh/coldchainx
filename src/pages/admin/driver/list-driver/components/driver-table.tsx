import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/error";
import { useDriver } from "@/hooks/use-driver";
import type { TDriver } from "@/schemas/driver.schema";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { columns } from "./driver-table/columns";

const getSearchableText = (driver: TDriver) => {
  const licenses = driver.licenses;

  return [
    driver.fullName,
    driver.email,
    driver.identityNumber,
    driver.phoneNumber,
    driver.status,
    ...licenses.flatMap((license) => [
      license.licenseNumber,
      license.licenseClass,
      license.status,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const DriverTable = () => {
  const { getDrivers } = useDriver();
  const { data, isLoading } = getDrivers();
  const [search, setSearch] = useState("");

  const allDrivers: TDriver[] = data?.data ?? [];
  const filtered = allDrivers.filter((driver) =>
    getSearchableText(driver).includes(search.toLowerCase())
  );
  const total = filtered.length;

  try {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, email, tài khoản, GPLX..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Lọc
          </Button>
        </div>

        <DataTable
          data={filtered}
          totalItems={total}
          columns={columns}
          currentPage={1}
          pageSize={Math.max(total, 1)}
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

export default DriverTable;
