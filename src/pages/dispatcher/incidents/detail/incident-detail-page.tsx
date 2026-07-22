import { Skeleton } from "@/components/ui/skeleton";
import IncidentLoadError from "@/components/incidents/incident-load-error";
import { useIncident } from "@/hooks/use-incident";
import { TRACKING_DEFAULT_STATUSES, useMonitoring } from "@/hooks/use-monitoring";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IncidentDetailHeader from "./components/incident-detail-header";
import IncidentEvidencePanel from "./components/incident-evidence-panel";
import IncidentOverviewPanel from "./components/incident-overview-panel";
import RescueOperationPanel from "./components/rescue-operation-panel";
import TripContextPanel from "./components/trip-context-panel";

const IncidentDetailPage = () => {
  const navigate = useNavigate();
  const { incidentId } = useParams<{ incidentId: string }>();
  const { getIncident } = useIncident();
  const { getTrackingDetail, getTrackingTrips } = useMonitoring();
  const incidentQuery = getIncident(incidentId);
  const incident = incidentQuery.data;
  const tripId = incident?.tripId ?? undefined;
  const trackingDetailQuery = getTrackingDetail(tripId, Boolean(tripId));
  const trackingListQuery = getTrackingTrips(
    {
      statuses: [...TRACKING_DEFAULT_STATUSES],
      pageNumber: 1,
      pageSize: 10,
      search: tripId,
    },
    Boolean(tripId)
  );

  const trip = useMemo<TTrackingTrip | null>(() => {
    const detail = trackingDetailQuery.data;
    const listItem = trackingListQuery.data?.data.find((item) => item.tripId === tripId);
    if (!detail && !listItem) return null;

    return {
      ...(listItem ?? detail!),
      ...(detail ?? {}),
      drivers: listItem?.drivers ?? detail?.drivers ?? [],
      driver: listItem?.driver ?? detail?.driver,
      device: listItem?.device ?? detail?.device,
      plannedStartTime: listItem?.plannedStartTime ?? detail?.plannedStartTime,
      plannedEndTime: listItem?.plannedEndTime ?? detail?.plannedEndTime,
    };
  }, [trackingDetailQuery.data, trackingListQuery.data, tripId]);

  if (incidentQuery.isLoading) {
    return <div className="space-y-5"><Skeleton className="h-20 w-full" /><Skeleton className="h-80 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (incidentQuery.isError) {
    return (
      <IncidentLoadError
        error={incidentQuery.error}
        fallbackMessage="Không thể tải thông tin sự cố."
        isRetrying={incidentQuery.isFetching}
        onRetry={() => incidentQuery.refetch()}
      />
    );
  }

  if (!incident) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold">Không tìm thấy sự cố</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sự cố không tồn tại hoặc tài khoản không có quyền xem.</p>
      </div>
    );
  }

  const handleRefresh = () => {
    void incidentQuery.refetch();
    void trackingDetailQuery.refetch();
    void trackingListQuery.refetch();
  };

  return (
    <div className="space-y-5">
      <IncidentDetailHeader
        incident={incident}
        isRefreshing={incidentQuery.isFetching || trackingDetailQuery.isFetching}
        onBack={() => navigate(PATH_DISPATCHER_DASHBOARD.incident.root)}
        onRefresh={handleRefresh}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <IncidentOverviewPanel incident={incident} />
        <TripContextPanel
          trip={trip}
          tripId={incident.tripId}
          isLoading={trackingDetailQuery.isLoading || trackingListQuery.isLoading}
        />
      </div>

      <RescueOperationPanel incident={incident} trip={trip} />
      <IncidentEvidencePanel evidences={incident.evidences ?? []} />
    </div>
  );
};

export default IncidentDetailPage;
