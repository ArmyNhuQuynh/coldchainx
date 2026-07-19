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
import { CalendarClock, RefreshCcw } from "lucide-react";

type Props = {
  schedules: TDispatchScheduleLookup[];
  selectedScheduleId: string;
  isLoading?: boolean;
  isError?: boolean;
  onScheduleChange: (scheduleId: string) => void;
  onRetry: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const formatTime = (value?: string | null) => value?.slice(0, 5) || "—";

const DispatchScheduleSelector = ({
  schedules,
  selectedScheduleId,
  isLoading,
  isError,
  onScheduleChange,
  onRetry,
}: Props) => {
  const selectedSchedule = schedules.find(
    (schedule) => schedule.scheduleId === selectedScheduleId
  );

  return (
    <section className="rounded-lg border bg-card px-5 py-4 shadow-sm">
      <div className="grid items-end gap-4 lg:grid-cols-[minmax(280px,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="h-4 w-4 text-primary" />
            Lịch vận chuyển
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : isError ? (
            <div className="flex min-h-10 items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2">
              <span className="text-sm text-rose-800">
                Không tải được lịch vận chuyển.
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
            <Select
              value={selectedScheduleId}
              onValueChange={onScheduleChange}
              disabled={schedules.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn lịch trước khi ghép LPN" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((schedule) => (
                  <SelectItem key={schedule.scheduleId} value={schedule.scheduleId}>
                    {schedule.label ||
                      `${schedule.routeCode || schedule.routeName || "Tuyến"} · ${formatDate(
                        schedule.departureDate
                      )} ${formatTime(schedule.departureTime)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!isLoading && !isError && schedules.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Hiện không có lịch vận chuyển hoạt động.
            </p>
          )}
        </div>

        <div className="grid min-h-10 gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Tuyến</p>
            <p className="mt-1 truncate font-medium">
              {selectedSchedule?.routeName || selectedSchedule?.routeCode || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Khởi hành</p>
            <p className="mt-1 font-medium tabular-nums">
              {selectedSchedule
                ? `${formatDate(selectedSchedule.departureDate)} · ${formatTime(
                    selectedSchedule.departureTime
                  )}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cut-off</p>
            <div className="mt-1">
              <Badge variant="outline" className="font-medium tabular-nums">
                {formatTime(selectedSchedule?.cutOffTime)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DispatchScheduleSelector;
