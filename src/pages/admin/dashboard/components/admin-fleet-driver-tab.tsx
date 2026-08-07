import DashboardChartCard from "@/components/dashboard/dashboard-chart-card";
import {
  DashboardDonutChart,
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
  toWarehouseDonutData,
} from "./admin-chart-utils";

type RankingLimit = 5 | 10 | 15;

const RankingLimitSelect = ({
  value,
  onChange,
}: {
  value: RankingLimit;
  onChange: (value: RankingLimit) => void;
}) => (
  <Select
    value={String(value)}
    onValueChange={(nextValue) => onChange(Number(nextValue) as RankingLimit)}
  >
    <SelectTrigger className="w-28" aria-label="Số lượng hiển thị">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="5">Top 5</SelectItem>
      <SelectItem value="10">Top 10</SelectItem>
      <SelectItem value="15">Top 15</SelectItem>
    </SelectContent>
  </Select>
);

const AdminFleetDriverTab = ({ data }: { data: TAdminOverview }) => {
  const [vehicleLimit, setVehicleLimit] = useState<RankingLimit>(10);
  const [driverLimit, setDriverLimit] = useState<RankingLimit>(10);
  const vehicles = data.fleetOverview.topUsedVehicles
    .slice(0, vehicleLimit)
    .map((item) => ({
      label: item.vehiclePlate,
      tripCount: item.tripCount,
    }));
  const drivers = data.driverOverview.topUsedDrivers
    .slice(0, driverLimit)
    .map((item) => ({
      label: item.driverName,
      tripCount: item.tripCount,
    }));

  return (
    <Tabs defaultValue="vehicles" className="space-y-4">
      <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-lg border bg-muted/30 p-1">
        <TabsTrigger value="vehicles" className="rounded-md py-2">
          Xe tải
        </TabsTrigger>
        <TabsTrigger value="drivers" className="rounded-md py-2">
          Tài xế
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vehicles" className="mt-0 space-y-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardChartCard
            title="Trạng thái đội xe"
            description={`${data.fleetOverview.totalVehicles.toLocaleString(
              "vi-VN"
            )} xe trong hệ thống ở thời điểm hiện tại.`}
            isEmpty={data.fleetOverview.statusDistribution.length === 0}
          >
            <DashboardDonutChart
              data={toStatusDonutData(data.fleetOverview.statusDistribution)}
              centerLabel="Tổng xe"
            />
          </DashboardChartCard>
          <DashboardChartCard
            title="Xe khả dụng theo kho"
            description={`${data.fleetOverview.availableVehicles.toLocaleString(
              "vi-VN"
            )} xe ACTIVE, đủ giấy tờ, có IoT và không bận chuyến.`}
            isEmpty={data.fleetOverview.availableByWarehouse.length === 0}
          >
            <DashboardDonutChart
              data={toWarehouseDonutData(
                data.fleetOverview.availableByWarehouse
              )}
              centerLabel="Xe khả dụng"
            />
          </DashboardChartCard>
        </div>
        <DashboardChartCard
          title="Xe được sử dụng nhiều nhất"
          description="Xếp hạng theo số chuyến trong khoảng thời gian đã chọn."
          action={
            <RankingLimitSelect
              value={vehicleLimit}
              onChange={setVehicleLimit}
            />
          }
          isEmpty={vehicles.length === 0}
        >
          <DashboardIntegerColumnChart
            data={vehicles}
            series={[
              { key: "tripCount", label: "Số chuyến", color: "#2563eb" },
            ]}
          />
        </DashboardChartCard>
      </TabsContent>

      <TabsContent value="drivers" className="mt-0 space-y-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardChartCard
            title="Trạng thái tài xế"
            description={`${data.driverOverview.totalDrivers.toLocaleString(
              "vi-VN"
            )} tài xế trong hệ thống ở thời điểm hiện tại.`}
            isEmpty={data.driverOverview.statusDistribution.length === 0}
          >
            <DashboardDonutChart
              data={toStatusDonutData(data.driverOverview.statusDistribution)}
              centerLabel="Tổng tài xế"
            />
          </DashboardChartCard>
          <DashboardChartCard
            title="Tài xế khả dụng theo kho"
            description={`${data.driverOverview.availableDrivers.toLocaleString(
              "vi-VN"
            )} tài xế đủ GPLX, đang rảnh và có vị trí kho.`}
            isEmpty={data.driverOverview.availableByWarehouse.length === 0}
          >
            <DashboardDonutChart
              data={toWarehouseDonutData(
                data.driverOverview.availableByWarehouse
              )}
              centerLabel="Tài xế khả dụng"
            />
          </DashboardChartCard>
        </div>
        <DashboardChartCard
          title="Tài xế thực hiện nhiều chuyến nhất"
          description="Xếp hạng theo số chuyến được phân công trong khoảng thời gian đã chọn."
          action={
            <RankingLimitSelect
              value={driverLimit}
              onChange={setDriverLimit}
            />
          }
          isEmpty={drivers.length === 0}
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
  );
};

export default AdminFleetDriverTab;
