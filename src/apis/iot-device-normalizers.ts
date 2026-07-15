import type { TIotDevice } from "@/schemas/iot-device.schema";

type ApiEnvelope<T> = {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: T;
  Data?: T;
  error?: string;
  Error?: string;
};

const read = <T>(source: Record<string, any>, ...keys: string[]): T | null => {
  for (const key of keys) {
    if (source[key] !== undefined) return source[key] as T;
  }

  return null;
};

export const unwrapIotEnvelope = <T>(payload: ApiEnvelope<T> | T): T => {
  const raw = payload as ApiEnvelope<T>;

  if (raw.data !== undefined) return raw.data as T;
  if (raw.Data !== undefined) return raw.Data as T;

  return payload as T;
};

export const normalizeIotDevice = (
  item: TIotDevice | Record<string, any>
): TIotDevice => {
  const raw = item as Record<string, any>;

  return {
    deviceId: read<string>(raw, "deviceId", "DeviceId") ?? "",
    deviceCode: read<string | null>(raw, "deviceCode", "DeviceCode"),
    vehicleId: read<string | null>(raw, "vehicleId", "VehicleId"),
    truckPlate: read<string | null>(raw, "truckPlate", "TruckPlate"),
    batteryLevel: read<number | null>(raw, "batteryLevel", "BatteryLevel"),
    status: read<string | null>(raw, "status", "Status"),
    lastPingTime: read<string | null>(raw, "lastPingTime", "LastPingTime"),
    createdAt: read<string | null>(raw, "createdAt", "CreatedAt"),
    isOnline: read<boolean | null>(raw, "isOnline", "IsOnline"),
  };
};

export const normalizeIotDeviceList = (payload: unknown): TIotDevice[] => {
  const data = unwrapIotEnvelope(payload as ApiEnvelope<unknown>);
  if (!Array.isArray(data)) return [];

  return data.map((item) => normalizeIotDevice(item as Record<string, any>));
};

export const normalizeCreatedIotDeviceId = (payload: unknown): string | null => {
  const data = unwrapIotEnvelope(payload as ApiEnvelope<unknown>);
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return normalizeIotDevice(data as Record<string, any>).deviceId;
  }

  return null;
};
