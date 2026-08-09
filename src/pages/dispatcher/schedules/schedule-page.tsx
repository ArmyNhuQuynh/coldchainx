import { Button } from "@/components/ui/button";
import { normalizeDispatchScheduleLookup } from "@/apis/route-schedule-normalizers";
import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { useRoute } from "@/hooks/use-route";
import { useRouteSchedule } from "@/hooks/use-route-schedule";
import { handleApiError } from "@/lib/error";
import { ROUTE_LIST_DEFAULT_PARAMS } from "@/schemas/route.schema";
import {
  ROUTE_SCHEDULE_FORM_DEFAULTS,
  ROUTE_SCHEDULE_PAGE_SIZE,
  RouteScheduleFormSchema,
  type TRouteSchedule,
  type TRouteScheduleFormValues,
} from "@/schemas/route-schedule.schema";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import RouteScheduleTable from "./components/route-schedule-table";
import RouteScheduleUpsertDialog from "./components/route-schedule-upsert-dialog";
import {
  collectRouteScheduleFormErrors,
  toApiTime,
  toRouteScheduleFormState,
  type RouteScheduleFormErrors,
} from "./components/route-schedule-utils";
import ScheduleFilterBar, {
  ALL_ROUTES_VALUE,
} from "./components/schedule-filter-bar";

const SchedulePage = () => {
  const { getRoutes } = useRoute();
  const { getSchedules: getDispatchSchedules } = useDispatchLookup();
  const {
    getRouteSchedules,
    createRouteSchedule,
    updateRouteSchedule,
  } = useRouteSchedule();

  const [selectedRouteId, setSelectedRouteId] = useState(ALL_ROUTES_VALUE);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(ROUTE_SCHEDULE_PAGE_SIZE);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<TRouteSchedule | null>(null);
  const [formValues, setFormValues] = useState<TRouteScheduleFormValues>(
    ROUTE_SCHEDULE_FORM_DEFAULTS
  );
  const [formErrors, setFormErrors] = useState<RouteScheduleFormErrors>({});

  const routesQuery = getRoutes({
    ...ROUTE_LIST_DEFAULT_PARAMS,
    pageNumber: 1,
    pageSize: 200,
  });
  const routes = routesQuery.data?.data ?? [];
  const isShowingAllRoutes = selectedRouteId === ALL_ROUTES_VALUE;

  const routeSchedulesQuery = getRouteSchedules(
    isShowingAllRoutes ? undefined : selectedRouteId,
    { pageIndex, pageSize },
    !isShowingAllRoutes
  );
  const allSchedulesQuery = getDispatchSchedules(isShowingAllRoutes);
  const routeSchedulePage = routeSchedulesQuery.data?.data;
  const allSchedules = useMemo(
    () =>
      (allSchedulesQuery.data ?? [])
        .map(normalizeDispatchScheduleLookup)
        .sort((left, right) => {
          const leftDeparture = `${left.departureDate}T${left.departureTime}`;
          const rightDeparture = `${right.departureDate}T${right.departureTime}`;
          return leftDeparture.localeCompare(rightDeparture);
        }),
    [allSchedulesQuery.data]
  );
  const schedules = isShowingAllRoutes
    ? allSchedules.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    : routeSchedulePage?.data ?? [];
  const totalRecords = isShowingAllRoutes
    ? allSchedules.length
    : routeSchedulePage?.totalRecords ?? 0;
  const isSchedulesFetching = isShowingAllRoutes
    ? allSchedulesQuery.isFetching
    : routeSchedulesQuery.isFetching;
  const isSubmitting =
    createRouteSchedule.isPending || updateRouteSchedule.isPending;

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    setPageIndex(1);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPageIndex(1);
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
    setFormValues(ROUTE_SCHEDULE_FORM_DEFAULTS);
    setFormErrors({});
  };

  const openCreateDialog = () => {
    setEditingSchedule(null);
    setFormValues({
      ...ROUTE_SCHEDULE_FORM_DEFAULTS,
      routeId:
        selectedRouteId === ALL_ROUTES_VALUE
          ? routes[0]?.routeId || ""
          : selectedRouteId,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (schedule: TRouteSchedule) => {
    setEditingSchedule(schedule);
    setFormValues(toRouteScheduleFormState(schedule));
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
      return;
    }
    if (!isSubmitting) resetDialog();
  };

  const handleFieldChange = (
    field: keyof TRouteScheduleFormValues,
    value: string
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const parsed = RouteScheduleFormSchema.safeParse(formValues);

    if (!parsed.success) {
      setFormErrors(collectRouteScheduleFormErrors(parsed.error.issues));
      return;
    }

    const basePayload = {
      departureDate: parsed.data.departureDate,
      departureTime: toApiTime(parsed.data.departureTime),
      cutOffTime: toApiTime(parsed.data.cutOffTime),
    };
    const routeId = parsed.data.routeId;

    try {
      if (editingSchedule) {
        await updateRouteSchedule.mutateAsync({
          routeId,
          scheduleId: editingSchedule.scheduleId,
          data: {
            ...basePayload,
            status: parsed.data.status,
          },
        });
        toast.success("Cập nhật lịch đi thành công");
      } else {
        await createRouteSchedule.mutateAsync({
          routeId,
          data: basePayload,
        });
        toast.success("Tạo lịch đi thành công");
      }

      resetDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRefresh = () => {
    routesQuery.refetch();
    if (isShowingAllRoutes) {
      allSchedulesQuery.refetch();
    } else {
      routeSchedulesQuery.refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Lịch đi</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý ngày chạy, giờ xuất phát và cut-off cho từng tuyến vận chuyển.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-md"
          disabled={routes.length === 0}
          onClick={openCreateDialog}
        >
          Tạo lịch đi
        </Button>
      </div>

      <ScheduleFilterBar
        routes={routes}
        selectedRouteId={selectedRouteId}
        isLoading={routesQuery.isFetching}
        onRouteChange={handleRouteChange}
        onRefresh={handleRefresh}
      />

      <RouteScheduleTable
        schedules={schedules}
        routes={routes}
        isLoading={isSchedulesFetching}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        onEdit={openEditDialog}
      />

      <RouteScheduleUpsertDialog
        open={dialogOpen}
        routes={routes}
        editingSchedule={editingSchedule}
        values={formValues}
        errors={formErrors}
        isSubmitting={isSubmitting}
        onOpenChange={handleDialogOpenChange}
        onFieldChange={handleFieldChange}
        onCancel={resetDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SchedulePage;
