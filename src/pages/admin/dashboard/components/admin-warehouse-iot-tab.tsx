import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
  DashboardHorizontalBarChart,
} from "@/components/dashboard/dashboard-charts";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import {
  getStatusCount,
  toStatusDonutData,
  toWarehouseBarData,
} from "./admin-chart-utils";
import AdminMetricStrip from "./admin-metric-strip";

const AdminWarehouseIotTab = ({ data }: { data: TAdminOverview }) => {
  const warehouseLpns = toWarehouseBarData(data.lpnsByWarehouse);
  const totalLpns = data.lpnsByWarehouse.reduce(
    (sum, warehouse) => sum + warehouse.count,
    0
  );
  const onlineDevices = getStatusCount(
    data.iotOverview.statusDistribution,
    "ONLINE"
  );
  const offlineDevices = getStatusCount(
    data.iotOverview.statusDistribution,
    "OFFLINE"
  );
  const unassignedDevices = getStatusCount(
    data.iotOverview.statusDistribution,
    "UNASSIGNED"
  );

  return (
    <div className="space-y-5">
      <AdminMetricStrip
        items={[
          {
            label: "LPN đang chiếm chỗ",
            value: totalLpns.toLocaleString("vi-VN"),
            detail: `${data.lpnsByWarehouse.length.toLocaleString(
              "vi-VN"
            )} kho đang lưu hàng`,
            tone: "info",
          },
          {
            label: "Thiết bị đang online",
            value: onlineDevices.toLocaleString("vi-VN"),
            detail: `${data.iotOverview.totalDevices.toLocaleString(
              "vi-VN"
            )} thiết bị trong phạm vi`,
            tone: "success",
          },
          {
            label: "Thiết bị mất kết nối",
            value: offlineDevices.toLocaleString("vi-VN"),
            detail: "Đã gán xe nhưng hiện không gửi dữ liệu",
            tone: offlineDevices > 0 ? "danger" : "success",
          },
          {
            label: "Thiết bị chưa gán xe",
            value: unassignedDevices.toLocaleString("vi-VN"),
            detail: "Thiết bị sẵn trong kho thiết bị",
            tone: unassignedDevices > 0 ? "warning" : "success",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">
        <DashboardChartCard
          title="Phân bố LPN đang lưu kho"
          description="Chỉ tính LPN còn chiếm chỗ thực tế; hàng đã rời kho hoặc đã giao không được tính."
          isEmpty={warehouseLpns.length === 0}
        >
          <DashboardHorizontalBarChart
            data={warehouseLpns}
            series={[
              {
                key: "count",
                label: "Số LPN",
                color: "#0891b2",
                colorKey: "color",
              },
            ]}
            tooltipDetailFormatter={(item) =>
              `${Number(item.percentage).toLocaleString("vi-VN", {
                maximumFractionDigits: 1,
              })}% lượng LPN đang lưu`
            }
          />
        </DashboardChartCard>

        <DashboardChartCard
          title="Sức khỏe hệ thống IoT"
          description="Mỗi thiết bị chỉ thuộc một nhóm: online, offline hoặc chưa gán xe."
          isEmpty={data.iotOverview.statusDistribution.length === 0}
        >
          <DashboardDonutChart
            data={toStatusDonutData(data.iotOverview.statusDistribution)}
            centerLabel="Thiết bị"
          />
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default AdminWarehouseIotTab;
