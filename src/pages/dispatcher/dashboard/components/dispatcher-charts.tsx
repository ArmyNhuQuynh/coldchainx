import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardBarChart,
  DashboardDonutChart,
} from "@/components/dashboard/dashboard-charts";
import type {
  TDispatcherOverview,
  TStatusCount,
  TWarehouseResourceCount,
} from "@/schemas/dashboard.schema";

const WAREHOUSE_COLORS = [
  "#0f766e",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#64748b",
];

const ROUTE_COLORS = [
  "#2563eb",
  "#0f766e",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#dc2626",
  "#4f46e5",
];

const VEHICLE_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Khả dụng",
  ON_TRIP: "Đang vận chuyển",
  DOCUMENT_ISSUE: "Thiếu hoặc hết hạn giấy tờ",
  IOT_MISSING: "Chưa gắn thiết bị IoT",
  MAINTENANCE: "Đang bảo trì",
  PLANNING: "Đã xếp lịch",
  INACTIVE: "Không hoạt động",
};

const DRIVER_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Khả dụng",
  ON_TRIP: "Đang thực hiện chuyến",
  DOCUMENT_ISSUE: "Giấy phép không hợp lệ",
  RESTING: "Đang nghỉ bắt buộc",
  INACTIVE: "Không hoạt động",
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#0f766e",
  ON_TRIP: "#2563eb",
  DOCUMENT_ISSUE: "#f59e0b",
  IOT_MISSING: "#db2777",
  MAINTENANCE: "#dc2626",
  PLANNING: "#7c3aed",
  RESTING: "#0891b2",
  INACTIVE: "#64748b",
};

const toWarehouseDonut = (items: TWarehouseResourceCount[]) =>
  items
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      name: item.warehouseName,
      value: item.count,
      color: WAREHOUSE_COLORS[index % WAREHOUSE_COLORS.length],
    }));

const toStatusDonut = (
  items: TStatusCount[],
  labels: Record<string, string>
) =>
  items
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: labels[item.status] ?? item.status,
      value: item.count,
      color: STATUS_COLORS[item.status] ?? "#64748b",
    }));

const routeColor = (routeId: string) => {
  const hash = Array.from(routeId).reduce(
    (value, character) => value + character.charCodeAt(0),
    0
  );
  return ROUTE_COLORS[hash % ROUTE_COLORS.length];
};

const lightenHex = (hex: string, ratio = 0.58) => {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = value >> 16;
  const green = (value >> 8) & 0xff;
  const blue = value & 0xff;
  const lighten = (channel: number) =>
    Math.round(channel + (255 - channel) * ratio)
      .toString(16)
      .padStart(2, "0");
  return `#${lighten(red)}${lighten(green)}${lighten(blue)}`;
};

const formatDeparture = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const DispatcherCharts = ({ data }: { data: TDispatcherOverview }) => {
  const lpnWarehouses = toWarehouseDonut(data.readyLpnsByWarehouse);
  const vehicleWarehouses = toWarehouseDonut(data.availableVehiclesByWarehouse);
  const driverWarehouses = toWarehouseDonut(data.availableDriversByWarehouse);
  const vehicleStatuses = toStatusDonut(
    data.vehicleStatusDistribution,
    VEHICLE_STATUS_LABELS
  );
  const driverStatuses = toStatusDonut(
    data.driverStatusDistribution,
    DRIVER_STATUS_LABELS
  );
  const scheduleReadiness = data.scheduleReadiness.map((item) => {
    const color = routeColor(item.routeId);
    return {
      label: item.scheduleName,
      totalOrders: item.totalOrders,
      readyOrders: item.readyOrders,
      routeName: item.routeName,
      departure: formatDeparture(item.departureAt),
      totalColor: lightenHex(color),
      readyColor: color,
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardChartCard
          title="LPN sẵn sàng theo kho"
          description="Tổng LPN có thể ghép chuyến và tỷ lệ đang nằm tại từng kho."
          isEmpty={lpnWarehouses.length === 0}
        >
          <DashboardDonutChart data={lpnWarehouses} centerLabel="LPN sẵn sàng" />
        </DashboardChartCard>
        <DashboardChartCard
          title="Xe khả dụng theo kho"
          description="Các xe có thể điều phối, phân bổ theo vị trí kho hiện tại."
          isEmpty={vehicleWarehouses.length === 0}
        >
          <DashboardDonutChart data={vehicleWarehouses} centerLabel="Xe khả dụng" />
        </DashboardChartCard>
        <DashboardChartCard
          title="Tài xế khả dụng theo kho"
          description="Tài xế đủ điều kiện nhận chuyến, phân bổ theo kho hiện tại."
          isEmpty={driverWarehouses.length === 0}
        >
          <DashboardDonutChart data={driverWarehouses} centerLabel="Tài xế" />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Trạng thái đội xe"
          description="Tình trạng vận hành hiện tại của toàn bộ xe trong phạm vi đã chọn."
          isEmpty={vehicleStatuses.length === 0}
        >
          <DashboardDonutChart data={vehicleStatuses} centerLabel="Tổng xe" />
        </DashboardChartCard>
        <DashboardChartCard
          title="Trạng thái tài xế"
          description="Khả dụng, đang chạy, nghỉ bắt buộc và tình trạng giấy phép."
          isEmpty={driverStatuses.length === 0}
        >
          <DashboardDonutChart data={driverStatuses} centerLabel="Tổng tài xế" />
        </DashboardChartCard>
      </div>

      <DashboardChartCard
        title="Mức sẵn sàng đơn hàng theo lịch đi"
        description="Mỗi lịch gồm tổng số đơn đã đặt và số đơn đã nhập kho sẵn sàng vận chuyển. Mỗi tuyến dùng một tông màu riêng."
        isEmpty={scheduleReadiness.length === 0}
      >
        <DashboardBarChart
          data={scheduleReadiness}
          tooltipDetailFormatter={(item) =>
            `${String(item.routeName)} · Khởi hành ${String(item.departure)}`
          }
          series={[
            {
              key: "totalOrders",
              label: "Tổng đơn",
              color: "#bfdbfe",
              colorKey: "totalColor",
            },
            {
              key: "readyOrders",
              label: "Đã sẵn sàng",
              color: "#2563eb",
              colorKey: "readyColor",
            },
          ]}
        />
      </DashboardChartCard>
    </div>
  );
};

export default DispatcherCharts;
