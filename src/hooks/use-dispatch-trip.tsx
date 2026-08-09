import { dispatchTripApi } from "@/apis/dispatch-trip.api";
import type { TDispatchTripListQuery } from "@/schemas/dispatch.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useDispatchTrips = () => {
  const queryClient = useQueryClient();

  const getCreatedTrips = () =>
    useQuery({
      queryKey: ["dispatch", "trips"],
      queryFn: dispatchTripApi.getCreatedTrips,
      placeholderData: keepPreviousData,
    });

  const cancelTrip = useMutation({
    mutationFn: (tripId: string) => dispatchTripApi.cancelTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });

  const startPicking = useMutation({
    mutationFn: (tripId: string) => dispatchTripApi.startPicking(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });

  const getTripDocuments = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "documents", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        return dispatchTripApi.getTripDocuments(tripId);
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripRoute = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "route", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        return dispatchTripApi.getTripRoute(tripId);
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripDetails = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "details", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        return dispatchTripApi.getTripDetails(tripId);
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTrips = (params: TDispatchTripListQuery, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "list", params],
      queryFn: () => dispatchTripApi.getTrips(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  return {
    getCreatedTrips,
    cancelTrip,
    startPicking,
    getTripDocuments,
    getTripRoute,
    getTripDetails,
    getTrips,
  };
};
