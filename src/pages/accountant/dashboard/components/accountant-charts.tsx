import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
  DashboardHorizontalBarChart,
  DashboardLineChart,
} from "@/components/dashboard/dashboard-charts";
import {
  formatCompactCurrency,
  formatDashboardCurrency,
  formatDashboardPeriod,
} from "@/components/dashboard/dashboard-formatters";
import type { TAccountantOverview } from "@/schemas/dashboard.schema";
import { getDashboardLabel } from "@/types/enums/dashboard.enum";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

const AccountantCharts = ({ data }: { data: TAccountantOverview }) => {
  const cashFlow = data.cashFlowSeries.map((item) => ({
    label: formatDashboardPeriod(item.period),
    cashIn: item.cashIn,
    cashOut: item.cashOut,
  }));
  const invoices = data.invoiceStatusDistribution.map((item, index) => ({
    name: getDashboardLabel(item.status),
    value: item.count,
    amount: item.amount,
    color: COLORS[index % COLORS.length],
  }));
  const aging = data.receivablesAging.map((item) => ({
    label: item.label || getDashboardLabel(item.bucket),
    amount: item.amount,
    invoiceCount: item.invoiceCount,
  }));
  const cod = data.codByPaymentMethod.map((item, index) => ({
    name: getDashboardLabel(item.paymentMethod),
    value: item.count,
    amount: item.amount,
    color: COLORS[index % COLORS.length],
  }));
  const claims = data.claimPayoutByType.map((item) => ({
    label: getDashboardLabel(item.claimType),
    amount: item.amount,
    count: item.count,
  }));
  const customers = data.topCustomersByRevenue.map((item) => ({
    label: item.customerName,
    amount: item.amount,
  }));
  const routes = data.topRoutesByRevenue.map((item) => ({
    label: item.routeName,
    amount: item.amount,
  }));

  return (
    <div className="space-y-4">
      <DashboardChartCard
        title="Dòng tiền theo thời gian"
        description="So sánh tiền vào và tiền ra theo kỳ đã chọn."
        isEmpty={cashFlow.length === 0}
      >
        <DashboardLineChart
          data={cashFlow}
          valueFormatter={formatCompactCurrency}
          series={[
            { key: "cashIn", label: "Tiền vào", color: "#10b981" },
            { key: "cashOut", label: "Tiền ra", color: "#ef4444" },
          ]}
        />
      </DashboardChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard title="Trạng thái hóa đơn" isEmpty={invoices.length === 0}>
          <DashboardDonutChart data={invoices} amountFormatter={formatDashboardCurrency} />
        </DashboardChartCard>
        <DashboardChartCard
          title="Tuổi công nợ"
          description={`Số liệu tại ngày ${data.receivablesAsOfDate || "-"}.`}
          isEmpty={aging.length === 0}
        >
          <DashboardHorizontalBarChart
            data={aging}
            valueFormatter={formatCompactCurrency}
            series={[{ key: "amount", label: "Giá trị công nợ", color: "#f59e0b" }]}
          />
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.receivablesAging.map((item) => (
              <span key={item.bucket} className="rounded border px-2 py-1">
                {item.label}: {item.invoiceCount} hóa đơn
              </span>
            ))}
          </div>
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard title="COD theo phương thức thanh toán" isEmpty={cod.length === 0}>
          <DashboardDonutChart data={cod} amountFormatter={formatDashboardCurrency} />
        </DashboardChartCard>
        <DashboardChartCard title="Bồi thường theo loại claim" isEmpty={claims.length === 0}>
          <DashboardHorizontalBarChart
            data={claims}
            valueFormatter={formatCompactCurrency}
            series={[{ key: "amount", label: "Đã chi", color: "#ef4444" }]}
            tooltipDetailFormatter={(item) =>
              `${Number(item.count).toLocaleString("vi-VN")} hồ sơ`
            }
          />
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardChartCard title="Top khách hàng theo doanh thu" isEmpty={customers.length === 0}>
          <DashboardHorizontalBarChart
            data={customers}
            valueFormatter={formatCompactCurrency}
            series={[{ key: "amount", label: "Doanh thu", color: "#0f766e" }]}
          />
        </DashboardChartCard>
        <DashboardChartCard title="Top tuyến theo doanh thu" isEmpty={routes.length === 0}>
          <DashboardHorizontalBarChart
            data={routes}
            valueFormatter={formatCompactCurrency}
            series={[{ key: "amount", label: "Doanh thu", color: "#3b82f6" }]}
          />
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default AccountantCharts;
