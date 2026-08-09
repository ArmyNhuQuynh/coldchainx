import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
  DashboardHorizontalBarChart,
} from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { ADMIN_CHART_COLORS } from "./admin-chart-utils";
import AdminMetricStrip from "./admin-metric-strip";

const AdminServiceRouteTab = ({
  data,
  routeId,
}: {
  data: TAdminOverview;
  routeId?: string;
}) => {
  const routeDemand = routeId
    ? data.routeDemand.filter((item) => item.routeId === routeId)
    : data.routeDemand;
  const routeOrders = routeDemand.reduce(
    (sum, item) => sum + item.orderCount,
    0
  );
  const routesWithOrders = routeDemand.filter(
    (item) => item.orderCount > 0
  ).length;
  const serviceSelections = data.serviceUsage.reduce(
    (sum, item) => sum + item.usageCount,
    0
  );
  const salesSelections = data.serviceUsage
    .filter((item) => item.isMandatory)
    .reduce((sum, item) => sum + item.usageCount, 0);
  const customerSelections = serviceSelections - salesSelections;
  const services = data.serviceUsage.map((item, index) => ({
    name: `${item.serviceName} · ${
      item.isMandatory ? "Sale chọn" : "Khách chọn"
    }`,
    value: item.usageCount,
    color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
  }));
  const routes = routeDemand.map((item, index) => ({
    label: item.routeCode,
    orderCount: item.orderCount,
    routeName: item.routeName,
    percentage: item.percentage,
    color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
  }));

  return (
    <div className="space-y-5">
      <AdminMetricStrip
        items={[
          {
            label: "Đơn có tuyến trong kỳ",
            value: routeOrders.toLocaleString("vi-VN"),
            detail: `${routesWithOrders.toLocaleString(
              "vi-VN"
            )} tuyến phát sinh nhu cầu`,
            tone: "info",
          },
          {
            label: "Lượt dùng dịch vụ",
            value: serviceSelections.toLocaleString("vi-VN"),
            detail: `${data.serviceUsage.length.toLocaleString(
              "vi-VN"
            )} loại dịch vụ được sử dụng`,
          },
          {
            label: "Dịch vụ do Sale chọn",
            value: salesSelections.toLocaleString("vi-VN"),
            detail: "Dịch vụ nghiệp vụ trong báo giá đã chấp nhận",
            tone: "warning",
          },
          {
            label: "Dịch vụ do khách chọn",
            value: customerSelections.toLocaleString("vi-VN"),
            detail: "Dịch vụ tùy chọn khách đã xác nhận",
            tone: "success",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,1fr)]">
        <DashboardChartCard
          title="Nhu cầu vận chuyển theo tuyến"
          description={
            routeId
              ? "Số đơn của tuyến đang chọn trong khoảng thời gian hiện tại."
              : "So sánh số đơn giữa toàn bộ tuyến trong khoảng thời gian hiện tại."
          }
          isEmpty={routes.length === 0}
        >
          <div className="max-h-[580px] overflow-y-auto pr-1">
            <DashboardHorizontalBarChart
              data={routes}
              series={[
                {
                  key: "orderCount",
                  label: "Số đơn",
                  color: "#0891b2",
                  colorKey: "color",
                },
              ]}
              tooltipDetailFormatter={(item) =>
                `${String(item.routeName)} · ${Number(
                  item.percentage
                ).toLocaleString("vi-VN", {
                  maximumFractionDigits: 1,
                })}% nhu cầu`
              }
            />
          </div>
        </DashboardChartCard>

        <DashboardChartCard
          title="Cơ cấu dịch vụ phát sinh"
          description="Tính từ các dịch vụ nằm trong báo giá đã được khách chấp nhận."
          isEmpty={services.length === 0}
        >
          <DashboardDonutChart
            data={services}
            centerLabel="Lượt sử dụng"
          />
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default AdminServiceRouteTab;
