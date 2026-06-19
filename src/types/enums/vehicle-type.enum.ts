export const VEHICLE_TYPE = {
  TRUCK: "TRUCK",
  VAN: "VAN",
  REFRIGERATED: "REFRIGERATED",
  FLATBED: "FLATBED",
  CONTAINER: "CONTAINER",
  TANKER: "TANKER",
} as const;

export type TVehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE];

export function getVehicleTypeLabel(type: string | null): string {
  const normalized = type?.trim().toUpperCase();

  switch (normalized) {
    case VEHICLE_TYPE.TRUCK:
      return "Xe tải";
    case VEHICLE_TYPE.VAN:
      return "Xe Van";
    case VEHICLE_TYPE.REFRIGERATED:
      return "Xe lạnh";
    case VEHICLE_TYPE.FLATBED:
      return "Xe thùng lửng";
    case VEHICLE_TYPE.CONTAINER:
      return "Xe container";
    case VEHICLE_TYPE.TANKER:
      return "Xe bồn";
    default:
      return type ?? "Không xác định";
  }
}
