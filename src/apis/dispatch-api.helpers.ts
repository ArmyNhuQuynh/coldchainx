import type { TDispatchLookupEnvelope } from "@/schemas/dispatch.schema";

export const unwrapLookup = <T>(
  payload: TDispatchLookupEnvelope<T[]> | T[]
): T[] => {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.Data ?? [];
};

export const unwrapData = <T>(payload: TDispatchLookupEnvelope<T> | T): T => {
  if (
    payload &&
    typeof payload === "object" &&
    ("data" in payload || "Data" in payload)
  ) {
    const envelope = payload as TDispatchLookupEnvelope<T>;
    return (envelope.data ?? envelope.Data) as T;
  }

  return payload as T;
};

export const read = <T>(
  item: Record<string, any>,
  camelKey: string,
  pascalKey: string
): T => (item[camelKey] ?? item[pascalKey]) as T;

export const toNumber = (value: unknown) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};
