import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardBarChart,
  DashboardDonutChart,
  type DashboardChartDatum,
  type DashboardChartSeries,
} from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { getDashboardLabel } from "@/types/enums/dashboard.enum";
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
  getAdminChartColor,
  toStatusDonutData,
} from "./admin-chart-utils";

const AdminOrderTripTab = ({ data }: { data: TAdminOverview }) => {
  const orderSeries: DashboardChartSeries[] =
    data.orderOverview.statusDistribution.map((item, index) => ({
      key: item.status,
      label: getDashboardLabel(item.status),
      color: getAdminChartColor(item.status, index),
      stackId: "orders",
    }));
  const orderPeriods: DashboardChartDatum[] = data.orderOverview.byPeriod.map(
    (item) => ({
      label: formatAdminPeriod(item.period, data.groupBy),
      total: item.total,
      ...Object.fromEntries(
        item.statusDistribution.map((status) => [status.status, status.count])
      ),
    })
  );
  const tripPeriods = data.tripOverview.byPeriod.map((item) => ({
    label: formatAdminPeriod(item.period, data.groupBy),
    totalTrips: item.totalTrips,
    incidentRate: item.incidentRate,
    deliverySuccessRate: item.deliverySuccessRate,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardChartCard
          title="Số lượng đơn theo thời gian"
          description={`Tổng ${data.orderOverview.totalOrders.toLocaleString(
            "vi-VN"
          )} đơn trong khoảng đã chọn, phân tách theo trạng thái.`}
          isEmpty={orderPeriods.length === 0}
        >
          <DashboardBarChart data={orderPeriods} series={orderSeries} />
        </DashboardChartCard>
        <DashboardChartCard
          title="Cơ cấu trạng thái đơn"
          description="Tỷ trọng trạng thái của toàn bộ đơn trong kỳ."
          isEmpty={data.orderOverview.statusDistribution.length === 0}
        >
          <DashboardDonutChart
            data={toStatusDonutData(data.orderOverview.statusDistribution)}
            centerLabel="Đơn hàng"
          />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardChartCard
          title="Vận hành chuyến theo thời gian"
          description={`${data.tripOverview.totalTrips.toLocaleString(
            "vi-VN"
          )} chuyến · ${data.tripOverview.incidentRate.toLocaleString("vi-VN", {
            maximumFractionDigits: 1,
          })}% có sự cố · ${data.tripOverview.deliverySuccessRate.toLocaleString(
            "vi-VN",
            { maximumFractionDigits: 1 }
          )}% giao thành công.`}
          isEmpty={tripPeriods.length === 0}
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={tripPeriods} margin={{ top: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="count" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "totalTrips"
                      ? Number(value).toLocaleString("vi-VN")
                      : `${Number(value).toLocaleString("vi-VN", {
                          maximumFractionDigits: 1,
                        })}%`,
                    name === "totalTrips"
                      ? "Tổng chuyến"
                      : name === "incidentRate"
                        ? "Tỷ lệ sự cố"
                        : "Tỷ lệ giao thành công",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "totalTrips"
                      ? "Tổng chuyến"
                      : value === "incidentRate"
                        ? "Tỷ lệ sự cố"
                        : "Tỷ lệ giao thành công"
                  }
                />
                <Bar
                  yAxisId="count"
                  dataKey="totalTrips"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={54}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="incidentRate"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="deliverySuccessRate"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>
        <DashboardChartCard
          title="Cơ cấu trạng thái chuyến"
          description="Trạng thái của các chuyến khởi hành trong kỳ."
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
