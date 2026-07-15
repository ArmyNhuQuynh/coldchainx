import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IOT_DEVICE_STATUS_OPTIONS } from "@/types/enums/iot-device-status.enum";
import { RotateCcw, Search } from "lucide-react";

export type TIotDeviceFilters = {
  search: string;
  status: string;
  assignment: string;
};

type Props = {
  filters: TIotDeviceFilters;
  onChange: (updates: Partial<TIotDeviceFilters>) => void;
  onReset: () => void;
};

export const IOT_DEVICE_FILTER_ALL = "ALL";
export const IOT_DEVICE_ASSIGNMENT_ASSIGNED = "ASSIGNED";
export const IOT_DEVICE_ASSIGNMENT_UNASSIGNED = "UNASSIGNED";

const IotDeviceFilterBar = ({ filters, onChange, onReset }: Props) => (
  <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value })}
        placeholder="Tìm theo mã thiết bị hoặc biển số xe..."
        className="h-11 rounded-xl pl-9"
      />
    </div>

    <Select
      value={filters.status}
      onValueChange={(value) => onChange({ status: value })}
    >
      <SelectTrigger className="h-11 w-full rounded-xl lg:w-56">
        <SelectValue placeholder="Trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={IOT_DEVICE_FILTER_ALL}>Tất cả trạng thái</SelectItem>
        {IOT_DEVICE_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      value={filters.assignment}
      onValueChange={(value) => onChange({ assignment: value })}
    >
      <SelectTrigger className="h-11 w-full rounded-xl lg:w-48">
        <SelectValue placeholder="Gắn xe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={IOT_DEVICE_FILTER_ALL}>Tất cả</SelectItem>
        <SelectItem value={IOT_DEVICE_ASSIGNMENT_ASSIGNED}>Đã gắn xe</SelectItem>
        <SelectItem value={IOT_DEVICE_ASSIGNMENT_UNASSIGNED}>
          Chưa gắn xe
        </SelectItem>
      </SelectContent>
    </Select>

    <Button
      type="button"
      variant="outline"
      className="h-11 rounded-xl"
      onClick={onReset}
    >
      <RotateCcw className="mr-2 h-4 w-4" />
      Đặt lại
    </Button>
  </div>
);

export default IotDeviceFilterBar;
