import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TOrderScheduleSummary } from "@/schemas/order.schema";
import { ArrowLeft } from "lucide-react";
import ShipmentTable from "./components/shipment-table";
import ShipmentScheduleTable from "./components/shipment-schedule-table";

type Props = {};

const ShipmentPage = (_: Props) => {
  const [selectedSchedule, setSelectedSchedule] = useState<TOrderScheduleSummary | null>(null);

  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Quản lý lô hàng
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Duyệt, báo giá và theo dõi toàn bộ lô hàng
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-lg border bg-muted/20 p-1">
          <TabsTrigger value="all" onClick={() => setSelectedSchedule(null)}>
            Tất cả đơn
          </TabsTrigger>
          <TabsTrigger value="schedule">
            Theo lịch đi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0 min-w-0">
          <ShipmentTable />
        </TabsContent>

        <TabsContent value="schedule" className="mt-0 min-w-0">
          {selectedSchedule ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{selectedSchedule.scheduleName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSchedule.routeCode} · {selectedSchedule.originCity} → {selectedSchedule.destCity}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedSchedule(null)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Danh sách lịch
                </Button>
              </div>
              <ShipmentTable scheduleId={selectedSchedule.scheduleId} />
            </div>
          ) : (
            <ShipmentScheduleTable onSelectSchedule={setSelectedSchedule} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipmentPage;
