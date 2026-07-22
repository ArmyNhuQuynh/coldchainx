import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getIncidentExpenseStatusLabel } from "@/types/enums/incident-expense-status.enum";
import { getIncidentSeverityLabel } from "@/types/enums/incident-severity.enum";
import { getIncidentStatusLabel } from "@/types/enums/incident-status.enum";

export const IncidentStatusBadge = ({ status }: { status?: string | null }) => {
  const statusInfo = getIncidentStatusLabel(status);
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-medium", statusInfo.className)}
    >
      {statusInfo.label}
    </Badge>
  );
};

export const IncidentSeverityBadge = ({
  severity,
}: {
  severity?: string | null;
}) => {
  const severityInfo = getIncidentSeverityLabel(severity);
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-medium", severityInfo.className)}
    >
      {severityInfo.label}
    </Badge>
  );
};

export const IncidentExpenseBadge = ({
  status,
}: {
  status?: string | null;
}) => {
  const statusInfo = getIncidentExpenseStatusLabel(status);
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-medium", statusInfo.className)}
    >
      {statusInfo.label}
    </Badge>
  );
};
