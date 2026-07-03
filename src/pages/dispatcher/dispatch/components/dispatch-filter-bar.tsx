import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TDispatchFilters } from "@/schemas/dispatch.schema";
import type { TWarehouseLookup } from "@/schemas/warehouse.schema";
import { DISPATCH_TEMPERATURE_GROUP } from "@/types/enums/dispatch.enum";
import { FilterX, RefreshCcw, Search } from "lucide-react";
import { ALL_FILTER_VALUE, getTemperatureGroupLabel } from "./dispatch-helpers";

type Props = {
  filters: TDispatchFilters;
  warehouseOptions: TWarehouseLookup[];
  onChange: (filters: TDispatchFilters) => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
};

const tempOptions = [
  ALL_FILTER_VALUE,
  DISPATCH_TEMPERATURE_GROUP.FROZEN,
  DISPATCH_TEMPERATURE_GROUP.CHILLED,
  DISPATCH_TEMPERATURE_GROUP.AMBIENT,
];

const DispatchFilterBar = ({
  filters,
  warehouseOptions,
  onChange,
  onReset,
  onRefresh,
  isLoading,
}: Props) => {
  const update = (patch: Partial<TDispatchFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.4fr)_minmax(180px,0.9fr)_180px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Tìm LPN, tracking, hàng, khách..."
            className="pl-9"
          />
        </div>

        <Select
          value={filters.warehouseId}
          onValueChange={(value) => update({ warehouseId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>Tất cả kho</SelectItem>
            {warehouseOptions.map((warehouse) => (
              <SelectItem
                key={warehouse.warehouseId}
                value={warehouse.warehouseId}
              >
                {warehouse.label || warehouse.warehouseName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.temperatureGroup}
          onValueChange={(value) => update({ temperatureGroup: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Nhiệt độ" />
          </SelectTrigger>
          <SelectContent>
            {tempOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {getTemperatureGroupLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            title="Tải lại"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onReset}
            title="Xóa lọc"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DispatchFilterBar;
