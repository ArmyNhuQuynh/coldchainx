import { Badge } from "@/components/ui/badge";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { UserRound } from "lucide-react";

const TripDriverList = ({ trip }: { trip?: TTrackingTrip | null }) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-semibold">Tài xế của chuyến</h3>
      <Badge variant="outline" className="rounded-md bg-transparent">
        {trip?.drivers.length ?? 0} người
      </Badge>
    </div>
    <div className="h-[340px] space-y-2 overflow-y-auto rounded-lg border p-3">
      {(trip?.drivers.length ?? 0) === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Chưa có thông tin tài xế của chuyến.
        </p>
      )}
      {trip?.drivers.map((driver) => (
        <div key={driver.driverId || driver.fullName} className="rounded-lg border p-3">
          <p className="flex items-center gap-2 font-semibold">
            <UserRound className="h-4 w-4 text-emerald-700" />
            {driver.fullName || "Chưa có tên"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Vai trò: {driver.driverRole || "DRIVER"}
          </p>
        </div>
      ))}
      <div className="rounded-lg border border-dashed p-3 text-xs leading-5 text-muted-foreground">
        Luồng cứu hộ hiện giữ nguyên tài xế của chuyến; API chưa nhận tài xế thay thế.
      </div>
    </div>
  </section>
);

export default TripDriverList;
