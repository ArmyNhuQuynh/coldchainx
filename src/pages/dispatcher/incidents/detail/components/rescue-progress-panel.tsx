import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { incidentQueryKeys } from "@/hooks/use-incident";
import type { TDispatchRescueResult, TIncident } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import TransloadConfirmDialog from "./transload-confirm-dialog";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
  isTripLoading?: boolean;
};

const sameId = (left?: string | null, right?: string | null) =>
  Boolean(left && right && left.toLowerCase() === right.toLowerCase());

const RescueProgressPanel = ({ incident, trip, isTripLoading }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const dispatchResult = queryClient.getQueryData<TDispatchRescueResult>(
    incidentQueryKeys.lastRescueResult(incident.incidentId),
  );

  const transloadDone = Boolean(incident.transloadConfirmedAt);
  const rescueDispatched = Boolean(
    incident.rescueDispatchedAt ||
      incident.replacementVehicleId ||
      dispatchResult?.rescueVehiclePlate,
  );
  const resolved = incident.status === INCIDENT_STATUS.RESOLVED;
  const canConfirmTransload = rescueDispatched && !transloadDone;
  const replacementVehicleLabel =
    dispatchResult?.rescueVehiclePlate ||
    (sameId(trip?.vehicle?.vehicleId, incident.replacementVehicleId) &&
    trip?.vehicle?.truckPlate
      ? trip.vehicle.truckPlate
      : isTripLoading && incident.replacementVehicleId
        ? "Đang tải biển số..."
        : incident.replacementVehicleId
          ? "Đã điều xe cứu hộ"
          : "Chưa điều xe cứu hộ");

  const steps = [
    {
      label: "Ghi nhận sự cố",
      done: true,
      date: incident.reportedAt,
      icon: Clock3,
    },
    {
      label: "Điều xe cứu hộ",
      done: rescueDispatched,
      date: incident.rescueDispatchedAt,
      icon: Truck,
    },
    {
      label: "Sang hàng",
      done: transloadDone,
      date: incident.transloadConfirmedAt,
      icon: PackageCheck,
    },
    {
      label: "Hệ thống đóng",
      done: resolved,
      date: incident.resolvedAt,
      icon: CheckCircle2,
    },
  ];
  const completedSteps = steps.filter((step) => step.done).length;
  const progressValue = Math.round((completedSteps / steps.length) * 100);

  return (
    <>
      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Tiến trình cứu hộ</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi điều xe, sang hàng và trạng thái tự đóng từ hệ thống
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                transloadDone
                  ? "rounded-md border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "rounded-md border-amber-300 bg-amber-50 text-amber-800"
              }
            >
              {transloadDone ? "Đã sang hàng" : "Đang xử lý cứu hộ"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <Progress value={progressValue} />
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className={
                    step.done
                      ? "rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                      : "rounded-lg border bg-background p-3"
                  }
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        step.done
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"
                          : "flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground"
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="font-semibold">{step.label}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatIncidentDate(step.date)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Xe cứu hộ</p>
              <p className="mt-2 font-semibold">{replacementVehicleLabel}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Điều động lúc</p>
              <p className="mt-2 font-semibold">
                {formatIncidentDate(incident.rescueDispatchedAt)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Sang hàng lúc</p>
              <p className="mt-2 font-semibold">
                {formatIncidentDate(incident.transloadConfirmedAt)}
              </p>
            </div>
          </div>

          {dispatchResult && (
            <details
              className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-sm"
              open
            >
              <summary className="cursor-pointer font-semibold">
                Kết quả điều xe backend
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p>
                  Xe hỏng: <strong>{dispatchResult.brokenVehiclePlate}</strong>{" "}
                  · {dispatchResult.brokenVehicleStatus}
                </p>
                <p>
                  Xe cứu hộ:{" "}
                  <strong>{dispatchResult.rescueVehiclePlate}</strong> ·{" "}
                  {dispatchResult.rescueVehicleStatus}
                </p>
                <p>
                  Sang hàng:{" "}
                  <strong>{dispatchResult.transloadLpnCount} LPN</strong>
                </p>
                <p>
                  Khách đã báo:{" "}
                  <strong>{dispatchResult.notifiedCustomerCount}</strong>
                </p>
              </div>
              {dispatchResult.updatedStops.length > 0 && (
                <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                  {dispatchResult.updatedStops.map((stop) => (
                    <p key={stop.stopId}>
                      Trạm {stop.stopSequence}: {stop.address || "—"} · trễ{" "}
                      {stop.delayMinutes} phút · báo {stop.notifiedCustomers}{" "}
                      khách
                    </p>
                  ))}
                </div>
              )}
            </details>
          )}

          {incident.transloadNote && (
            <p className="rounded-lg border p-3 text-sm text-muted-foreground">
              {incident.transloadNote}
            </p>
          )}

          {canConfirmTransload && (
            <Button
              type="button"
              className="w-full"
              onClick={() => setConfirmOpen(true)}
            >
              Xác nhận đã sang hàng
            </Button>
          )}

          {transloadDone && !resolved && (
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Đã sang hàng. Incident sẽ do hệ thống tự đóng sau khi đủ điều
              kiện hoàn tiền.
            </div>
          )}
        </CardContent>
      </Card>
      <TransloadConfirmDialog
        open={confirmOpen}
        incident={incident}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
};

export default RescueProgressPanel;
