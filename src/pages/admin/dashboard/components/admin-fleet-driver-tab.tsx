import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
  DashboardHorizontalBarChart,
  DashboardIntegerColumnChart,
} from "@/components/dashboard/dashboard-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { useState } from "react";
import {
  toStatusDonutData,
  toWarehouseBarData,
} from "./admin-chart-utils";
import AdminMetricStrip from "./admin-metric-strip";

type RankingLimit = 5 | 10 | 15;

const RankingLimitSelect = ({
  value,
  onChange,
  itemLabel,
}: {
  value: RankingLimit;
  onChange: (value: RankingLimit) => void;
  itemLabel: "xe" | "tài xế";
}) => (
  <Select
    value={String(value)}
    onValueChange={(nextValue) => onChange(Number(nextValue) as RankingLimit)}
  >
    <SelectTrigger
      className="w-32"
      aria-label={`Số lượng ${itemLabel} hiển thị`}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="5">5 {itemLabel}</SelectItem>
      <SelectItem value="10">10 {itemLabel}</SelectItem>
      <SelectItem value="15">15 {itemLabel}</SelectItem>
    </SelectContent>
  </Select>
);

const availabilityRate = (available: number, total: number) =>
  total > 0 ? (available / total) * 100 : 0;

const AdminFleetDriverTab = ({ data }: { data: TAdminOverview }) => {
  const [vehicleLimit, setVehicleLimit] = useState<RankingLimit>(15);
  const [driverLimit, setDriverLimit] = useState<RankingLimit>(15);
  const vehicles = data.fleetOverview.topUsedVehicles
    .slice(0, vehicleLimit)
    .map((item) => ({
      label: item.vehiclePlate,
      tripCount: item.tripCount,
      utilizationRate: item.utilizationRate,
    }));
  const drivers = data.driverOverview.topUsedDrivers
    .slice(0, driverLimit)
    .map((item) => ({
      label: item.driverName,
      tripCount: item.tripCount,
    }));
  const vehiclesByWarehouse = toWarehouseBarData(
    data.fleetOverview.availableByWarehouse
  );
  const driversByWarehouse = toWarehouseBarData(
    data.driverOverview.availableByWarehouse
  );

  return (
    <div className="space-y-5">
      <AdminMetricStrip
        items={[
          {
            label: "Tổng xe trong phạm vi",
            value: data.fleetOverview.totalVehicles.toLocaleString("vi-VN"),
            detail: "Bao gồm mọi trạng thái vận hành",
            tone: "info",
          },
          {
            label: "Xe sẵn sàng điều phối",
            value: data.fleetOverview.availableVehicles.toLocaleString("vi-VN"),
            detail: `${availabilityRate(
              data.fleetOverview.availableVehicles,
              data.fleetOverview.totalVehicles
            ).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}% đội xe`,
            tone: "success",
          },
          {
            label: "Tổng tài xế trong phạm vi",
            value: data.driverOverview.totalDrivers.toLocaleString("vi-VN"),
            detail: "Bao gồm mọi trạng thái làm việc",
            tone: "info",
          },
          {
            label: "Tài xế sẵn sàng điều phối",
            value: data.driverOverview.availableDrivers.toLocaleString("vi-VN"),
            detail: `${availabilityRate(
              data.driverOverview.availableDrivers,
              data.driverOverview.totalDrivers
            ).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}% tài xế`,
            tone: "success",
          },
        ]}
      />

      <Tabs defaultValue="vehicles" className="space-y-5">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-lg border bg-muted/25 p-1">
          <TabsTrigger value="vehicles" className="rounded-md py-2.5">
            Nguồn lực xe
          </TabsTrigger>
          <TabsTrigger value="drivers" className="rounded-md py-2.5">
            Nguồn lực tài xế
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="vehicles"
          className="mt-0 space-y-5 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
        >
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(320px,1fr)_minmax(0,1.45fr)]">
            <DashboardChartCard
              title="Trạng thái đội xe"
              description="Tình trạng vận hành hiện tại của toàn bộ xe trong phạm vi lọc."
              isEmpty={data.fleetOverview.statusDistribution.length === 0}
            >
              <DashboardDonutChart
                data={toStatusDonutData(data.fleetOverview.statusDistribution)}
                centerLabel="Tổng xe"
              />
            </DashboardChartCard>
            <DashboardChartCard
              title="Năng lực xe sẵn sàng theo kho"
              description="Chỉ tính xe ACTIVE, đủ giấy tờ, có IoT và không bận chuyến."
              isEmpty={vehiclesByWarehouse.length === 0}
            >
              <DashboardHorizontalBarChart
                data={vehiclesByWarehouse}
                series={[
                  {
                    key: "count",
                    label: "Xe khả dụng",
                    color: "#2563eb",
                    colorKey: "color",
                  },
                ]}
                tooltipDetailFormatter={(item) =>
                  `${Number(item.percentage).toLocaleString("vi-VN", {
                    maximumFractionDigits: 1,
                  })}% nguồn lực khả dụng`
                }
              />
            </DashboardChartCard>
          </div>

          <DashboardChartCard
            title="Mức độ sử dụng xe"
            description="Số chuyến được gán cho từng xe trong khoảng thời gian đã chọn."
            action={
              <RankingLimitSelect
                value={vehicleLimit}
                onChange={setVehicleLimit}
                itemLabel="xe"
              />
            }
            isEmpty={
              vehicles.length === 0 ||
              vehicles.every((vehicle) => vehicle.tripCount === 0)
            }
            emptyText="Chưa có xe nào được gán chuyến trong khoảng thời gian này."
          >
            <DashboardIntegerColumnChart
              data={vehicles}
              series={[
                { key: "tripCount", label: "Số chuyến", color: "#2563eb" },
              ]}
              tooltipDetailFormatter={(item) =>
                `Tỷ lệ thời gian sử dụng ${Number(
                  item.utilizationRate
                ).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`
              }
            />
          </DashboardChartCard>
        </TabsContent>

        <TabsContent
          value="drivers"
          className="mt-0 space-y-5 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
        >
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(320px,1fr)_minmax(0,1.45fr)]">
            <DashboardChartCard
              title="Trạng thái tài xế"
              description="Tình trạng làm việc hiện tại của tài xế trong phạm vi lọc."
              isEmpty={data.driverOverview.statusDistribution.length === 0}
            >
              <DashboardDonutChart
                data={toStatusDonutData(data.driverOverview.statusDistribution)}
                centerLabel="Tổng tài xế"
              />
            </DashboardChartCard>
            <DashboardChartCard
              title="Tài xế sẵn sàng theo kho"
              description="Chỉ tính tài xế đủ GPLX, không bận chuyến và có vị trí kho."
              isEmpty={driversByWarehouse.length === 0}
            >
              <DashboardHorizontalBarChart
                data={driversByWarehouse}
                series={[
                  {
                    key: "count",
                    label: "Tài xế khả dụng",
                    color: "#059669",
                    colorKey: "color",
                  },
                ]}
                tooltipDetailFormatter={(item) =>
                  `${Number(item.percentage).toLocaleString("vi-VN", {
                    maximumFractionDigits: 1,
                  })}% nguồn lực khả dụng`
                }
              />
            </DashboardChartCard>
          </div>

          <DashboardChartCard
            title="Khối lượng chuyến theo tài xế"
            description="Số chuyến mỗi tài xế được phân công trong khoảng thời gian đã chọn."
            action={
              <RankingLimitSelect
                value={driverLimit}
                onChange={setDriverLimit}
                itemLabel="tài xế"
              />
            }
            isEmpty={
              drivers.length === 0 ||
              drivers.every((driver) => driver.tripCount === 0)
            }
            emptyText="Chưa có tài xế nào được phân công chuyến trong khoảng thời gian này."
          >
            <DashboardIntegerColumnChart
              data={drivers}
              series={[
                { key: "tripCount", label: "Số chuyến", color: "#059669" },
              ]}
            />
          </DashboardChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFleetDriverTab;
