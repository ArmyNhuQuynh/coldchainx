import type {
  TDispatchPackingResult,
  TDispatchReadyLpn,
} from "@/schemas/dispatch.schema";
import { DISPATCH_TEMPERATURE_GROUP } from "@/types/enums/dispatch.enum";

export const formatNumber = (value?: number | null, maximumFractionDigits = 1) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("vi-VN", { maximumFractionDigits })
    : "—";

export const getLpnWarehouseName = (lpn: TDispatchReadyLpn) => {
  if (lpn.warehouseName) return lpn.warehouseName;
  return "Chưa có dữ liệu kho";
};

export const getTemperatureGroup = (temp?: string | null) => {
  const value = (temp || "").toUpperCase();
  if (value.includes("FROZEN") || value.includes("-18") || value.startsWith("-")) {
    return DISPATCH_TEMPERATURE_GROUP.FROZEN;
  }
  if (value.includes("CHILLED") || value.includes("2-8") || value.includes("0-4")) {
    return DISPATCH_TEMPERATURE_GROUP.CHILLED;
  }
  return DISPATCH_TEMPERATURE_GROUP.AMBIENT;
};

export const getTemperatureGroupLabel = (group: string) => {
  switch (group) {
    case DISPATCH_TEMPERATURE_GROUP.FROZEN:
      return "Đông lạnh";
    case DISPATCH_TEMPERATURE_GROUP.CHILLED:
      return "Hàng mát";
    case DISPATCH_TEMPERATURE_GROUP.AMBIENT:
      return "Nhiệt độ thường";
    default:
      return "Tất cả";
  }
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

const getBlockingReasonCode = (reason: string) =>
  reason.split(":", 1)[0]?.trim().toUpperCase();

export const getPackingBlockingMessages = (
  preview: Pick<TDispatchPackingResult, "blockingReasons" | "unplacedLpnIds">
) => {
  const unplacedCount = preview.unplacedLpnIds.length;

  const messages = preview.blockingReasons.map((reason) => {
    switch (getBlockingReasonCode(reason)) {
      case "PACKING_FAILED":
        return unplacedCount > 0
          ? `Còn ${unplacedCount} kiện chưa xếp được vào xe. Vui lòng đổi xe lớn hơn hoặc bỏ bớt LPN.`
          : "Một số kiện chưa xếp được vào xe. Vui lòng đổi xe hoặc điều chỉnh danh sách LPN.";
      case "OVERWEIGHT":
        return "Tổng khối lượng hàng vượt quá tải trọng cho phép của xe.";
      case "OVERCAPACITY":
        return "Tổng thể tích hàng vượt quá sức chứa cho phép của xe.";
      case "INVALID_VEHICLE_STATE":
        return "Xe đã chọn hiện không khả dụng cho chuyến này.";
      case "DIFFERENT_SCHEDULE":
        return "Danh sách LPN không thuộc cùng lịch vận chuyển đã chọn.";
      case "CATEGORY_MISMATCH":
      case "PHARMA_ISOLATION":
      case "STRONG_ODOR":
        return "Một số loại hàng trong danh sách không được phép ghép chung.";
      case "TEMPERATURE_MISMATCH":
      case "TEMPERATURE_OUT_OF_RANGE":
      case "VEHICLE_TEMPERATURE_MISMATCH":
        return "Dải nhiệt của xe không phù hợp với yêu cầu bảo quản của hàng hóa.";
      default:
        return "Lựa chọn hiện tại chưa đáp ứng điều kiện tạo chuyến. Vui lòng kiểm tra lại lịch, LPN và xe.";
    }
  });

  return [...new Set(messages)];
};
