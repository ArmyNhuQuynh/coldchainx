import { formatIncidentDate, formatIncidentId } from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import TransloadConfirmDialog from "./transload-confirm-dialog";

const RescueProgressPanel = ({ incident }: { incident: TIncident }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const transloadDone = Boolean(incident.transloadConfirmedAt);

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
            <Badge variant="outline" className="rounded-md border-blue-500 bg-transparent text-blue-700">
              {transloadDone ? "Đã sang hàng" : "Đang chờ sang hàng"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Xe thay thế</p><p className="mt-2 font-semibold">{formatIncidentId(incident.replacementVehicleId)}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Điều động lúc</p><p className="mt-2 font-semibold">{formatIncidentDate(incident.rescueDispatchedAt)}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Xác nhận lúc</p><p className="mt-2 font-semibold">{formatIncidentDate(incident.transloadConfirmedAt)}</p></div>
          </div>

          {incident.transloadNote && (
            <p className="rounded-lg border p-3 text-sm text-muted-foreground">
              {incident.transloadNote}
            </p>
          )}

          {!transloadDone ? (
            <Button type="button" className="w-full" onClick={() => setConfirmOpen(true)}>
              Xác nhận đã sang hàng
            </Button>
          ) : (
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Chuyến đã tiếp tục vận chuyển và IoT xe mới đã nhận lệnh theo dõi.
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
