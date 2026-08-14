import { useMemo, useState } from "react";
import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { DataTable } from "@/components/table/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/hooks/use-order";
import { useRoute } from "@/hooks/use-route";
import type { TOrderScheduleSummary } from "@/schemas/order.schema";
import { scheduleColumns } from "./shipment-schedule-table/column";

type Props = {
  onSelectSchedule: (schedule: TOrderScheduleSummary) => void;
};

type WeekOption = {
  value: string;
  label: string;
  fromDate: string;
  toDate: string;
};

const toApiDate = (date: Date) => format(date, "yyyy-MM-dd");

const getWeekOptions = (monthValue: string): WeekOption[] => {
  if (!monthValue) return [];

  const [year, month] = monthValue.split("-").map(Number);
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const options: WeekOption[] = [];
  let cursor = startOfWeek(monthStart, { weekStartsOn: 1 });
  let index = 1;

  while (cursor <= monthEnd) {
    const weekStart = cursor < monthStart ? monthStart : cursor;
    const rawWeekEnd = endOfWeek(cursor, { weekStartsOn: 1 });
    const weekEnd = rawWeekEnd > monthEnd ? monthEnd : rawWeekEnd;

    options.push({
      value: String(index),
      label: `Tuần ${index} (${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")})`,
      fromDate: toApiDate(weekStart),
      toDate: toApiDate(weekEnd),
    });

    cursor = addDays(cursor, 7);
    index += 1;
  }

  return options;
};

const ShipmentScheduleTable = ({ onSelectSchedule }: Props) => {
  const today = useMemo(() => new Date(), []);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("ALL");
  const [routeId, setRouteId] = useState("ALL");
  const { getOrderScheduleSummary } = useOrder();
  const { getRoutes } = useRoute();
  const weekOptions = useMemo(() => getWeekOptions(month), [month]);

  const dateRange = useMemo(() => {
    if (!month) {
      return {
        fromDate: toApiDate(today),
        toDate: toApiDate(addDays(today, 7)),
        label: `Từ ${format(today, "dd/MM")} đến ${format(addDays(today, 7), "dd/MM/yyyy")}`,
      };
    }

    const selectedWeek = weekOptions.find((option) => option.value === week);
    if (selectedWeek) {
      return {
        fromDate: selectedWeek.fromDate,
        toDate: selectedWeek.toDate,
        label: selectedWeek.label,
      };
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const monthDate = new Date(year, monthNumber - 1, 1);
    return {
      fromDate: toApiDate(startOfMonth(monthDate)),
      toDate: toApiDate(endOfMonth(monthDate)),
      label: format(monthDate, "'Tháng' M yyyy", { locale: vi }),
    };
  }, [month, today, week, weekOptions]);

  const summaryQuery = getOrderScheduleSummary({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    routeId: routeId === "ALL" ? undefined : routeId,
    pageNumber: page,
    pageSize,
  });
  const routesQuery = getRoutes({ pageNumber: 1, pageSize: 100 });
  const routes = routesQuery.data?.data ?? [];
  const summaries = (summaryQuery.data?.data.data ?? []).map((summary) => ({
    ...summary,
    id: summary.scheduleId,
  }));
  const total = summaryQuery.data?.data.totalRecords ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)_minmax(220px,1.4fr)]">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="shipment-schedule-month">
            Tháng vận chuyển
          </label>
          <Input
            id="shipment-schedule-month"
            type="month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setWeek("ALL");
              setPage(1);
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tuần trong tháng</label>
          <Select
            value={week}
            disabled={!month}
            onValueChange={(value) => {
              setWeek(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tuần" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Cả tháng</SelectItem>
              {weekOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tuyến vận chuyển</label>
          <Select
            value={routeId}
            onValueChange={(value) => {
              setRouteId(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tuyến" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả tuyến</SelectItem>
              {routes.map((route) => (
                <SelectItem key={route.routeId} value={route.routeId}>
                  {route.routeCode} · {route.originCity} → {route.destCity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <span>Khoảng hiển thị: {dateRange.label}</span>
        {!month && <span>Mặc định hiển thị lịch trong 7 ngày tới</span>}
      </div>

      <DataTable
        data={summaries}
        totalItems={total}
        columns={scheduleColumns}
        currentPage={page}
        pageSize={pageSize}
        isLoading={summaryQuery.isLoading || summaryQuery.isFetching}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onRowClick={onSelectSchedule}
        onSortChange={() => {}}
        sortValues={[]}
        showRefresh
        showSettings={false}
        onRefresh={() => summaryQuery.refetch()}
      />
    </div>
  );
};

export default ShipmentScheduleTable;
