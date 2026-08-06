import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import { DashboardDonutChart } from "@/components/dashboard/dashboard-charts";
import { Card } from "@/components/ui/card";
import type { TSalesOverview } from "@/schemas/dashboard.schema";
import { MessageSquareText } from "lucide-react";

type Props = {
  distribution: TSalesOverview["workDistribution"];
  unreadMessages: number;
  onOpenMessages: () => void;
};

const WORK_COLORS = [
  "#0f766e",
  "#f59e0b",
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#dc2626",
];

const SalesKpis = ({ distribution, unreadMessages, onOpenMessages }: Props) => {
  const workItems = distribution
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      name: item.label,
      value: item.count,
      color: WORK_COLORS[index % WORK_COLORS.length],
    }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <DashboardChartCard
        title="Công việc đang chờ"
        description="Phân bổ hồ sơ Sale cần tiếp tục xử lý ở từng bước."
        isEmpty={workItems.length === 0}
      >
        <DashboardDonutChart data={workItems} centerLabel="Công việc" />
      </DashboardChartCard>

      <Card className="h-full rounded-lg shadow-sm">
        <button
          type="button"
          className="flex h-full min-h-[372px] w-full flex-col items-center justify-center px-6 text-center transition-colors hover:bg-muted/35"
          onClick={onOpenMessages}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700">
            <MessageSquareText className="h-6 w-6" />
          </span>
          <span className="mt-5 text-sm font-medium text-muted-foreground">
            Tin nhắn chưa đọc
          </span>
          <span className="mt-2 text-4xl font-semibold tabular-nums">
            {unreadMessages.toLocaleString("vi-VN")}
          </span>
          <span className="mt-3 text-sm text-muted-foreground">
            Bấm để mở chăm sóc khách hàng
          </span>
        </button>
      </Card>
    </div>
  );
};

export default SalesKpis;
