import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { CheckCircle2 } from "lucide-react";
import RescueDispatchForm from "./rescue-dispatch-form";
import RescueProgressPanel from "./rescue-progress-panel";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
};

const RescueOperationPanel = ({ incident, trip }: Props) => {
  if (!incident.requiresRescue) {
    return (
      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-lg">Phương án xử lý</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">Tài xế không yêu cầu điều xe cứu hộ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dispatcher tiếp tục theo dõi chuyến; Admin sẽ đóng sự cố sau khi xử lý xong.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (incident.status === INCIDENT_STATUS.RESOLVED) {
    return (
      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-lg">Kết quả xử lý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">Sự cố đã được giải quyết</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {incident.resolutionNote || "Không có ghi chú kết thúc."}
          </p>
          <p className="text-sm">Hoàn tất lúc {formatIncidentDate(incident.resolvedAt)}</p>
        </CardContent>
      </Card>
    );
  }

  if (incident.status === INCIDENT_STATUS.RESCUE_DISPATCHED) {
    return <RescueProgressPanel incident={incident} />;
  }

  return <RescueDispatchForm incident={incident} trip={trip} />;
};

export default RescueOperationPanel;
