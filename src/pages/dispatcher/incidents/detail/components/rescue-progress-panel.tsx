import {
  formatIncidentDate,
  formatIncidentId,
} from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TDispatchRescueResult, TIncident } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { incidentQueryKeys } from "@/hooks/use-incident";
import { useQueryClient } from "@tanstack/react-query";
import TransloadConfirmDialog from "./transload-confirm-dialog";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
  isTripLoading?: boolean;
  canResolve?: boolean;
  onResolve?: () => void;
};

const sameId = (left?: string | null, right?: string | null) =>
  Boolean(left && right && left.toLowerCase() === right.toLowerCase());

const RescueProgressPanel = ({
  incident,
  trip,
  isTripLoading,
  canResolve,
  onResolve,
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const dispatchResult = queryClient.getQueryData<TDispatchRescueResult>(
    incidentQueryKeys.lastRescueResult(incident.incidentId),
  );
  const transloadDone = Boolean(incident.transloadConfirmedAt);
  const replacementVehicleId = incident.replacementVehicleId;
  const replacementVehicleLabel =
    sameId(trip?.vehicle?.vehicleId, replacementVehicleId) &&
    trip?.vehicle?.truckPlate
      ? trip.vehicle.truckPlate
      : isTripLoading && replacementVehicleId
        ? "Đang tải biển số..."
        : replacementVehicleId
          ? `Mã xe ${formatIncidentId(replacementVehicleId)}`
          : "—";

  return (
    <>
      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Xe cứu hộ đã điều động</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi bước sang hàng trước khi cho chuyến chạy tiếp
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-md border-blue-500 bg-transparent text-blue-700"
            >
              {transloadDone ? "Đã sang hàng" : "Đang chờ sang hàng"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Xe thay thế</p>
              <p className="mt-2 font-semibold">{replacementVehicleLabel}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Điều động lúc</p>
              <p className="mt-2 font-semibold">
                {formatIncidentDate(incident.rescueDispatchedAt)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Xác nhận lúc</p>
              <p className="mt-2 font-semibold">
                {formatIncidentDate(incident.transloadConfirmedAt)}
              </p>
            </div>
          </div>

          {dispatchResult && (
            <details className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-sm" open>
              <summary className="cursor-pointer font-semibold">Kết quả điều xe backend</summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p>Xe hỏng: <strong>{dispatchResult.brokenVehiclePlate}</strong> · {dispatchResult.brokenVehicleStatus}</p>
                <p>Xe cứu hộ: <strong>{dispatchResult.rescueVehiclePlate}</strong> · {dispatchResult.rescueVehicleStatus}</p>
                <p>Maintenance ticket: <strong>{formatIncidentId(dispatchResult.maintenanceTicketId)}</strong></p>
                <p>Sang hàng: <strong>{dispatchResult.transloadLpnCount} LPN</strong></p>
                <p>ETA method: <strong>{dispatchResult.etaMethod}</strong></p>
                <p>Khách đã báo: <strong>{dispatchResult.notifiedCustomerCount}</strong></p>
              </div>
              {dispatchResult.updatedStops.length > 0 && (
                <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                  {dispatchResult.updatedStops.map((stop) => (
                    <p key={stop.stopId}>
                      Trạm {stop.stopSequence}: {stop.address || "—"} · trễ {stop.delayMinutes} phút · báo {stop.notifiedCustomers} khách
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

          {!transloadDone ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="flex-1"
                onClick={() => setConfirmOpen(true)}
              >
                Xác nhận đã sang hàng
              </Button>
              {canResolve && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onResolve}
                >
                  <CheckCircle2 className="h-4 w-4" /> Đóng Incident
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Chuyến đã tiếp tục vận chuyển và IoT xe mới đã nhận lệnh theo dõi.
            </div>
          )}
          {transloadDone && canResolve && (
            <Button type="button" className="w-full" onClick={onResolve}>
              <CheckCircle2 className="h-4 w-4" /> Đóng Incident
            </Button>
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
