import type { TPermission } from "@/schemas/permission.schema";

const MODULE_LABELS: Record<string, string> = {
  AUTHORIZATION: "Quản trị phân quyền",
  WORK_ASSIGNMENT: "Phân công công việc",
  WAREHOUSE: "Vận hành kho",
};

const PERMISSION_TEXTS: Record<
  string,
  { label: string; description: string }
> = {
  "AUTHORIZATION.MATRIX.VIEW": {
    label: "Xem cấu hình phân quyền",
    description: "Xem quyền được cấu hình cho các vai trò và người dùng.",
  },
  "AUTHORIZATION.MATRIX.MANAGE": {
    label: "Quản lý cấu hình phân quyền",
    description: "Cấp hoặc gỡ quyền cho các vai trò và từng người dùng.",
  },
  "WORK_ASSIGNMENT.VIEW_OWN": {
    label: "Xem công việc được giao",
    description: "Xem danh sách công việc được giao cho tài khoản hiện tại.",
  },
  "WORK_ASSIGNMENT.MANAGE": {
    label: "Quản lý phân công công việc",
    description: "Tạo, xem và hủy các công việc đã phân công.",
  },
  "WORK_ASSIGNMENT.EXECUTE": {
    label: "Thực hiện công việc được giao",
    description: "Bắt đầu và hoàn thành công việc đã được phân công.",
  },
  "WAREHOUSE.TASK.VIEW": {
    label: "Xem công việc kho và sai lệch",
    description:
      "Xem công việc kho, danh sách sai lệch, chi tiết sai lệch và biên bản liên quan.",
  },
  "WAREHOUSE.ASN.VIEW": {
    label: "Xem thông báo hàng đến (ASN)",
    description: "Xem thông báo trước về các lô hàng sắp được nhập kho.",
  },
  "WAREHOUSE.RECEIVING.CONFIRM": {
    label: "Xác nhận nhập kho",
    description: "Xác nhận hàng hóa đã được tiếp nhận tại kho.",
  },
  "WAREHOUSE.QC.INSPECT": {
    label: "Kiểm tra chất lượng hàng hóa",
    description: "Thực hiện kiểm tra chất lượng hàng hóa tại kho.",
  },
  "WAREHOUSE.LOADING.CONFIRM": {
    label: "Xác nhận bốc hàng lên xe",
    description: "Xác nhận hàng hóa đã được bốc lên phương tiện vận chuyển.",
  },
  "WAREHOUSE.INVENTORY.COUNT": {
    label: "Kiểm kê tồn kho",
    description: "Kiểm đếm định kỳ và xác minh số lượng hàng tồn kho.",
  },
  "WAREHOUSE.INVENTORY.ADJUST": {
    label: "Điều chỉnh tồn kho",
    description: "Tạo yêu cầu điều chỉnh số lượng hàng tồn kho.",
  },
  "WAREHOUSE.INVENTORY.APPROVE": {
    label: "Duyệt điều chỉnh tồn kho",
    description: "Duyệt các yêu cầu điều chỉnh và sai lệch tồn kho.",
  },
  "WAREHOUSE.INCIDENT.RESOLVE": {
    label: "Xử lý sai lệch tại kho",
    description:
      "Chấp nhận hoặc từ chối sai lệch. Người dùng cần thêm quyền xem công việc kho và sai lệch để mở danh sách.",
  },
};

export const getPermissionModuleLabel = (module: string) =>
  MODULE_LABELS[module.trim().toUpperCase()] ?? module;

export const getPermissionLabel = (permission: TPermission) =>
  PERMISSION_TEXTS[permission.code.trim().toUpperCase()]?.label ??
  permission.displayName;

export const getPermissionDescription = (permission: TPermission) =>
  PERMISSION_TEXTS[permission.code.trim().toUpperCase()]?.description ??
  permission.description;

export const groupPermissionsByModule = (permissions: TPermission[]) =>
  permissions.reduce<Record<string, TPermission[]>>((groups, permission) => {
    const module = permission.module || "OTHER";
    groups[module] = [...(groups[module] ?? []), permission];
    return groups;
  }, {});

export const arePermissionIdsEqual = (
  first: Iterable<string>,
  second: Iterable<string>
) => {
  const left = new Set(first);
  const right = new Set(second);
  return (
    left.size === right.size &&
    Array.from(left).every((permissionId) => right.has(permissionId))
  );
};

export const isAdminPermissionRole = (role?: string | null) =>
  role?.trim().toLowerCase() === "admin";
