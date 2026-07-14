import {
  ROUTE_SCHEDULE_FORM_DEFAULTS,
  type TRouteSchedule,
  type TRouteScheduleFormValues,
} from "@/schemas/route-schedule.schema";

export type RouteScheduleFormErrors = Partial<
  Record<keyof TRouteScheduleFormValues, string>
>;

export const formatScheduleDate = (value?: string | null) => {
  if (!value) return "—";

  const normalized = value.slice(0, 10);
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return normalized;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatScheduleTime = (value?: string | null) => {
  if (!value) return "—";
  return value.slice(0, 5);
};

export const toApiTime = (value: string) =>
  value.length === 5 ? `${value}:00` : value;

export const toRouteScheduleFormState = (
  schedule?: TRouteSchedule | null
): TRouteScheduleFormValues => ({
  routeId: schedule?.routeId ?? ROUTE_SCHEDULE_FORM_DEFAULTS.routeId,
  departureDate:
    schedule?.departureDate?.slice(0, 10) ??
    ROUTE_SCHEDULE_FORM_DEFAULTS.departureDate,
  departureTime: schedule?.departureTime
    ? formatScheduleTime(schedule.departureTime)
    : ROUTE_SCHEDULE_FORM_DEFAULTS.departureTime,
  cutOffTime: schedule?.cutOffTime
    ? formatScheduleTime(schedule.cutOffTime)
    : ROUTE_SCHEDULE_FORM_DEFAULTS.cutOffTime,
  status: schedule?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
});

export const collectRouteScheduleFormErrors = (
  issues: Array<{ path: PropertyKey[]; message: string }>
): RouteScheduleFormErrors =>
  issues.reduce<RouteScheduleFormErrors>((result, issue) => {
    const key = issue.path[0] as keyof TRouteScheduleFormValues | undefined;
    if (key && !result[key]) {
      result[key] = issue.message;
    }
    return result;
  }, {});
