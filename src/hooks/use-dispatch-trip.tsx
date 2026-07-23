import { dispatchTripApi } from "@/apis/dispatch-trip.api";
import type { TSealAndDispatchRequest } from "@/schemas/dispatch.schema";
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

  const getPickingTripDetail = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "picking-detail", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        const trips = await dispatchTripApi.getPickingTrips(tripId);
        return trips[0] ?? null;
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripPickList = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "pick-list", tripId],
      queryFn: async () => {
        if (!tripId) return [];
        return dispatchTripApi.getTripPickList(tripId);
      },
      enabled: enabled && Boolean(tripId),
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

  const sealAndDispatch = useMutation({
    mutationFn: (data: TSealAndDispatchRequest) =>
      dispatchTripApi.sealAndDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver"] });
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

  return {
    getCreatedTrips,
    getPickingTripDetail,
    getTripPickList,
    cancelTrip,
    startPicking,
    sealAndDispatch,
    getTripDocuments,
    getTripRoute,
  };
};
