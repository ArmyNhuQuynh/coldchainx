import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { CheckCircle2, CircleDot, Clock3 } from "lucide-react";

const IncidentTimelinePanel = ({ incident }: { incident: TIncident }) => {
  const items = [
    { label: "Đã báo sự cố", at: incident.reportedAt, note: incident.reportedByUsername },
    { label: "Đã đánh giá / xử lý", at: incident.handledAt, note: incident.handlingNote },
    { label: "Đã xác nhận bảo toàn hàng", at: incident.containmentConfirmedAt },
    { label: "Đã điều xe cứu hộ", at: incident.rescueDispatchedAt ?? incident.externalReeferPlan?.dispatchedAt },
    { label: "Đã sang hàng", at: incident.transloadConfirmedAt, note: incident.transloadNote },
    { label: "Hàng đã vào kho tuyến", at: incident.externalReeferPlan?.arrivedAt },
    { label: "Đã tạo trip redispatch", at: incident.externalReeferPlan?.redispatchPlannedAt },
    { label: "Đã hoàn ứng", at: incident.reimbursedAt },
    { label: "Đã đóng Incident", at: incident.resolvedAt, note: incident.resolutionNote },
  ].filter((item) => item.at);

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock3 className="h-5 w-5 text-blue-700" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ol className="space-y-0">
          {items.map((item, index) => (
            <li key={`${item.label}-${item.at}`} className="relative flex gap-3 pb-5 last:pb-0">
              {index < items.length - 1 && <span className="absolute left-[7px] top-5 h-[calc(100%-8px)] w-px bg-border" />}
              {index === items.length - 1 ? (
                <CheckCircle2 className="relative mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              ) : (
                <CircleDot className="relative mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatIncidentDate(item.at)}</p>
                {item.note && <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{item.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default IncidentTimelinePanel;
