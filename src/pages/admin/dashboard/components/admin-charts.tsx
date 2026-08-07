import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TAdminOverview } from "@/schemas/dashboard.schema";
import AdminFleetDriverTab from "./admin-fleet-driver-tab";
import AdminOrderTripTab from "./admin-order-trip-tab";
import AdminServiceRouteTab from "./admin-service-route-tab";
import AdminWarehouseIotTab from "./admin-warehouse-iot-tab";

const AdminCharts = ({ data }: { data: TAdminOverview }) => (
  <Tabs defaultValue="orders-trips" className="space-y-5">
    <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-muted/30 p-1">
      <TabsTrigger
        value="orders-trips"
        className="h-10 shrink-0 rounded-md px-4"
      >
        Đơn hàng & chuyến
      </TabsTrigger>
      <TabsTrigger
        value="fleet-drivers"
        className="h-10 shrink-0 rounded-md px-4"
      >
        Xe & tài xế
      </TabsTrigger>
      <TabsTrigger
        value="warehouse-iot"
        className="h-10 shrink-0 rounded-md px-4"
      >
        Kho & IoT
      </TabsTrigger>
      <TabsTrigger
        value="services-routes"
        className="h-10 shrink-0 rounded-md px-4"
      >
        Dịch vụ & tuyến
      </TabsTrigger>
    </TabsList>

    <TabsContent value="orders-trips" className="mt-0">
      <AdminOrderTripTab data={data} />
    </TabsContent>
    <TabsContent value="fleet-drivers" className="mt-0">
      <AdminFleetDriverTab data={data} />
    </TabsContent>
    <TabsContent value="warehouse-iot" className="mt-0">
      <AdminWarehouseIotTab data={data} />
    </TabsContent>
    <TabsContent value="services-routes" className="mt-0">
      <AdminServiceRouteTab data={data} />
    </TabsContent>
  </Tabs>
);

export default AdminCharts;
