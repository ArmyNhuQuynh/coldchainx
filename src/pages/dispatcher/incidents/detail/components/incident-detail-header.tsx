import { Button } from "@/components/ui/button";
import type { TIncident } from "@/schemas/incident.schema";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { IncidentStatusBadge } from "@/components/incidents/incident-badges";
import { formatIncidentId } from "@/components/incidents/incident-formatters";

type Props = {
  incident: TIncident;
  isRefreshing?: boolean;
  onBack: () => void;
  onRefresh: () => void;
};

const IncidentDetailHeader = ({ incident, isRefreshing, onBack, onRefresh }: Props) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div className="flex items-start gap-3">
      <Button type="button" variant="outline" size="icon" title="Quay lại" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">
            Sự cố SC-{formatIncidentId(incident.incidentId)}
          </h1>
          <IncidentStatusBadge status={incident.status} />
        </div>
        <p className="mt-1 text-muted-foreground">
          Trip {formatIncidentId(incident.tripId)} · Theo dõi và xử lý tại một nơi
        </p>
      </div>
    </div>
    <Button
      type="button"
      variant="outline"
      className="gap-2"
      disabled={isRefreshing}
      onClick={onRefresh}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      Cập nhật
    </Button>
  </div>
);

export default IncidentDetailHeader;
