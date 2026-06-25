import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { ALL_TRIP_STATUS, getTripStatusLabel } from "./trip-helpers";

type Props = {
  search: string;
  status: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
};

const statuses = ["PLANNED", "PICKING", "LOADING_COMPLETED"];

const TripFilterBar = ({
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: Props) => {
  return (
    <Card className="rounded-lg px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm trip, xe, tài xế..."
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[220px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TRIP_STATUS}>Tất cả trạng thái</SelectItem>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>
                {getTripStatusLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
          Tải lại
        </Button>
      </div>
    </Card>
  );
};

export default TripFilterBar;
