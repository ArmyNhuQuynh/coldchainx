import { DataTable } from "@/components/table/data-table";
import type { TRouteSchedule } from "@/schemas/route-schedule.schema";
import type { TRoute } from "@/schemas/route.schema";
import {
  getRouteScheduleColumns,
  type TRouteScheduleTableRow,
} from "./route-schedule-table/columns";

type Props = {
  schedules: TRouteSchedule[];
  routes: TRoute[];
  isLoading?: boolean;
  isDeleting?: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (schedule: TRouteSchedule) => void;
  onDelete: (schedule: TRouteSchedule) => void;
};

const RouteScheduleTable = ({
  schedules,
  routes,
  isLoading,
  isDeleting,
  pageIndex,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: Props) => {
  const routeLabels = new Map(
    routes.map((route) => [
      route.routeId,
      `${route.routeCode} · ${route.originCity} → ${route.destCity}`,
    ])
  );
  const rows: TRouteScheduleTableRow[] = schedules.map((schedule) => ({
    ...schedule,
    id: schedule.scheduleId,
    routeLabel: routeLabels.get(schedule.routeId) ?? "—",
  }));

  return (
    <DataTable
      data={rows}
      totalItems={totalRecords}
      columns={getRouteScheduleColumns({ isDeleting, onEdit, onDelete })}
      currentPage={pageIndex}
      pageSize={pageSize}
      isLoading={isLoading}
      pageSizeOptions={[5, 10, 20, 30, 50]}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSearchChange={() => {}}
      searchValues={[]}
      onSortChange={() => {}}
      sortValues={[]}
    />
  );
};

export default RouteScheduleTable;
