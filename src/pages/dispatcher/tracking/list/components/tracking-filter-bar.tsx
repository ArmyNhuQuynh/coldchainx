import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import {
  TRACKING_ALL_STATUS,
  TRACKING_STATUS_OPTIONS,
  getTrackingStatusLabel,
} from "../../shared/tracking-formatters";

type Props = {
  search: string;
  status: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
};

const TrackingFilterBar = ({
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          placeholder="Tìm trip, biển số, tài xế, mã thiết bị..."
          className="pl-9"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TRACKING_STATUS_OPTIONS.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={status === item ? "default" : "outline"}
            onClick={() => onStatusChange(item)}
          >
            {item === TRACKING_ALL_STATUS ? "Tất cả" : getTrackingStatusLabel(item)}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-2"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Làm mới
        </Button>
      </div>
    </div>
  );
};

export default TrackingFilterBar;
