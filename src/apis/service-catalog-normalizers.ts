import type { TServiceCatalog } from "@/schemas/service-catalog.schema";
import type { BaseResponse } from "@/types/response.type";

export type ApiEnvelope<T> = BaseResponse<T> & {
  Data?: T;
};

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

export const getEnvelopeData = <T>(payload: ApiEnvelope<T>) =>
  payload.data ?? payload.Data;

export const normalizeServiceCatalog = (
  item: TServiceCatalog | Record<string, any>
): TServiceCatalog => {
  const raw = item as Record<string, any>;

  return {
    serviceCatalogId: read<string>(
      raw,
      "serviceCatalogId",
      "ServiceCatalogId"
    ),
    serviceCode: read<string>(raw, "serviceCode", "ServiceCode"),
    serviceName: read<string>(raw, "serviceName", "ServiceName"),
    description: read<string | null | undefined>(
      raw,
      "description",
      "Description"
    ),
    defaultPrice: Number(read<number>(raw, "defaultPrice", "DefaultPrice") ?? 0),
    isMandatory: Boolean(read<boolean>(raw, "isMandatory", "IsMandatory")),
    isActive: Boolean(read<boolean>(raw, "isActive", "IsActive")),
    createdAt: read<string | null | undefined>(raw, "createdAt", "CreatedAt"),
    updatedAt: read<string | null | undefined>(raw, "updatedAt", "UpdatedAt"),
  };
};
