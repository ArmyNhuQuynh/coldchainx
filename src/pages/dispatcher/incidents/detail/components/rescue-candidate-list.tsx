import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TRescueCandidate } from "@/schemas/incident.schema";
import { Snowflake, Truck } from "lucide-react";
import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";

type Props = {
  candidates: TRescueCandidate[];
  selectedVehicleId: string;
  isLoading?: boolean;
  error?: unknown;
  onSelect: (vehicleId: string) => void;
};

const NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const RescueCandidateList = ({
  candidates,
  selectedVehicleId,
  isLoading,
  error,
  onSelect,
}: Props) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-semibold">Xe đủ điều kiện</h3>
      <Badge variant="outline" className="rounded-md bg-transparent">
        {candidates.length} xe
      </Badge>
    </div>
    <ScrollArea className="h-[340px] rounded-lg border">
      <div className="space-y-2 p-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        {!isLoading && Boolean(error) && (
          <div
            className="p-5 text-center text-sm text-rose-700"
            role="alert"
          >
            {getIncidentErrorMessage(error, "Không tải được xe cứu hộ phù hợp.")}
          </div>
        )}
        {!isLoading && !error && candidates.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Không có xe đáp ứng toàn bộ tải trọng, thể tích và nhiệt độ.
          </div>
        )}
        {candidates.map((vehicle) => {
          const selected = vehicle.vehicleId === selectedVehicleId;
          const allIotOnline =
            vehicle.iotDeviceCount > 0 &&
            vehicle.onlineIotDeviceCount === vehicle.iotDeviceCount;
          return (
            <button
              key={vehicle.vehicleId}
              type="button"
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors hover:border-primary",
                selected && "border-primary"
              )}
              onClick={() => onSelect(vehicle.vehicleId)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4 text-blue-700" />
                  {vehicle.truckPlate}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md bg-transparent",
                    allIotOnline
                      ? "border-emerald-500 text-emerald-700"
                      : "border-amber-500 text-amber-700"
                  )}
                >
                  IoT {vehicle.onlineIotDeviceCount}/{vehicle.iotDeviceCount} online
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {vehicle.vehicleType} · {NUMBER_FORMATTER.format(vehicle.maxWeight)} kg ·{" "}
                {NUMBER_FORMATTER.format(vehicle.maxCbm)} m³
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Snowflake className="h-3.5 w-3.5" />
                {vehicle.minTemp}°C → {vehicle.maxTemp}°C
              </p>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  </section>
);

export default RescueCandidateList;
