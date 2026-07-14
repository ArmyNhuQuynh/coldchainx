import type {
  TWeightTier,
  TWeightTierListResponse,
} from "@/schemas/weight-tier.schema";
import type { BaseResponse } from "@/types/response.type";

export type ApiEnvelope<T> = BaseResponse<T> & {
  Data?: T;
};

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

export const getEnvelopeData = <T>(payload: ApiEnvelope<T>) =>
  payload.data ?? payload.Data;

export const normalizeWeightTier = (
  item: TWeightTier | Record<string, any>
): TWeightTier => {
  const raw = item as Record<string, any>;

  return {
    id: read<string>(raw, "id", "Id"),
    routeId: read<string>(raw, "routeId", "RouteId"),
    minWeightKg: read<number>(raw, "minWeightKg", "MinWeightKg"),
    maxWeightKg: read<number | null | undefined>(
      raw,
      "maxWeightKg",
      "MaxWeightKg"
    ),
    pricePerKg: read<number>(raw, "pricePerKg", "PricePerKg"),
  };
};

export const normalizeWeightTierPage = (
  page?: TWeightTierListResponse
): TWeightTierListResponse | undefined =>
  page
    ? {
        ...page,
        data: page.data.map(normalizeWeightTier),
      }
    : page;
