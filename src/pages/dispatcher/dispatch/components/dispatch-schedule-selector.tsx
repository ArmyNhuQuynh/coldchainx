import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { TDispatchScheduleLookup } from "@/schemas/dispatch.schema";
import { RefreshCcw } from "lucide-react";
import { useMemo } from "react";

type Props = {
  schedules: TDispatchScheduleLookup[];
  selectedRouteId: string;
  selectedScheduleId: string;
  isLoading?: boolean;
  isError?: boolean;
  onRouteChange: (routeId: string) => void;
  onScheduleChange: (scheduleId: string) => void;
  onRetry: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  if (value.startsWith("0001-")) return "Ngày chưa hợp lệ";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

const formatTime = (value?: string | null) => value?.slice(0, 5) || "—";

const DispatchScheduleSelector = ({
  schedules,
  selectedRouteId,
  selectedScheduleId,
  isLoading,
  isError,
  onRouteChange,
  onScheduleChange,
  onRetry,
}: Props) => {
  const routes = useMemo(() => {
    const uniqueRoutes = new Map<string, string>();

    schedules.forEach((schedule) => {
      if (!schedule.routeId || uniqueRoutes.has(schedule.routeId)) return;
      uniqueRoutes.set(
        schedule.routeId,
        schedule.routeName || schedule.routeCode || "Tuyến chưa đặt tên"
      );
    });

    return Array.from(uniqueRoutes, ([routeId, label]) => ({ routeId, label }));
  }, [schedules]);

  const routeSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.routeId === selectedRouteId),
    [schedules, selectedRouteId]
  );

  const selectedSchedule = schedules.find(
    (schedule) => schedule.scheduleId === selectedScheduleId
  );

  return (
    <section className="rounded-lg border bg-card px-5 py-4 shadow-sm">
      {isError ? (
        <div className="flex min-h-10 items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2">
          <span className="text-sm text-rose-800">
            Không tải được tuyến và giờ khởi hành.
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 bg-background"
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4" />
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="grid items-end gap-4 md:grid-cols-[minmax(220px,0.9fr)_minmax(280px,1.1fr)_minmax(110px,0.35fr)]">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Tuyến vận chuyển</label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedRouteId}
                onValueChange={onRouteChange}
                disabled={routes.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tuyến vận chuyển" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.routeId} value={route.routeId}>
                      {route.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Khởi hành</label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedScheduleId}
                onValueChange={onScheduleChange}
                disabled={!selectedRouteId || routeSchedules.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedRouteId
                        ? "Chọn ngày giờ khởi hành"
                        : "Chọn tuyến trước"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {routeSchedules.map((schedule) => (
                    <SelectItem
                      key={schedule.scheduleId}
                      value={schedule.scheduleId}
                    >
                      {formatDate(schedule.departureDate)} ·{" "}
                      {formatTime(schedule.departureTime)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isLoading && selectedRouteId && routeSchedules.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Tuyến này chưa có giờ khởi hành để điều phối.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Cut-off</p>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex h-10 items-center">
                <Badge variant="outline" className="font-medium tabular-nums">
                  {formatTime(selectedSchedule?.cutOffTime)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoading && !isError && schedules.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Hiện không có tuyến và giờ khởi hành để điều phối.
        </p>
      )}
    </section>
  );
};

export default DispatchScheduleSelector;
