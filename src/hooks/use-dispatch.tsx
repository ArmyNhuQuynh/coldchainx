import { dispatchApi } from "@/apis/dispatch.api";
import type { TManualDispatchRequest } from "@/schemas/dispatch.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useDispatchPlanning = () => {
  const queryClient = useQueryClient();

  const getReadyLpns = () =>
    useQuery({
      queryKey: ["dispatch", "ready-lpns"],
      queryFn: dispatchApi.getReadyLpns,
      placeholderData: keepPreviousData,
    });

  const getAvailableVehicles = () =>
    useQuery({
      queryKey: ["dispatch", "vehicles"],
      queryFn: dispatchApi.getAvailableVehicles,
      placeholderData: keepPreviousData,
    });

  const getAvailableDrivers = () =>
    useQuery({
      queryKey: ["dispatch", "drivers"],
      queryFn: dispatchApi.getAvailableDrivers,
      placeholderData: keepPreviousData,
    });

  const manualDispatch = useMutation({
    mutationFn: (data: TManualDispatchRequest) => dispatchApi.manualDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });

  return {
    getReadyLpns,
    getAvailableVehicles,
    getAvailableDrivers,
    manualDispatch,
  };
};

export const useDispatchTrips = () => {
  const queryClient = useQueryClient();

  const getCreatedTrips = () =>
    useQuery({
      queryKey: ["dispatch", "trips"],
      queryFn: dispatchApi.getCreatedTrips,
      placeholderData: keepPreviousData,
    });

  const getPickingTripDetail = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "picking-detail", tripId],
      queryFn: async () => {
        if (!tripId) return null;
        const trips = await dispatchApi.getPickingTrips(tripId);
        return trips[0] ?? null;
      },
      enabled: enabled && Boolean(tripId),
    });

  const getTripPickList = (tripId?: string, enabled = true) =>
    useQuery({
      queryKey: ["dispatch", "trips", "pick-list", tripId],
      queryFn: async () => {
        if (!tripId) return [];
        return dispatchApi.getTripPickList(tripId);
      },
      enabled: enabled && Boolean(tripId),
    });

  const cancelTrip = useMutation({
    mutationFn: (tripId: string) => dispatchApi.cancelTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });

  return {
    getCreatedTrips,
    getPickingTripDetail,
    getTripPickList,
    cancelTrip,
  };
};
