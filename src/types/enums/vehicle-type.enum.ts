export const VEHICLE_TYPE = {
  REFRIGERATED_TRUCK: "REFRIGERATED_TRUCK",
  FREEZER_TRUCK: "FREEZER_TRUCK",
  CHILLER_TRUCK: "CHILLER_TRUCK",
} as const;

export type TVehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE];

export function getVehicleTypeLabel(type?: string | null): {
  label: string;
  className: string;
} {
  switch (type) {
    case VEHICLE_TYPE.REFRIGERATED_TRUCK:
      return {
        label: "Xe tải lạnh",
        className: "text-cyan-600 bg-cyan-50 border border-cyan-200",
      };
    case VEHICLE_TYPE.FREEZER_TRUCK:
      return {
        label: "Xe đông lạnh",
        className: "text-blue-600 bg-blue-50 border border-blue-200",
      };
    case VEHICLE_TYPE.CHILLER_TRUCK:
      return {
        label: "Xe mát",
        className: "text-teal-600 bg-teal-50 border border-teal-200",
      };
    default:
      return {
        label: type || "Không xác định",
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };
  }
}
