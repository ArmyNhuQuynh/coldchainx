import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import { PackageCheck, Route, Truck, Warehouse } from "lucide-react";
import AdminFleetDriverTab from "./admin-fleet-driver-tab";
import AdminOrderTripTab from "./admin-order-trip-tab";
import AdminServiceRouteTab from "./admin-service-route-tab";
import AdminWarehouseIotTab from "./admin-warehouse-iot-tab";

const AdminCharts = ({
  data,
  routeId,
}: {
  data: TAdminOverview;
  routeId?: string;
}) => {
  const totalLpns = data.lpnsByWarehouse.reduce(
    (sum, warehouse) => sum + warehouse.count,
    0
  );
  const totalServiceSelections = data.serviceUsage.reduce(
    (sum, service) => sum + service.usageCount,
    0
  );

  return (
    <Tabs defaultValue="orders-trips" className="space-y-5">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-lg border bg-muted/20 p-1 sm:grid-cols-2 xl:grid-cols-4">
        <TabsTrigger
          value="orders-trips"
          className="h-auto min-w-0 justify-start gap-3 rounded-md px-3 py-3 text-left data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <PackageCheck className="h-4 w-4 shrink-0 text-sky-700" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Đơn hàng & chuyến
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {data.orderOverview.totalOrders.toLocaleString("vi-VN")} đơn ·{" "}
              {data.tripOverview.totalTrips.toLocaleString("vi-VN")} chuyến
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="fleet-drivers"
          className="h-auto min-w-0 justify-start gap-3 rounded-md px-3 py-3 text-left data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Truck className="h-4 w-4 shrink-0 text-emerald-700" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Xe & tài xế
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {data.fleetOverview.availableVehicles.toLocaleString("vi-VN")} xe ·{" "}
              {data.driverOverview.availableDrivers.toLocaleString("vi-VN")} tài xế sẵn sàng
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="warehouse-iot"
          className="h-auto min-w-0 justify-start gap-3 rounded-md px-3 py-3 text-left data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Warehouse className="h-4 w-4 shrink-0 text-amber-700" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Kho & IoT
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {totalLpns.toLocaleString("vi-VN")} LPN ·{" "}
              {data.iotOverview.totalDevices.toLocaleString("vi-VN")} thiết bị
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="services-routes"
          className="h-auto min-w-0 justify-start gap-3 rounded-md px-3 py-3 text-left data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Route className="h-4 w-4 shrink-0 text-violet-700" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Dịch vụ & tuyến
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {totalServiceSelections.toLocaleString("vi-VN")} lượt dịch vụ
            </span>
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="orders-trips"
        className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
      >
        <AdminOrderTripTab data={data} />
      </TabsContent>
      <TabsContent
        value="fleet-drivers"
        className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
      >
        <AdminFleetDriverTab data={data} />
      </TabsContent>
      <TabsContent
        value="warehouse-iot"
        className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
      >
        <AdminWarehouseIotTab data={data} />
      </TabsContent>
      <TabsContent
        value="services-routes"
        className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300"
      >
        <AdminServiceRouteTab data={data} routeId={routeId} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminCharts;
