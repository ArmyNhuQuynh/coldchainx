import { dispatchLookupApi } from "@/apis/dispatch-lookup.api";
import type {
  TCompatibleLpnsSearchParams,
  TCompatibleLpnsSearchRequest,
} from "@/schemas/dispatch.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useDispatchLookup = () => {
  const getSchedules = () =>
    useQuery({
      queryKey: ["dispatch", "schedules"],
      queryFn: dispatchLookupApi.getSchedules,
      placeholderData: keepPreviousData,
      retry: (failureCount, error: any) =>
        (error?.response?.status ?? 500) >= 500 && failureCount < 2,
    });

  const searchCompatibleLpns = (
    data: TCompatibleLpnsSearchRequest | undefined,
    params: TCompatibleLpnsSearchParams
  ) =>
    useQuery({
      queryKey: ["dispatch", "compatible-lpns", data, params],
      queryFn: () => dispatchLookupApi.searchCompatibleLpns(data!, params),
      enabled: Boolean(data?.scheduleId),
    });

  const getAvailableVehicles = (warehouseId?: string | null) =>
    useQuery({
      queryKey: ["dispatch", "vehicles", "warehouse", warehouseId],
      queryFn: () => dispatchLookupApi.getAvailableVehicles(warehouseId!),
      enabled: Boolean(warehouseId),
    });

  const getAvailableDrivers = (warehouseId?: string | null) =>
    useQuery({
      queryKey: ["dispatch", "drivers", "warehouse", warehouseId],
      queryFn: () => dispatchLookupApi.getAvailableDrivers(warehouseId!),
      enabled: Boolean(warehouseId),
    });

  return {
    getSchedules,
    searchCompatibleLpns,
    getAvailableVehicles,
    getAvailableDrivers,
  };
};
