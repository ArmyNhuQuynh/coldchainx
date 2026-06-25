import type {
  TDispatchDriverLookup,
  TDispatchReadyLpn,
  TDispatchVehicleLookup,
} from "@/schemas/dispatch.schema";

export const ALL_FILTER_VALUE = "all";

export const formatNumber = (value?: number | null, maximumFractionDigits = 1) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("vi-VN", { maximumFractionDigits })
    : "—";

export const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const formatDate = (value?: string | null) => {
  const key = toDateInputValue(value);
  if (!key) return "—";
  return new Date(`${key}T00:00:00`).toLocaleDateString("vi-VN");
};

export const getLpnWarehouseName = (lpn: TDispatchReadyLpn) => {
  if (lpn.warehouseName) return lpn.warehouseName;
  const labelWarehouse = lpn.label?.match(/Kho:\s*([^|]+)/i)?.[1]?.trim();
  return labelWarehouse || "Chưa có dữ liệu kho";
};

export const getVehicleWarehouseName = (vehicle: TDispatchVehicleLookup) =>
  vehicle.warehouseName || vehicle.currentLocation || "Chưa có dữ liệu kho";

export const getDriverWarehouseName = (driver: TDispatchDriverLookup) =>
  driver.warehouseName || driver.currentLocation || "Chưa có dữ liệu kho";

export const getLpnDispatchDateValue = (lpn: TDispatchReadyLpn) =>
  lpn.plannedDispatchDate ||
  lpn.dispatchDate ||
  lpn.deliveryDate ||
  lpn.slaDeadline ||
  lpn.createdAt ||
  null;

export const getLpnDispatchDateKey = (lpn: TDispatchReadyLpn) =>
  toDateInputValue(getLpnDispatchDateValue(lpn));

export const getTemperatureGroup = (temp?: string | null) => {
  const value = (temp || "").toUpperCase();
  if (value.includes("FROZEN") || value.includes("-18") || value.startsWith("-")) {
    return "FROZEN";
  }
  if (value.includes("CHILLED") || value.includes("2-8") || value.includes("0-4")) {
    return "CHILLED";
  }
  return "AMBIENT";
};

export const getTemperatureGroupLabel = (group: string) => {
  switch (group) {
    case "FROZEN":
      return "Đông lạnh";
    case "CHILLED":
      return "Hàng mát";
    case "AMBIENT":
      return "Nhiệt độ thường";
    default:
      return "Tất cả";
  }
};

export const parseTempRange = (temp?: string | null) => {
  const value = (temp || "").toUpperCase().replaceAll("°", "").replaceAll("C", "");
  const numbers = value.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];

  if (numbers.length >= 2) {
    return { min: Math.min(...numbers), max: Math.max(...numbers) };
  }

  if (numbers.length === 1) {
    const only = numbers[0];
    if (value.includes("FROZEN")) return { min: only, max: -10 };
    return { min: only, max: only };
  }

  const group = getTemperatureGroup(temp);
  if (group === "FROZEN") return { min: -25, max: -10 };
  if (group === "CHILLED") return { min: 0, max: 8 };
  return { min: 15, max: 25 };
};

export const getSelectedTemperatureRange = (lpns: TDispatchReadyLpn[]) => {
  if (!lpns.length) return null;
  const ranges = lpns.map((lpn) => parseTempRange(lpn.tempCondition));
  return {
    min: Math.min(...ranges.map((range) => range.min)),
    max: Math.max(...ranges.map((range) => range.max)),
  };
};

export const isVehicleTempCompatible = (
  vehicle: TDispatchVehicleLookup | undefined,
  lpns: TDispatchReadyLpn[]
) => {
  const range = getSelectedTemperatureRange(lpns);
  if (!vehicle || !range) return true;
  if (typeof vehicle.minTemp !== "number" || typeof vehicle.maxTemp !== "number") {
    return true;
  }

  return vehicle.minTemp <= range.min && vehicle.maxTemp >= range.max;
};

export const getDefaultPlanningWindow = () => {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);

  const end = new Date(start);
  end.setHours(start.getHours() + 8);

  return {
    start: start.toISOString().slice(0, 16),
    end: end.toISOString().slice(0, 16),
  };
};

export const cnPercent = (value: number) => Math.max(0, Math.min(value, 100));
