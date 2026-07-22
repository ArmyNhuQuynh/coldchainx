import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { CalendarClock, CircleDollarSign, MapPin, UserRound } from "lucide-react";
import {
  IncidentExpenseBadge,
  IncidentSeverityBadge,
} from "@/components/incidents/incident-badges";
import {
  formatIncidentDate,
  formatIncidentMoney,
} from "@/components/incidents/incident-formatters";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";

const IncidentOverviewPanel = ({ incident }: { incident: TIncident }) => {
  const hasLocation =
    incident.currentLatitude != null && incident.currentLongitude != null;

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-lg">Thông tin báo cáo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">
              {getIncidentTypeLabel(incident.incidentType)}
            </h2>
            <IncidentSeverityBadge severity={incident.severity} />
          </div>
          <p className="mt-3 whitespace-pre-wrap leading-6 text-muted-foreground">
            {incident.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="h-4 w-4" /> Người báo cáo
            </p>
            <p className="mt-2 font-medium">{incident.reportedByUsername || "—"}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" /> Thời điểm báo
            </p>
            <p className="mt-2 font-medium">{formatIncidentDate(incident.reportedAt)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> Vị trí sự cố
            </p>
            <p className="mt-2 font-medium">
              {hasLocation
                ? `${incident.currentLatitude}, ${incident.currentLongitude}`
                : "Chưa có tọa độ"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" /> Chi phí tài xế đã trả
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-medium">{formatIncidentMoney(incident.driverPaidAmount)}</span>
              <IncidentExpenseBadge status={incident.expenseStatus} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-4 text-sm">
          <span className="text-muted-foreground">Yêu cầu điều xe cứu hộ</span>
          <span className={incident.requiresRescue ? "font-semibold text-rose-700" : "font-medium"}>
            {incident.requiresRescue ? "Có" : "Không"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentOverviewPanel;
