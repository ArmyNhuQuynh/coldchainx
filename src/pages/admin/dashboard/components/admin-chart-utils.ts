import { formatDashboardPeriod } from "@/components/dashboard/dashboard-formatters";
import type {
  TStatusCount,
  TWarehouseResourceCount,
} from "@/schemas/dashboard.schema";
import { getDashboardLabel } from "@/types/enums/dashboard.enum";

export const ADMIN_CHART_COLORS = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#7c3aed",
  "#475569",
  "#db2777",
];

export const ADMIN_ORDER_STAGES = [
  {
    key: "review",
    label: "Tiếp nhận & duyệt",
    color: "#0f766e",
    statuses: ["DRAFT", "PENDING_REVIEW", "NEEDS_UPDATE", "APPROVED"],
  },
  {
    key: "commercial",
    label: "Báo giá & hợp đồng",
    color: "#7c3aed",
    statuses: ["QUOTING", "CONTRACT_PENDING", "CONTRACT_SIGNED"],
  },
  {
    key: "warehouse",
    label: "Nhập kho",
    color: "#d97706",
    statuses: [
      "RECEIVING",
      "IN_WAREHOUSE",
      "IN_STOCK",
      "DISCREPANCY_HOLD",
    ],
  },
  {
    key: "transport",
    label: "Đang vận chuyển",
    color: "#2563eb",
    statuses: [
      "RETURN_PENDING",
      "LOADING",
      "SEALED",
      "SHIPPING",
      "DISPATCHED",
      "IN_TRANSIT",
      "PARTIALLY_DELIVERED",
    ],
  },
  {
    key: "completed",
    label: "Hoàn tất",
    color: "#16a34a",
    statuses: ["DELIVERED", "RETURNED"],
  },
  {
    key: "closed",
    label: "Hủy / từ chối",
    color: "#dc2626",
    statuses: ["REJECTED", "CANCELLED"],
  },
  {
    key: "other",
    label: "Trạng thái khác",
    color: "#64748b",
    statuses: [],
  },
] as const;

const ORDER_STAGE_BY_STATUS = new Map(
  ADMIN_ORDER_STAGES.flatMap((stage) =>
    stage.statuses.map((status) => [status, stage.key] as const)
  )
);

export const getOrderStageKey = (status: string) =>
  ORDER_STAGE_BY_STATUS.get(status.toUpperCase()) ?? "other";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#059669",
  AVAILABLE: "#059669",
  ONLINE: "#10b981",
  COMPLETED: "#16a34a",
  DELIVERED: "#16a34a",
  IN_TRANSIT: "#2563eb",
  ONTRIP: "#2563eb",
  ON_TRIP: "#2563eb",
  SHIPPING: "#2563eb",
  PLANNED: "#0891b2",
  PLANNING: "#0891b2",
  LOADING: "#d97706",
  PICKING: "#d97706",
  MAINTENANCE: "#ea580c",
  MAINTENANCE_PENDING: "#f59e0b",
  DELAYED: "#dc2626",
  OFFLINE: "#dc2626",
  SUSPENDED_DOCS: "#dc2626",
  INACTIVE: "#64748b",
  UNASSIGNED: "#94a3b8",
  UNKNOWN: "#94a3b8",
};

export const getAdminChartColor = (key: string, index: number) =>
  STATUS_COLORS[key.toUpperCase()] ??
  ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length];

export const toStatusDonutData = (items: TStatusCount[]) =>
  items.map((item, index) => ({
    name: getDashboardLabel(item.status),
    value: item.count,
    color: getAdminChartColor(item.status, index),
  }));

export const toWarehouseDonutData = (items: TWarehouseResourceCount[]) =>
  items.map((item, index) => ({
    name: item.warehouseName,
    value: item.count,
    color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
  }));

export const toWarehouseBarData = (items: TWarehouseResourceCount[]) => {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return items.map((item, index) => ({
    label: item.warehouseName,
    count: item.count,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
    color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
  }));
};

export const getStatusCount = (items: TStatusCount[], ...statuses: string[]) =>
  items
    .filter((item) => statuses.includes(item.status.toUpperCase()))
    .reduce((sum, item) => sum + item.count, 0);

export const formatAdminPeriod = (period: string, groupBy: "WEEK" | "MONTH") =>
  groupBy === "WEEK"
    ? `Tuần ${formatDashboardPeriod(period)}`
    : new Intl.DateTimeFormat("vi-VN", {
        month: "2-digit",
        year: "numeric",
      }).format(new Date(period));
