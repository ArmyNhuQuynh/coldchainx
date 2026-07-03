import { dispatchLookupApi } from "@/apis/dispatch-lookup.api";
import type { TDispatchReadyLpnQuery } from "@/schemas/dispatch.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useDispatchLookup = () => {
  const getReadyLpns = (params?: TDispatchReadyLpnQuery) =>
    useQuery({
      queryKey: ["dispatch", "ready-lpns", params],
      queryFn: () => dispatchLookupApi.getReadyLpns(params),
      placeholderData: keepPreviousData,
    });

  const getAvailableVehicles = () =>
    useQuery({
      queryKey: ["dispatch", "vehicles"],
      queryFn: dispatchLookupApi.getAvailableVehicles,
      placeholderData: keepPreviousData,
    });

  const getAvailableDrivers = () =>
    useQuery({
      queryKey: ["dispatch", "drivers"],
      queryFn: dispatchLookupApi.getAvailableDrivers,
      placeholderData: keepPreviousData,
    });

  return {
    getReadyLpns,
    getAvailableVehicles,
    getAvailableDrivers,
  };
};
