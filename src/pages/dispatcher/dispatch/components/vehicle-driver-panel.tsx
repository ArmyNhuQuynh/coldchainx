import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  TDispatchDriverLookup,
  TDispatchVehicleLookup,
} from "@/schemas/dispatch.schema";
import {
  CalendarClock,
  CheckCircle2,
  Cuboid,
  IdCard,
  Route,
  Snowflake,
  Truck,
  UserRound,
} from "lucide-react";
import { formatNumber } from "./dispatch-helpers";

type Props = {
  vehicles: TDispatchVehicleLookup[];
  drivers: TDispatchDriverLookup[];
  selectedVehicleId: string;
  selectedDriverIds: string[];
  plannedStartTime: string;
  plannedEndTime: string;
  isLoadingVehicles?: boolean;
  isLoadingDrivers?: boolean;
  isSubmitting?: boolean;
  isPreviewing?: boolean;
  isPlanningEnabled: boolean;
  canPreviewPacking: boolean;
  hasCurrentPreview: boolean;
  canCreateTrip: boolean;
  validationMessages: string[];
  onVehicleChange: (vehicleId: string) => void;
  onDriverToggle: (driverId: string) => void;
  onPlannedStartTimeChange: (value: string) => void;
  onPlannedEndTimeChange: (value: string) => void;
  onPreviewPacking: () => void;
  onCreateTrip: () => void;
};

const VehicleDriverPanel = ({
  vehicles,
  drivers,
  selectedVehicleId,
  selectedDriverIds,
  plannedStartTime,
  plannedEndTime,
  isLoadingVehicles,
  isLoadingDrivers,
  isSubmitting,
  isPreviewing,
  isPlanningEnabled,
  canPreviewPacking,
  hasCurrentPreview,
  canCreateTrip,
  validationMessages,
  onVehicleChange,
  onDriverToggle,
  onPlannedStartTimeChange,
  onPlannedEndTimeChange,
  onPreviewPacking,
  onCreateTrip,
}: Props) => {
  return (
    <Card className="min-h-[620px] gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5 text-sky-700" />
          Xe và tài xế
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <CalendarClock className="h-4 w-4" />
              Bắt đầu
            </span>
            <Input
              type="datetime-local"
              value={plannedStartTime}
              disabled={!isPlanningEnabled}
              onChange={(event) => onPlannedStartTimeChange(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Route className="h-4 w-4" />
              Kết thúc dự kiến
            </span>
            <Input
              type="datetime-local"
              value={plannedEndTime}
              disabled={!isPlanningEnabled}
              onChange={(event) => onPlannedEndTimeChange(event.target.value)}
            />
          </label>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Xe đủ điều kiện</h3>
            <Badge variant="outline">{vehicles.length} xe</Badge>
          </div>
          <ScrollArea className="h-[392px] rounded-lg border">
            <div className="space-y-2 p-3">
              {isLoadingVehicles &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}

              {!isLoadingVehicles && vehicles.length === 0 && (
                <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">
                  Không có xe phù hợp
                </div>
              )}

              {!isLoadingVehicles &&
                vehicles.map((vehicle) => {
                  const checked = vehicle.vehicleId === selectedVehicleId;

                  return (
                    <Button
                      key={vehicle.vehicleId}
                      type="button"
                      variant="outline"
                      disabled={!isPlanningEnabled}
                      onClick={() => onVehicleChange(vehicle.vehicleId)}
                      className={cn(
                        "h-auto w-full justify-start rounded-lg p-0 text-left shadow-none",
                        checked && "border-sky-600 bg-sky-50/80"
                      )}
                    >
                      <div className="w-full p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Truck className="h-4 w-4 text-sky-700" />
                            <span className="truncate font-semibold">
                              {vehicle.truckPlate}
                            </span>
                          </div>
                          {checked && <CheckCircle2 className="h-4 w-4 text-sky-700" />}
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <span>
                            {vehicle.vehicleType || "—"} · {formatNumber(vehicle.maxWeight)} kg · {formatNumber(vehicle.maxCbm)} m³
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Snowflake className="h-3.5 w-3.5" />
                            {formatNumber(vehicle.minTemp)}°C → {formatNumber(vehicle.maxTemp)}°C
                          </span>
                        </div>
                      </div>
                    </Button>
                  );
                })}
            </div>
          </ScrollArea>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Tài xế khả dụng</h3>
            <Badge variant="outline">{selectedDriverIds.length}/2 đã chọn</Badge>
          </div>
          <ScrollArea className="h-[340px] rounded-lg border">
            <div className="space-y-2 p-3">
              {isLoadingDrivers &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}

              {!isLoadingDrivers && drivers.length === 0 && (
                <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                  Không có tài xế phù hợp
                </div>
              )}

              {!isLoadingDrivers &&
                drivers.map((driver) => {
                  const checked = selectedDriverIds.includes(driver.driverId);
                  const disabled =
                    !isPlanningEnabled || (!checked && selectedDriverIds.length >= 2);

                  return (
                    <Button
                      key={driver.driverId}
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      onClick={() => onDriverToggle(driver.driverId)}
                      className={cn(
                        "h-auto w-full justify-start rounded-lg p-0 text-left shadow-none",
                        checked && "border-emerald-600 bg-emerald-50/80"
                      )}
                    >
                      <div className="w-full p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <UserRound className="h-4 w-4 text-emerald-700" />
                            <span className="truncate font-semibold">
                              {driver.fullName}
                            </span>
                          </div>
                          {checked && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <span>{driver.phoneNumber || "—"} · {driver.status || "—"}</span>
                          <span className="flex items-center gap-1.5">
                            <IdCard className="h-3.5 w-3.5" />
                            Bằng {driver.licenseClass || "—"} · Hạn {driver.licenseExpiry || "—"}
                          </span>
                        </div>
                      </div>
                    </Button>
                  );
                })}
            </div>
          </ScrollArea>
        </section>

        {validationMessages.length > 0 && (
          <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {validationMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          disabled={!canPreviewPacking || isPreviewing}
          onClick={onPreviewPacking}
        >
          <Cuboid className="h-4 w-4" />
          {isPreviewing
            ? "Đang tạo mô phỏng..."
            : hasCurrentPreview
              ? "Xem lại mô phỏng 3D"
              : "Xem mô phỏng 3D"}
        </Button>

        <Button
          type="button"
          className="h-11 w-full"
          disabled={!canCreateTrip || isSubmitting}
          onClick={onCreateTrip}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isSubmitting ? "Đang tạo chuyến..." : "Plan Load · Tạo Trip"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleDriverPanel;
