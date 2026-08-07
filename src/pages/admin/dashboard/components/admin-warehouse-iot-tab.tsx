import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import { DashboardDonutChart } from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import {
  toStatusDonutData,
  toWarehouseDonutData,
} from "./admin-chart-utils";

const AdminWarehouseIotTab = ({ data }: { data: TAdminOverview }) => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <DashboardChartCard
      title="LPN đang lưu tại các kho"
      description="Chỉ tính LPN còn chiếm chỗ thực tế tại kho, không tính hàng đã rời kho hoặc đã giao."
      isEmpty={data.lpnsByWarehouse.length === 0}
    >
      <DashboardDonutChart
        data={toWarehouseDonutData(data.lpnsByWarehouse)}
        centerLabel="LPN trong kho"
      />
    </DashboardChartCard>
    <DashboardChartCard
      title="Tình trạng thiết bị IoT"
      description={`${data.iotOverview.totalDevices.toLocaleString(
        "vi-VN"
      )} thiết bị, mỗi thiết bị chỉ thuộc một nhóm trạng thái.`}
      isEmpty={data.iotOverview.statusDistribution.length === 0}
    >
      <DashboardDonutChart
        data={toStatusDonutData(data.iotOverview.statusDistribution)}
        centerLabel="Thiết bị"
      />
    </DashboardChartCard>
  </div>
);

export default AdminWarehouseIotTab;
