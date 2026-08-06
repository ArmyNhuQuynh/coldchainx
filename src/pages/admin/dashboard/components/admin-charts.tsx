import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardBarChart,
  DashboardDonutChart,
  DashboardHorizontalBarChart,
} from "@/components/dashboard/dashboard-charts";
import { formatDashboardPeriod } from "@/components/dashboard/dashboard-formatters";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { getDashboardLabel } from "@/types/enums/dashboard.enum";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

const TemperatureComplianceChart = ({
  data,
}: {
  data: TAdminOverview["temperatureComplianceByRoute"];
}) => (
  <div style={{ height: Math.max(270, data.length * 48) }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 28 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
        <YAxis type="category" dataKey="routeName" width={132} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`, "Tuân thủ"]} />
        <Bar dataKey="complianceRate" radius={[0, 4, 4, 0]}>
          {data.map((item) => (
            <Cell
              key={item.routeId}
              fill={item.complianceRate >= 95 ? "#10b981" : item.complianceRate >= 80 ? "#f59e0b" : "#ef4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const AdminCharts = ({ data }: { data: TAdminOverview }) => {
  const tripPerformance = data.tripPerformanceByPeriod.map((item) => ({
    label: formatDashboardPeriod(item.period),
    completed: item.completed,
    late: item.late,
    incident: item.incident,
  }));
  const vehicles = data.vehicleStatusDistribution.map((item, index) => ({
    name: getDashboardLabel(item.status),
    value: item.count,
    color: STATUS_COLORS[index % STATUS_COLORS.length],
  }));
  const iot = data.iotStatusDistribution.map((item) => ({
    name: getDashboardLabel(item.status),
    value: item.count,
    color: item.status === "ONLINE" ? "#10b981" : "#ef4444",
  }));
  const incidents = data.incidentDistribution.map((item) => ({
    label: getDashboardLabel(item.type),
    count: item.count,
  }));
  const warehouseTrips = data.tripsByWarehouse.map((item) => ({
    label: item.warehouseName,
    trips: item.tripCount,
    orders: item.orderCount,
  }));
  const fleet = data.fleetUtilization.map((item) => ({
    label: item.vehiclePlate,
    utilization: item.utilizationRate,
    tripCount: item.tripCount,
  }));

  return (
    <div className="space-y-4">
      <DashboardChartCard
        title="Hiệu suất chuyến theo thời gian"
        description="Chuyến hoàn thành, trễ và có sự cố trong kỳ."
        isEmpty={tripPerformance.length === 0}
      >
        <DashboardBarChart
          data={tripPerformance}
          series={[
            { key: "completed", label: "Hoàn thành", color: "#10b981", stackId: "trip" },
            { key: "late", label: "Trễ", color: "#f59e0b", stackId: "trip" },
            { key: "incident", label: "Có sự cố", color: "#ef4444", stackId: "trip" },
          ]}
        />
      </DashboardChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard title="Trạng thái xe" isEmpty={vehicles.length === 0}>
          <DashboardDonutChart data={vehicles} />
        </DashboardChartCard>
        <DashboardChartCard title="Trạng thái IoT" isEmpty={iot.length === 0}>
          <DashboardDonutChart data={iot} />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Tuân thủ nhiệt độ theo tuyến"
          description="Xanh từ 95%, cam từ 80%, đỏ dưới 80%."
          isEmpty={data.temperatureComplianceByRoute.length === 0}
        >
          <TemperatureComplianceChart data={data.temperatureComplianceByRoute} />
        </DashboardChartCard>
        <DashboardChartCard title="Incident theo loại" isEmpty={incidents.length === 0}>
          <DashboardHorizontalBarChart
            data={incidents}
            series={[{ key: "count", label: "Số sự cố", color: "#ef4444" }]}
          />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Chuyến và đơn theo kho"
          isEmpty={warehouseTrips.length === 0}
        >
          <DashboardBarChart
            data={warehouseTrips}
            series={[
              { key: "trips", label: "Chuyến", color: "#3b82f6" },
              { key: "orders", label: "Đơn hàng", color: "#10b981" },
            ]}
          />
        </DashboardChartCard>
        <DashboardChartCard
          title="Hiệu suất sử dụng đội xe"
          description="Tỷ lệ sử dụng của từng xe trong khoảng thời gian đã chọn."
          isEmpty={fleet.length === 0}
        >
          <DashboardHorizontalBarChart
            data={fleet}
            valueFormatter={(value) => `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`}
            series={[{ key: "utilization", label: "Tỷ lệ sử dụng", color: "#0f766e" }]}
            tooltipDetailFormatter={(item) =>
              `${Number(item.tripCount).toLocaleString("vi-VN")} chuyến`
            }
          />
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default AdminCharts;
