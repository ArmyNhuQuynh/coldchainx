import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TRescueCandidate } from "@/schemas/incident.schema";
import { AlertTriangle, Clock3, MapPin, Snowflake, Star, Truck } from "lucide-react";
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
                vehicle.recommended && "border-emerald-500 bg-emerald-50/60",
                selected && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => onSelect(vehicle.vehicleId)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4 text-blue-700" />
                  {vehicle.truckPlate}
                </p>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {vehicle.recommended && (
                    <Badge className="bg-emerald-700 text-white">
                      <Star className="h-3 w-3" /> Backend đề xuất
                    </Badge>
                  )}
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
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {vehicle.vehicleType} · {NUMBER_FORMATTER.format(vehicle.maxWeight)} kg ·{" "}
                {NUMBER_FORMATTER.format(vehicle.maxCbm)} m³
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 truncate">
                  {vehicle.warehouseName ?? "Chưa xác định kho"}
                  {vehicle.distanceKm != null
                    ? ` · cách hiện trường ${NUMBER_FORMATTER.format(vehicle.distanceKm)} km`
                    : " · chưa xác định khoảng cách"}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Snowflake className="h-3.5 w-3.5" />
                {vehicle.minTemp}°C → {vehicle.maxTemp}°C
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                ETA {vehicle.estimatedArrivalMinutes != null ? `${vehicle.estimatedArrivalMinutes} phút` : "chưa xác định"}
                {vehicle.remainingSafeTimeMinutes != null
                  ? ` · safe time ${vehicle.remainingSafeTimeMinutes} phút`
                  : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Còn {NUMBER_FORMATTER.format(vehicle.remainingWeightCapacity ?? 0)} kg / {NUMBER_FORMATTER.format(vehicle.remainingCbmCapacity ?? 0)} m³
              </p>
              {(vehicle.hasOnlineIot === false || vehicle.canArriveWithinSafeTime === false) && (
                <p className="mt-2 flex items-start gap-1.5 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {vehicle.hasOnlineIot === false
                    ? "Không có IoT online. "
                    : ""}
                  {vehicle.canArriveWithinSafeTime === false
                    ? "ETA vượt thời gian an toàn còn lại."
                    : ""}
                </p>
              )}
              {vehicle.recommendationReason && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {vehicle.recommendationReason}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  </section>
);

export default RescueCandidateList;
