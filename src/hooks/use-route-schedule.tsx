import { routeScheduleApi } from "@/apis/route-schedule.api";
import type {
  TRouteScheduleCreateRequest,
  TRouteScheduleListParams,
  TRouteScheduleUpdateRequest,
} from "@/schemas/route-schedule.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useRouteSchedule = () => {
  const queryClient = useQueryClient();

  const getRouteSchedules = (
    routeId?: string,
    params: TRouteScheduleListParams = { pageIndex: 1, pageSize: 10 },
    enabled = true
  ) =>
    useQuery({
      queryKey: ["route-schedules", routeId, params],
      queryFn: () => routeScheduleApi.getRouteSchedules(routeId!, params),
      enabled: enabled && !!routeId,
      placeholderData: keepPreviousData,
    });

  const createRouteSchedule = useMutation({
    mutationFn: ({
      routeId,
      data,
    }: {
      routeId: string;
      data: TRouteScheduleCreateRequest;
    }) => routeScheduleApi.createRouteSchedule(routeId, data),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route-schedules"] });
    },
  });

  const updateRouteSchedule = useMutation({
    mutationFn: ({
      routeId,
      scheduleId,
      data,
    }: {
      routeId: string;
      scheduleId: string;
      data: TRouteScheduleUpdateRequest;
    }) => routeScheduleApi.updateRouteSchedule(routeId, scheduleId, data),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch", "schedules"] });
    },
  });

  const deleteRouteSchedule = useMutation({
    mutationFn: ({
      routeId,
      scheduleId,
    }: {
      routeId: string;
      scheduleId: string;
    }) => routeScheduleApi.deleteRouteSchedule(routeId, scheduleId),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: ["route-schedules"] });
    },
  });

  return {
    getRouteSchedules,
    createRouteSchedule,
    updateRouteSchedule,
    deleteRouteSchedule,
  };
};
