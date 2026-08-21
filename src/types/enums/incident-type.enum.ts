export const INCIDENT_TYPE = {
  ACCIDENT: "ACCIDENT",
  VEHICLE_BREAKDOWN: "VEHICLE_BREAKDOWN",
  REEFER_BREAKDOWN: "REEFER_BREAKDOWN",
  TEMP_EXCURSION: "TEMP_EXCURSION",
  DAMAGE_CARGO: "DAMAGE_CARGO",
  DELAY: "DELAY",
  CUSTOMER_NO_SHOW_RETURN: "CUSTOMER_NO_SHOW_RETURN",
} as const;

export type TIncidentType =
  (typeof INCIDENT_TYPE)[keyof typeof INCIDENT_TYPE];

export const normalizeIncidentType = (
  type?: string | null
): TIncidentType | null => {
  if (!type) return null;

  const normalized = type.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case INCIDENT_TYPE.ACCIDENT:
      return INCIDENT_TYPE.ACCIDENT;
    case INCIDENT_TYPE.VEHICLE_BREAKDOWN:
      return INCIDENT_TYPE.VEHICLE_BREAKDOWN;
    case INCIDENT_TYPE.REEFER_BREAKDOWN:
      return INCIDENT_TYPE.REEFER_BREAKDOWN;
    case INCIDENT_TYPE.TEMP_EXCURSION:
      return INCIDENT_TYPE.TEMP_EXCURSION;
    case INCIDENT_TYPE.DAMAGE_CARGO:
      return INCIDENT_TYPE.DAMAGE_CARGO;
    case INCIDENT_TYPE.DELAY:
      return INCIDENT_TYPE.DELAY;
    case INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN:
      return INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN;
    default:
      return null;
  }
};

export const getIncidentTypeLabel = (type?: string | null) => {
  switch (normalizeIncidentType(type)) {
    case INCIDENT_TYPE.ACCIDENT:
      return "Tai nạn";
    case INCIDENT_TYPE.VEHICLE_BREAKDOWN:
      return "Hỏng xe";
    case INCIDENT_TYPE.REEFER_BREAKDOWN:
      return "Hỏng thùng lạnh";
    case INCIDENT_TYPE.TEMP_EXCURSION:
      return "Sai lệch nhiệt độ";
    case INCIDENT_TYPE.DAMAGE_CARGO:
      return "Hư hỏng hàng hóa";
    case INCIDENT_TYPE.DELAY:
      return "Chậm hành trình";
    case INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN:
      return "Khách vắng mặt · hàng trả về kho";
    default:
      return type || "Không xác định";
  }
};

export const INCIDENT_TYPE_OPTIONS = Object.values(INCIDENT_TYPE).map(
  (value) => ({
    value,
    label: getIncidentTypeLabel(value),
  })
);
