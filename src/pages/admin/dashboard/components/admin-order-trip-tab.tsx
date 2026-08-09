import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
} from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatAdminPeriod,
  toStatusDonutData,
} from "./admin-chart-utils";
import AdminMetricStrip from "./admin-metric-strip";
import AdminOrderStageHeatmap from "./admin-order-stage-heatmap";

const AdminOrderTripTab = ({ data }: { data: TAdminOverview }) => {
  const tripPeriods = data.tripOverview.byPeriod.map((item) => ({
    label: formatAdminPeriod(item.period, data.groupBy),
    completedTrips: item.completedTrips,
    remainingTrips: Math.max(0, item.totalTrips - item.completedTrips),
    incidentRate: item.incidentRate,
    deliverySuccessRate: item.deliverySuccessRate,
  }));

  return (
    <div className="space-y-5">
      <AdminMetricStrip
        items={[
          {
            label: "Đơn tạo mới trong kỳ",
            value: data.orderOverview.totalOrders.toLocaleString("vi-VN"),
            detail: "Tính theo ngày tạo đơn trong phạm vi đã chọn",
            tone: "info",
          },
          {
            label: "Chuyến khởi hành trong kỳ",
            value: data.tripOverview.totalTrips.toLocaleString("vi-VN"),
            detail: `${data.tripOverview.completedTrips.toLocaleString(
              "vi-VN"
            )} chuyến đã hoàn tất`,
          },
          {
            label: "Tỷ lệ giao thành công",
            value: `${data.tripOverview.deliverySuccessRate.toLocaleString(
              "vi-VN",
              { maximumFractionDigits: 1 }
            )}%`,
            detail: "Tính trên các chuyến đã hoàn tất",
            tone: "success",
          },
          {
            label: "Chuyến phát sinh sự cố",
            value: data.tripOverview.tripsWithIncidents.toLocaleString("vi-VN"),
            detail: `${data.tripOverview.incidentRate.toLocaleString("vi-VN", {
              maximumFractionDigits: 1,
            })}% tổng chuyến trong kỳ`,
            tone:
              data.tripOverview.tripsWithIncidents > 0 ? "danger" : "success",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardChartCard
          title="Phân bố đơn theo giai đoạn và thời gian"
          description="Mỗi ô là số đơn được tạo trong kỳ và hiện đang ở giai đoạn tương ứng."
          isEmpty={data.orderOverview.byPeriod.length === 0}
        >
          <AdminOrderStageHeatmap
            items={data.orderOverview.byPeriod}
            groupBy={data.groupBy}
          />
        </DashboardChartCard>
        <DashboardChartCard
          title="Trạng thái đơn hiện tại"
          description="Chi tiết theo đúng trạng thái đơn BE ghi nhận trong kỳ."
          isEmpty={data.orderOverview.statusDistribution.length === 0}
        >
          <DashboardDonutChart
            data={toStatusDonutData(data.orderOverview.statusDistribution)}
            centerLabel="Đơn hàng"
          />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardChartCard
          title="Tiến độ và chất lượng chuyến"
          description="Cột thể hiện tiến độ hoàn tất; đường thể hiện tỷ lệ sự cố và giao thành công."
          isEmpty={tripPeriods.length === 0}
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={tripPeriods}
                margin={{ top: 10, right: 8, bottom: 4, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="count"
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "completedTrips" || name === "remainingTrips"
                      ? Number(value).toLocaleString("vi-VN")
                      : `${Number(value).toLocaleString("vi-VN", {
                          maximumFractionDigits: 1,
                        })}%`,
                    name === "completedTrips"
                      ? "Đã hoàn tất"
                      : name === "remainingTrips"
                        ? "Chưa hoàn tất"
                        : name === "incidentRate"
                          ? "Tỷ lệ sự cố"
                          : "Tỷ lệ giao thành công",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "completedTrips"
                      ? "Đã hoàn tất"
                      : value === "remainingTrips"
                        ? "Chưa hoàn tất"
                        : value === "incidentRate"
                          ? "Tỷ lệ sự cố"
                          : "Tỷ lệ giao thành công"
                  }
                />
                <Bar
                  yAxisId="count"
                  dataKey="completedTrips"
                  stackId="trip-progress"
                  fill="#16a34a"
                  maxBarSize={52}
                  animationDuration={650}
                />
                <Bar
                  yAxisId="count"
                  dataKey="remainingTrips"
                  stackId="trip-progress"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={52}
                  animationDuration={650}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="incidentRate"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={650}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="deliverySuccessRate"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={650}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>
        <DashboardChartCard
          title="Trạng thái chuyến hiện tại"
          description="Cơ cấu trạng thái của các chuyến có giờ khởi hành trong kỳ."
          isEmpty={data.tripOverview.statusDistribution.length === 0}
        >
          <DashboardDonutChart
            data={toStatusDonutData(data.tripOverview.statusDistribution)}
            centerLabel="Chuyến"
          />
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default AdminOrderTripTab;
