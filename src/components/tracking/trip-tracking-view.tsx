import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import { useMonitoring } from "@/hooks/use-monitoring";
import type {
  TMonitoringAlert,
  TTrackingPoint,
} from "@/schemas/monitoring.schema";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SelectedPointCard from "./selected-point-card";
import TemperatureTimeline from "./temperature-timeline";
import TrackingAlertsPanel from "./tracking-alerts-panel";
import TrackingMap from "./tracking-map";
import TrackingOrdersPanel from "./tracking-orders-panel";
import TripOverviewPanel from "./trip-overview-panel";
import { getLatestPoint } from "./shared/tracking-formatters";

const POLLING_INTERVAL_MS = 30000;

type Props = {
  tripId: string;
  includeOperationalDetails?: boolean;
};

const TripTrackingView = ({
  tripId,
  includeOperationalDetails = true,
}: Props) => {
  const { getTrackingDetail, getTripChart, getTripAlerts } = useMonitoring();
  const { getTripDetails, getTripRoute } = useDispatchTrips();
  const [selectedPoint, setSelectedPoint] = useState<TTrackingPoint | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const detailQuery = getTrackingDetail(tripId);
  const chartQuery = getTripChart(tripId, true, 800);
  const plannedRouteQuery = getTripRoute(tripId);
  const tripDetailsQuery = getTripDetails(tripId, includeOperationalDetails);
  const riskAlertsQuery = getTripAlerts(tripId, "risk");
  const ssaAlertsQuery = getTripAlerts(tripId, "ssa");
  const smartAlertsQuery = getTripAlerts(tripId, "smart");

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
    const timer = window.setInterval(() => {
      void detailQuery.refetch();
      void chartQuery.refetch();
      if (includeOperationalDetails) {
        void tripDetailsQuery.refetch();
      }
      void riskAlertsQuery.refetch();
      void ssaAlertsQuery.refetch();
      void smartAlertsQuery.refetch();
    }, POLLING_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    chartQuery.refetch,
    detailQuery.refetch,
    riskAlertsQuery.refetch,
    smartAlertsQuery.refetch,
    ssaAlertsQuery.refetch,
    tripDetailsQuery.refetch,
    includeOperationalDetails,
  ]);

  const isInitialLoading = detailQuery.isLoading || chartQuery.isLoading;
  const plannedEncodedPolyline =
    plannedRouteQuery.data?.overviewPolyline ??
    plannedRouteQuery.data?.goongRouteOverview ??
    null;

  const handleRefresh = () => {
    void detailQuery.refetch();
    void chartQuery.refetch();
    void plannedRouteQuery.refetch();
    if (includeOperationalDetails) {
      void tripDetailsQuery.refetch();
    }
    void riskAlertsQuery.refetch();
    void ssaAlertsQuery.refetch();
    void smartAlertsQuery.refetch();
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[620px] w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={detailQuery.isFetching || chartQuery.isFetching}
          onClick={handleRefresh}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              detailQuery.isFetching || chartQuery.isFetching
                ? "animate-spin"
                : ""
            }`}
          />
          Làm mới dữ liệu
        </Button>
      </div>
      <TripOverviewPanel
        trip={trip}
        tripDetails={includeOperationalDetails ? tripDetailsQuery.data : undefined}
      />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
        <TrackingMap
          points={points}
          incidents={chartQuery.data?.incidents ?? []}
          latestPoint={latestPoint}
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
          <TemperatureTimeline points={points} selectedPoint={selectedPoint} />
        </div>
      </div>

      <div
        className={
          includeOperationalDetails
            ? "grid gap-4 xl:grid-cols-[1.5fr_0.9fr]"
            : "grid gap-4"
        }
      >
        {includeOperationalDetails && (
          <TrackingOrdersPanel
            tripDetails={tripDetailsQuery.data}
            isLoading={tripDetailsQuery.isLoading}
          />
        )}
        <TrackingAlertsPanel alerts={allAlerts} />
      </div>
    </>
  );
};

export default TripTrackingView;
