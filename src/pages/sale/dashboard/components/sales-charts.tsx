import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardBarChart,
  DashboardDonutChart,
  DashboardHorizontalBarChart,
  DashboardLineChart,
} from "@/components/dashboard/dashboard-charts";
import {
  formatCompactCurrency,
  formatDashboardNumber,
  formatDashboardPeriod,
} from "@/components/dashboard/dashboard-formatters";
import type { TSalesOverview } from "@/schemas/dashboard.schema";

const formatDayLabel = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T00:00:00`)
  );

const SalesCharts = ({ data }: { data: TSalesOverview }) => {
  const orderVolume = data.orderVolumeSeries.map((item) => ({
    label: formatDayLabel(item.period),
    orders: item.totalOrders,
  }));
  const discrepancyStatus = data.discrepancySeries.map((item) => ({
    label: formatDayLabel(item.period),
    pending: item.pending,
    appendixSent: item.appendixSent,
    resolved: item.resolved,
  }));
  const discrepancyRatio = [
    {
      name: "Có sai lệch",
      value: data.discrepancySummary.discrepancyOrders,
      color: "#dc2626",
    },
    {
      name: "Không sai lệch",
      value: Math.max(
        0,
        data.discrepancySummary.totalOrders -
          data.discrepancySummary.discrepancyOrders
      ),
      color: "#0f766e",
    },
  ];
  const funnel = data.funnel.map((item) => ({
    label: item.label,
    count: item.count,
    conversionRate: item.conversionRate,
  }));
  const quotationValues = data.quotationValuesByMonth.map((item) => ({
    label: formatDashboardPeriod(item.month),
    sentValue: item.sentValue,
    acceptedValue: item.acceptedValue,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Số lượng đơn theo thời gian"
          description="Số đơn mới phát sinh trong khoảng thời gian đang chọn."
          isEmpty={orderVolume.every((item) => item.orders === 0)}
        >
          <DashboardLineChart
            data={orderVolume}
            valueFormatter={formatDashboardNumber}
            series={[{ key: "orders", label: "Số đơn", color: "#2563eb" }]}
          />
        </DashboardChartCard>

        <DashboardChartCard
          title="Tỷ lệ đơn có sai lệch"
          description={`${formatDashboardNumber(
            data.discrepancySummary.discrepancyOrders
          )}/${formatDashboardNumber(
            data.discrepancySummary.totalOrders
          )} đơn có phát sinh sai lệch (${data.discrepancySummary.discrepancyRate.toLocaleString(
            "vi-VN",
            { maximumFractionDigits: 2 }
          )}%).`}
          isEmpty={data.discrepancySummary.totalOrders === 0}
        >
          <DashboardDonutChart data={discrepancyRatio} centerLabel="Đơn hàng" />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Tiến độ xử lý sai lệch"
          description="Sai lệch phát sinh theo kỳ và trạng thái xử lý hiện tại."
          isEmpty={discrepancyStatus.every(
            (item) => item.pending + item.appendixSent + item.resolved === 0
          )}
        >
          <DashboardBarChart
            data={discrepancyStatus}
            series={[
              {
                key: "pending",
                label: "Chưa xử lý",
                color: "#dc2626",
                stackId: "discrepancy",
              },
              {
                key: "appendixSent",
                label: "Đã gửi phụ lục",
                color: "#f59e0b",
                stackId: "discrepancy",
              },
              {
                key: "resolved",
                label: "Đã xử lý",
                color: "#0f766e",
                stackId: "discrepancy",
              },
            ]}
          />
        </DashboardChartCard>

        <DashboardChartCard
          title="Giá trị báo giá theo tháng"
          description="So sánh giá trị đã gửi và đã được khách chấp nhận."
          isEmpty={quotationValues.length === 0}
        >
          <DashboardBarChart
            data={quotationValues}
            valueFormatter={formatCompactCurrency}
            series={[
              { key: "sentValue", label: "Đã gửi", color: "#3b82f6" },
              { key: "acceptedValue", label: "Đã chấp nhận", color: "#10b981" },
            ]}
          />
        </DashboardChartCard>
      </div>

      <DashboardChartCard
        title="Funnel chuyển đổi"
        description="Số hồ sơ còn lại qua từng bước của quy trình Sale."
        isEmpty={funnel.length === 0}
      >
        <DashboardHorizontalBarChart
          data={funnel}
          series={[{ key: "count", label: "Số hồ sơ", color: "#0f766e" }]}
          tooltipDetailFormatter={(item) =>
            `Chuyển đổi ${Number(item.conversionRate).toLocaleString("vi-VN", {
              maximumFractionDigits: 2,
            })}%`
          }
        />
      </DashboardChartCard>
    </div>
  );
};

export default SalesCharts;
