import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_SEVERITY } from "@/types/enums/incident-severity.enum";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { AlertTriangle, CircleDot, Siren, Truck } from "lucide-react";

const IncidentSummaryStrip = ({ incidents }: { incidents: TIncident[] }) => {
  const unresolved = incidents.filter(
    (incident) => incident.status !== INCIDENT_STATUS.RESOLVED
  );
  const stats = [
    {
      label: "Chưa xử lý",
      value: unresolved.filter(
        (incident) => incident.status === INCIDENT_STATUS.REPORTED
      ).length,
      icon: CircleDot,
      className: "text-amber-700",
    },
    {
      label: "Đã điều xe",
      value: unresolved.filter(
        (incident) => incident.status === INCIDENT_STATUS.RESCUE_DISPATCHED
      ).length,
      icon: Truck,
      className: "text-blue-700",
    },
    {
      label: "Cần cứu hộ",
      value: unresolved.filter((incident) => incident.requiresRescue).length,
      icon: Siren,
      className: "text-rose-700",
    },
    {
      label: "Mức nghiêm trọng",
      value: unresolved.filter(
        (incident) => incident.severity === INCIDENT_SEVERITY.CRITICAL
      ).length,
      icon: AlertTriangle,
      className: "text-rose-700",
    },
  ];

  return (
    <div className="grid overflow-hidden rounded-lg border bg-background sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex min-h-24 items-center justify-between gap-4 p-4 ${
            index > 0 ? "border-t sm:border-l sm:border-t-0" : ""
          } ${index === 2 ? "sm:border-l-0 xl:border-l" : ""}`}
        >
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
          <stat.icon className={`h-5 w-5 ${stat.className}`} />
        </div>
      ))}
    </div>
  );
};

export default IncidentSummaryStrip;

