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
import { ROUTE_STATUS_OPTIONS } from "@/types/enums/route-status.enum";
import { FilterX, RefreshCw, Search } from "lucide-react";

type Props = {
  originCity: string;
  destCity: string;
  status?: string;
  isLoading?: boolean;
  onOriginCityChange: (value: string) => void;
  onDestCityChange: (value: string) => void;
  onStatusChange: (value?: string) => void;
  onReset: () => void;
  onRefresh: () => void;
};

const ALL_STATUS = "__all__";

const RouteFilterBar = ({
  originCity,
  destCity,
  status,
  isLoading,
  onOriginCityChange,
  onDestCityChange,
  onStatusChange,
  onReset,
  onRefresh,
}: Props) => {
  return (
    <Card className="rounded-lg px-4 py-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_220px_auto] lg:items-end">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Điểm đi</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={originCity}
              placeholder="VD: HCM"
              className="pl-9"
              onChange={(event) => onOriginCityChange(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Điểm đến</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={destCity}
              placeholder="VD: Da Nang"
              className="pl-9"
              onChange={(event) => onDestCityChange(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
          <Select
            value={status || ALL_STATUS}
            onValueChange={(value) =>
              onStatusChange(value === ALL_STATUS ? undefined : value)
            }
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS}>Tất cả trạng thái</SelectItem>
              {ROUTE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            disabled={isLoading}
            onClick={onRefresh}
          >
            <RefreshCw
              className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={onReset}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RouteFilterBar;
