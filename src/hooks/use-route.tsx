import { routeApi } from "@/apis/route.api";
import type {
  TRouteListParams,
  TRouteRequest,
  TRouteStopListParams,
  TRouteStopRequest,
  TUpdateRouteRequest,
} from "@/schemas/route.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useRoute = () => {
  const queryClient = useQueryClient();

  const getRoutes = (params: TRouteListParams) =>
    useQuery({
      queryKey: ["routes", "list", params],
      queryFn: () => routeApi.getRouteOptions(params),
      placeholderData: keepPreviousData,
    });

  const getRouteById = (id?: string) =>
    useQuery({
      queryKey: ["route", id],
      queryFn: () => routeApi.getRouteById(id!),
      enabled: !!id,
    });

  const getRouteStops = (
    routeId?: string,
    params: TRouteStopListParams = { pageIndex: 1, pageSize: 10 }
  ) =>
    useQuery({
      queryKey: ["route", routeId, "stops", params],
      queryFn: () => routeApi.getRouteStops(routeId!, params),
      enabled: !!routeId,
      placeholderData: keepPreviousData,
    });

  const getRouteOriginWarehouses = (routeId?: string) =>
    useQuery({
      queryKey: ["route", routeId, "origin-warehouses"],
      queryFn: () => routeApi.getRouteOriginWarehouses(routeId!),
      enabled: !!routeId,
    });

  const createRoute = useMutation({
    mutationFn: (data: TRouteRequest) => routeApi.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  const updateRoute = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateRouteRequest }) =>
      routeApi.updateRoute(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", id] });
    },
  });

  const deleteRoute = useMutation({
    mutationFn: (id: string) => routeApi.deleteRoute(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", id] });
    },
  });

  const createRouteStop = useMutation({
    mutationFn: ({
      routeId,
      data,
    }: {
      routeId: string;
      data: TRouteStopRequest;
    }) => routeApi.createRouteStop(routeId, data),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route", routeId, "stops"] });
    },
  });

  const updateRouteStop = useMutation({
    mutationFn: ({
      routeId,
      stopId,
      data,
    }: {
      routeId: string;
      stopId: string;
      data: TRouteStopRequest;
    }) => routeApi.updateRouteStop(routeId, stopId, data),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route", routeId, "stops"] });
    },
  });

  const deleteRouteStop = useMutation({
    mutationFn: ({ routeId, stopId }: { routeId: string; stopId: string }) =>
      routeApi.deleteRouteStop(routeId, stopId),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route", routeId, "stops"] });
    },
  });

  return {
    getRoutes,
    getRouteById,
    getRouteStops,
    getRouteOriginWarehouses,
    createRoute,
    updateRoute,
    deleteRoute,
    createRouteStop,
    updateRouteStop,
    deleteRouteStop,
  };
};
