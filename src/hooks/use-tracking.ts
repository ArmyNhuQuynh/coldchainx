import { useQuery } from "@tanstack/react-query";
import { trackingApi } from "@/apis/tracking.api";

export const useTracking = () => {
  const getTrackingByTripId = (tripId: string | undefined) =>
    useQuery({
      queryKey: ["tracking", tripId],
      queryFn: () => trackingApi.getTrackingByTripId(tripId!),
      enabled: !!tripId,
      refetchInterval: 60000, // auto refetch every 1 min
    });

  return {
    getTrackingByTripId,
  };
};
