import { Button } from "@/components/ui/button";
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
import { ROUTE_STATUS } from "@/types/enums/route-status.enum";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RouteScheduleTable from "./components/route-schedule-table";
import RouteScheduleUpsertDialog from "./components/route-schedule-upsert-dialog";
import {
  collectRouteScheduleFormErrors,
  toApiTime,
  toRouteScheduleFormState,
  type RouteScheduleFormErrors,
} from "./components/route-schedule-utils";
import ScheduleFilterBar from "./components/schedule-filter-bar";

const SchedulePage = () => {
  const { getRoutes } = useRoute();
  const {
    getRouteSchedules,
    createRouteSchedule,
    updateRouteSchedule,
    deleteRouteSchedule,
  } = useRouteSchedule();

  const [selectedRouteId, setSelectedRouteId] = useState("");
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
    status: ROUTE_STATUS.ACTIVE,
  });
  const routes = routesQuery.data?.data ?? [];

  const schedulesQuery = getRouteSchedules(selectedRouteId, {
    pageIndex,
    pageSize,
  });
  const schedulePage = schedulesQuery.data?.data;
  const schedules = schedulePage?.data ?? [];
  const totalRecords = schedulePage?.totalRecords ?? 0;
  const isSubmitting =
    createRouteSchedule.isPending || updateRouteSchedule.isPending;

  useEffect(() => {
    if (selectedRouteId || routes.length === 0) return;
    setSelectedRouteId(routes[0].routeId);
  }, [routes, selectedRouteId]);

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
      routeId: selectedRouteId || routes[0]?.routeId || "",
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
        if (selectedRouteId !== routeId) {
          setSelectedRouteId(routeId);
          setPageIndex(1);
        }
        toast.success("Tạo lịch đi thành công");
      }

      resetDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (schedule: TRouteSchedule) => {
    if (!selectedRouteId) return;

    const confirmed = window.confirm(`Xóa lịch ${schedule.scheduleName}?`);
    if (!confirmed) return;

    try {
      await deleteRouteSchedule.mutateAsync({
        routeId: selectedRouteId,
        scheduleId: schedule.scheduleId,
      });
      toast.success("Xóa lịch đi thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRefresh = () => {
    routesQuery.refetch();
    schedulesQuery.refetch();
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
        isLoading={schedulesQuery.isFetching}
        isDeleting={deleteRouteSchedule.isPending}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        onEdit={openEditDialog}
        onDelete={handleDelete}
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
