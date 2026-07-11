import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import { useMonitoring } from "@/hooks/use-monitoring";
import type { TMonitoringAlert, TTrackingPoint } from "@/schemas/monitoring.schema";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { ArrowLeft, MapPinned, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectedPointCard from "./components/selected-point-card";
import TemperatureTimeline from "./components/temperature-timeline";
import TrackingAlertsPanel from "./components/tracking-alerts-panel";
import TrackingMap from "./components/tracking-map";
import TrackingOrdersPanel from "./components/tracking-orders-panel";
import TripOverviewPanel from "./components/trip-overview-panel";
import {
  formatShortTripId,
  getLatestPoint,
} from "../shared/tracking-formatters";

const POLLING_INTERVAL_MS = 30000;

const TrackingDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    getTrackingDetail,
    getTripChart,
    getTripRouteGoong,
    getTripAlerts,
  } = useMonitoring();
  const { getTripRoute } = useDispatchTrips();
  const [selectedPoint, setSelectedPoint] = useState<TTrackingPoint | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const detailQuery = getTrackingDetail(tripId, Boolean(tripId));
  const chartQuery = getTripChart(tripId, Boolean(tripId), 800);
  const goongRouteQuery = getTripRouteGoong(tripId, Boolean(tripId));
  const plannedRouteQuery = getTripRoute(tripId, Boolean(tripId));
  const riskAlertsQuery = getTripAlerts(tripId, "risk", Boolean(tripId));
  const ssaAlertsQuery = getTripAlerts(tripId, "ssa", Boolean(tripId));
  const smartAlertsQuery = getTripAlerts(tripId, "smart", Boolean(tripId));

  const trip = detailQuery.data ?? null;
  const points = chartQuery.data?.points ?? [];
  const lastPoint = points.length > 0 ? points[points.length - 1] : null;
  const latestPoint = (trip ? getLatestPoint(trip) : null) ?? lastPoint;
  const allAlerts = useMemo<TMonitoringAlert[]>(
    () => [
      ...(chartQuery.data?.alerts ?? []),
      ...(riskAlertsQuery.data ?? []),
      ...(ssaAlertsQuery.data ?? []),
      ...(smartAlertsQuery.data ?? []),
    ],
    [
      chartQuery.data?.alerts,
      riskAlertsQuery.data,
      smartAlertsQuery.data,
      ssaAlertsQuery.data,
    ]
  );

  useEffect(() => {
    if (!tripId) return;

    const timer = window.setInterval(() => {
      detailQuery.refetch();
      chartQuery.refetch();
      goongRouteQuery.refetch();
      riskAlertsQuery.refetch();
      ssaAlertsQuery.refetch();
      smartAlertsQuery.refetch();
    }, POLLING_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    chartQuery,
    detailQuery,
    goongRouteQuery,
    riskAlertsQuery,
    smartAlertsQuery,
    ssaAlertsQuery,
    tripId,
  ]);

  const handleRefresh = () => {
    detailQuery.refetch();
    chartQuery.refetch();
    goongRouteQuery.refetch();
    plannedRouteQuery.refetch();
    riskAlertsQuery.refetch();
    ssaAlertsQuery.refetch();
    smartAlertsQuery.refetch();
  };

  if (!tripId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Không tìm thấy mã trip.
      </div>
    );
  }

  const isInitialLoading = detailQuery.isLoading || chartQuery.isLoading;
  const plannedEncodedPolyline =
    plannedRouteQuery.data?.overviewPolyline ??
    plannedRouteQuery.data?.goongRouteOverview ??
    null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate(PATH_DISPATCHER_DASHBOARD.tracking.root)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">
              Hành trình {formatShortTripId(tripId)}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Vị trí, nhiệt độ và lịch sử di chuyển của xe trong chuyến
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={
            detailQuery.isFetching ||
            chartQuery.isFetching ||
            goongRouteQuery.isFetching
          }
          onClick={handleRefresh}
        >
          <RefreshCw
            className={
              detailQuery.isFetching || chartQuery.isFetching
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />
          Làm mới dữ liệu
        </Button>
      </div>

      {isInitialLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-[620px] w-full" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <TripOverviewPanel trip={trip} />

          <div className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
            <TrackingMap
              points={points}
              latestPoint={latestPoint}
              actualEncodedPolyline={goongRouteQuery.data?.encodedPolyline}
              plannedEncodedPolyline={plannedEncodedPolyline}
              deviceCode={trip?.device?.deviceCode}
              onPointSelect={(point, distance) => {
                setSelectedPoint(point);
                setSelectedDistance(distance ?? null);
              }}
            />
            <div className="space-y-4">
              <SelectedPointCard
                point={selectedPoint}
                distanceMeters={selectedDistance}
              />
              <TemperatureTimeline
                points={points}
                selectedPoint={selectedPoint}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <TrackingAlertsPanel alerts={allAlerts} />
            <TrackingOrdersPanel orders={trip?.orders ?? []} />
          </div>
        </>
      )}
    </div>
  );
};

export default TrackingDetailPage;
