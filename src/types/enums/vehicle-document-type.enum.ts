export const VEHICLE_DOCUMENT_TYPE = {
  REGISTRATION: "REGISTRATION",
  INSURANCE: "INSURANCE",
  CITY_PERMIT: "CITY_PERMIT",
} as const;

export type TVehicleDocumentType =
  (typeof VEHICLE_DOCUMENT_TYPE)[keyof typeof VEHICLE_DOCUMENT_TYPE];

export const VEHICLE_DOCUMENT_TYPE_OPTIONS = [
  { value: VEHICLE_DOCUMENT_TYPE.REGISTRATION, label: "Đăng ký/đăng kiểm" },
  { value: VEHICLE_DOCUMENT_TYPE.INSURANCE, label: "Bảo hiểm" },
  { value: VEHICLE_DOCUMENT_TYPE.CITY_PERMIT, label: "Giấy phép vào phố" },
];

export function getVehicleDocumentTypeLabel(type: string | null | undefined) {
  const option = VEHICLE_DOCUMENT_TYPE_OPTIONS.find(
    (item) => item.value === type
  );
  return option?.label ?? type ?? "Không xác định";
}
