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
    params: TRouteScheduleListParams = { pageIndex: 1, pageSize: 10 }
  ) =>
    useQuery({
      queryKey: ["route-schedules", routeId, params],
      queryFn: () => routeScheduleApi.getRouteSchedules(routeId!, params),
      enabled: !!routeId,
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
      queryClient.invalidateQueries({ queryKey: ["route-schedules", routeId] });
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
      queryClient.invalidateQueries({ queryKey: ["route-schedules", routeId] });
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
      queryClient.invalidateQueries({ queryKey: ["route-schedules", routeId] });
    },
  });

  return {
    getRouteSchedules,
    createRouteSchedule,
    updateRouteSchedule,
    deleteRouteSchedule,
  };
};
