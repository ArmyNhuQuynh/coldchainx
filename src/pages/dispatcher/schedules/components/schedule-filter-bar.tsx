import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TRoute } from "@/schemas/route.schema";

type Props = {
  routes: TRoute[];
  selectedRouteId: string;
  isLoading?: boolean;
  onRouteChange: (routeId: string) => void;
  onRefresh: () => void;
};

const ScheduleFilterBar = ({
  routes,
  selectedRouteId,
  isLoading,
  onRouteChange,
  onRefresh,
}: Props) => (
  <Card className="rounded-lg px-4 py-3">
    <div className="grid gap-3 md:grid-cols-[minmax(280px,1fr)_auto] md:items-end">
      <label className="space-y-2 text-sm">
        <span className="font-medium text-muted-foreground">Tuyến vận chuyển</span>
        <Select
          value={selectedRouteId}
          onValueChange={onRouteChange}
          disabled={isLoading || routes.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tuyến" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {routes.map((route) => (
              <SelectItem key={route.routeId} value={route.routeId}>
                {route.routeCode} · {route.originCity} → {route.destCity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <Button
        type="button"
        variant="outline"
        className="rounded-md"
        disabled={isLoading}
        onClick={onRefresh}
      >
        Tải lại
      </Button>
    </div>
  </Card>
);

export default ScheduleFilterBar;
