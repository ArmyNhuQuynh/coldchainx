import type {
  TRoute,
  TRouteFormValues,
  TRouteRequest,
  TRouteStop,
  TRouteStopFormValues,
  TRouteStopRequest,
  TUpdateRouteRequest,
} from "@/schemas/route.schema";
import {
  ROUTE_FORM_DEFAULTS,
  ROUTE_STOP_FORM_DEFAULTS,
} from "@/schemas/route.schema";

export const getRouteFormDefaultValues = (
  route?: TRoute
): TRouteFormValues => ({
  routeCode: route?.routeCode ?? ROUTE_FORM_DEFAULTS.routeCode,
  originCity: route?.originCity ?? ROUTE_FORM_DEFAULTS.originCity,
  destCity: route?.destCity ?? ROUTE_FORM_DEFAULTS.destCity,
  transitTime: route?.transitTime ?? ROUTE_FORM_DEFAULTS.transitTime,
  status: route?.status ?? ROUTE_FORM_DEFAULTS.status,
});

export const toCreateRouteRequest = (
  values: TRouteFormValues
): TRouteRequest => ({
  routeCode: values.routeCode.trim().toUpperCase(),
  originCity: values.originCity.trim(),
  destCity: values.destCity.trim(),
  transitTime: values.transitTime.trim(),
});

export const toUpdateRouteRequest = (
  values: TRouteFormValues
): TUpdateRouteRequest => ({
  ...toCreateRouteRequest(values),
  status: values.status,
});

export const getRouteStopFormDefaultValues = (
  stop?: TRouteStop | null
): TRouteStopFormValues => ({
  stopName: stop?.stopName ?? ROUTE_STOP_FORM_DEFAULTS.stopName,
});

export const toRouteStopRequest = (
  values: TRouteStopFormValues
): TRouteStopRequest => ({
  stopName: values.stopName.trim(),
});
