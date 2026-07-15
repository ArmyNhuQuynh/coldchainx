export const VEHICLE_DOCUMENT_TYPE = {
  REGISTRATION: "REGISTRATION",
  INSURANCE: "INSURANCE",
  CITY_PERMIT: "CITY_PERMIT",
  FOOD_SAFETY: "FOOD_SAFETY",
} as const;

export type TVehicleDocumentType =
  (typeof VEHICLE_DOCUMENT_TYPE)[keyof typeof VEHICLE_DOCUMENT_TYPE];

export const VEHICLE_DOCUMENT_TYPE_OPTIONS = [
  { value: VEHICLE_DOCUMENT_TYPE.REGISTRATION, label: "Đăng ký/đăng kiểm" },
  { value: VEHICLE_DOCUMENT_TYPE.INSURANCE, label: "Bảo hiểm" },
  { value: VEHICLE_DOCUMENT_TYPE.CITY_PERMIT, label: "Giấy phép vào phố" },
  { value: VEHICLE_DOCUMENT_TYPE.FOOD_SAFETY, label: "An toàn thực phẩm" },
];

export function getVehicleDocumentTypeLabel(type: string | null | undefined) {
  const option = VEHICLE_DOCUMENT_TYPE_OPTIONS.find(
    (item) => item.value === type
  );
  return option?.label ?? type ?? "Không xác định";
}
