import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
  DashboardHorizontalBarChart,
} from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { ADMIN_CHART_COLORS } from "./admin-chart-utils";

const AdminServiceRouteTab = ({ data }: { data: TAdminOverview }) => {
  const services = data.serviceUsage.map((item, index) => ({
    name: `${item.serviceName} · ${
      item.isMandatory ? "Sale chọn" : "Khách chọn"
    }`,
    value: item.usageCount,
    color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
  }));
  const routes = data.routeDemand.map((item) => ({
    label: item.routeCode,
    orderCount: item.orderCount,
    routeName: item.routeName,
    percentage: item.percentage,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">
      <DashboardChartCard
        title="Dịch vụ được sử dụng"
        description="Tính theo các dịch vụ đã nằm trong báo giá được khách chấp nhận trong kỳ."
        isEmpty={services.length === 0}
      >
        <DashboardDonutChart
          data={services}
          centerLabel="Lượt sử dụng"
        />
      </DashboardChartCard>
      <DashboardChartCard
        title="Nhu cầu theo tuyến"
        description="Hiển thị toàn bộ tuyến, kể cả tuyến chưa phát sinh đơn trong khoảng đã chọn."
        isEmpty={routes.length === 0}
      >
        <DashboardHorizontalBarChart
          data={routes}
          series={[
            { key: "orderCount", label: "Số đơn", color: "#0891b2" },
          ]}
          tooltipDetailFormatter={(item) =>
            `${String(item.routeName)} · ${Number(item.percentage).toLocaleString(
              "vi-VN",
              { maximumFractionDigits: 1 }
            )}%`
          }
        />
      </DashboardChartCard>
    </div>
  );
};

export default AdminServiceRouteTab;
