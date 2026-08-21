import type {
  TDispatchCompatibilityConflict,
  TDispatchPackingResult,
  TDispatchReadyLpn,
  TDispatchScheduleLookup,
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

export const getCompatibilityReasonCode = (
  conflict: Pick<TDispatchCompatibilityConflict, "reasonCode">
) => conflict.reasonCode?.trim().toUpperCase();

export const isScheduleConflict = (
  conflict: Pick<TDispatchCompatibilityConflict, "reasonCode">
) => getCompatibilityReasonCode(conflict) === "DIFFERENT_SCHEDULE";

export const getBlockingCompatibilityConflicts = (
  conflicts: TDispatchCompatibilityConflict[] = []
) => conflicts.filter((conflict) => !isScheduleConflict(conflict));

const isAllowedBlockingReason = (reason: string) =>
  getBlockingReasonCode(reason) !== "DIFFERENT_SCHEDULE";

const resolveScheduleDeadline = (
  lpn: TDispatchReadyLpn,
  schedules: TDispatchScheduleLookup[] = []
) => {
  const schedule = schedules.find((item) => item.scheduleId === lpn.scheduleId);
  if (schedule?.departureDate && schedule.departureTime) {
    const date = schedule.departureDate.slice(0, 10);
    const time = schedule.departureTime.slice(0, 5);
    const value = new Date(`${date}T${time}`);
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (!lpn.plannedDispatchDate) return null;
  const hasTime = /T\d{2}:\d{2}/.test(lpn.plannedDispatchDate);
  const value = new Date(
    hasTime ? lpn.plannedDispatchDate : `${lpn.plannedDispatchDate.slice(0, 10)}T23:59:59`
  );

  return Number.isNaN(value.getTime()) ? null : value;
};

export const isLpnPastSchedule = (
  lpn: TDispatchReadyLpn,
  schedules: TDispatchScheduleLookup[] = [],
  now = new Date()
) => {
  const deadline = resolveScheduleDeadline(lpn, schedules);
  return Boolean(deadline && deadline.getTime() < now.getTime());
};

export const formatScheduleDeadline = (
  lpn: TDispatchReadyLpn,
  schedules: TDispatchScheduleLookup[] = []
) => {
  const schedule = schedules.find((item) => item.scheduleId === lpn.scheduleId);
  if (schedule?.departureDate && schedule.departureTime) {
    const date = schedule.departureDate.slice(0, 10);
    const time = schedule.departureTime.slice(0, 5);
    const value = new Date(`${date}T${time}`);
    if (!Number.isNaN(value.getTime())) {
      return value.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  if (!lpn.plannedDispatchDate) return "Chưa có lịch";

  const hasTime = /T\d{2}:\d{2}/.test(lpn.plannedDispatchDate);
  const deadline = new Date(lpn.plannedDispatchDate);
  if (Number.isNaN(deadline.getTime())) return "Chưa có lịch";

  if (!hasTime) {
    return deadline.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return deadline.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPackageSummary = (lpn: TDispatchReadyLpn) => {
  const lines = (
    lpn.actualPackageLines?.length
      ? lpn.actualPackageLines
      : lpn.packageLines ?? []
  ).filter((line) => line.quantity > 0);

  if (lines.length === 0) {
    return lpn.quantity ? `${formatNumber(lpn.quantity, 0)} kiện` : "Chưa có chi tiết loại thùng";
  }

  return lines
    .map((line) => {
      const label =
        line.label?.trim() ||
        (line.capacityKg ? `Thùng ${formatNumber(line.capacityKg, 0)} kg` : "Loại thùng");
      return `${label}: ${formatNumber(line.quantity, 0)} cái`;
    })
    .join(" · ");
};

export const getPackingBlockingMessages = (
  preview: Pick<TDispatchPackingResult, "blockingReasons" | "unplacedLpnIds">
) => {
  const unplacedCount = preview.unplacedLpnIds.length;

  const messages = preview.blockingReasons.filter(isAllowedBlockingReason).map((reason) => {
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
      case "INVALID_LPN_STATE":
        return "Một số LPN đã được ghép chuyến hoặc không còn nằm trong kho. Vui lòng làm mới danh sách LPN.";
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
