import { monitoringApi } from "@/apis/monitoring.api";
import type { TTrackingTripListQuery } from "@/schemas/monitoring.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const TRACKING_DEFAULT_STATUSES = [
  "IN_TRANSIT",
  "DELAYED",
  "SEALED",
  "DISPATCHED",
] as const;

export const useMonitoring = () => {
  const queryClient = useQueryClient();

  const getTrackingTrips = (query: TTrackingTripListQuery) =>
    useQuery({
      queryKey: ["monitoring", "tracking-trips", query],
      queryFn: () => monitoringApi.getTrackingTrips(query),
      placeholderData: keepPreviousData,
    });

  const getTrackingDetail = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["monitoring", "tracking-detail", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        return monitoringApi.getTrackingDetail(tripId);
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripChart = (tripId?: string, enabled = true, maxPoints = 500) =>
    useQuery({
      queryKey: ["monitoring", "trip-chart", tripId, maxPoints],
      queryFn: async () => {
        if (!tripId) return null;
        return monitoringApi.getTripChart(tripId, maxPoints);
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripRouteGoong = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["monitoring", "trip-route-goong", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        return monitoringApi.getTripRouteGoong(tripId);
      },
      enabled: enabled && Boolean(tripId),
      retry: false,
    });

  const getTripAlerts = (
    tripId?: string,
    type: "risk" | "ssa" | "smart" = "risk",
    enabled = true
  ) =>
    useQuery({
      queryKey: ["monitoring", "trip-alerts", tripId, type],
      queryFn: async () => {
        if (!tripId) return [];
        return monitoringApi.getTripAlerts(tripId, type);
      },
      enabled: enabled && Boolean(tripId),
    });

  const checkVehicleIoT = useMutation({
    mutationFn: ({ tripId, vehicleId }: { tripId: string; vehicleId: string }) =>
      monitoringApi.checkVehicleIoT(tripId, vehicleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["monitoring", "tracking-detail", variables.tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["monitoring", "tracking-trips"],
      });
    },
  });

  const checkTripVehicleIoT = useMutation({
    mutationFn: async (tripId: string) => {
      const trip = await monitoringApi.getTrackingDetail(tripId);
      const vehicleId = trip.vehicle?.vehicleId;

      if (!vehicleId) {
        return { trip, iotStatus: null };
      }

      const iotStatus = await monitoringApi.checkVehicleIoT(tripId, vehicleId);
      return { trip, iotStatus };
    },
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({
        queryKey: ["monitoring", "tracking-detail", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["monitoring", "tracking-trips"],
      });
    },
  });

  return {
    getTrackingTrips,
    getTrackingDetail,
    getTripChart,
    getTripRouteGoong,
    getTripAlerts,
    checkVehicleIoT,
    checkTripVehicleIoT,
  };
};
