import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { CheckCircle2, Circle, CircleDot, Clock3 } from "lucide-react";

type WorkflowStep = {
  label: string;
  statuses: string[];
  at?: string | null;
  note?: string | null;
};

const getWorkflowSteps = (incident: TIncident): WorkflowStep[] => {
  const common: WorkflowStep[] = [
    {
      label: "Đã báo sự cố",
      statuses: [INCIDENT_STATUS.REPORTED],
      at: incident.reportedAt,
      note: incident.reportedByUsername,
    },
    {
      label: "Đánh giá và bảo toàn hàng",
      statuses: [
        INCIDENT_STATUS.TRIAGED,
        INCIDENT_STATUS.MONITORING,
        INCIDENT_STATUS.CONTAINMENT_REQUIRED,
        INCIDENT_STATUS.RESCUE_PLANNING,
      ],
      at: incident.containmentConfirmedAt ?? incident.handledAt,
      note: incident.handlingNote,
    },
  ];

  if (!incident.requiresRescue) {
    return [
      ...common,
      {
        label: "Chuyến tiếp tục",
        statuses: [INCIDENT_STATUS.CONTINUED],
        at: incident.handledAt,
      },
      {
        label: "Đóng Incident",
        statuses: [INCIDENT_STATUS.RESOLVED],
        at: incident.resolvedAt,
        note: incident.resolutionNote,
      },
    ];
  }

  if (incident.rescuePlanType === "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE") {
    return [
      ...common,
      {
        label: "Xe lạnh ngoài về kho tuyến",
        statuses: [INCIDENT_STATUS.EXTERNAL_REEFER_IN_TRANSIT],
        at: incident.externalReeferPlan?.dispatchedAt,
      },
      {
        label: "Hàng đã inbound kho tuyến",
        statuses: [INCIDENT_STATUS.READY_FOR_REDISPATCH],
        at: incident.externalReeferPlan?.arrivedAt,
      },
      {
        label: "Đã ghép chuyến giao lại",
        statuses: [
          INCIDENT_STATUS.REDISPATCH_PLANNED,
          INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER,
        ],
        at: incident.externalReeferPlan?.redispatchPlannedAt,
      },
      {
        label: "Đóng Incident",
        statuses: [INCIDENT_STATUS.RESOLVED],
        at: incident.resolvedAt,
        note: incident.resolutionNote,
      },
    ];
  }

  if (
    incident.rescuePlanType === "INTERNAL_COLD_STORAGE" ||
    incident.rescuePlanType === "MANUAL_ESCALATION"
  ) {
    return [
      ...common,
      {
        label:
          incident.rescuePlanType === "INTERNAL_COLD_STORAGE"
            ? "Bảo quản tại kho lạnh nội bộ"
            : "Chờ phương án khẩn cấp",
        statuses: [
          INCIDENT_STATUS.AT_INTERNAL_COLD_STORAGE,
          INCIDENT_STATUS.AWAITING_EMERGENCY_PLAN,
          INCIDENT_STATUS.REDISPATCH_PLANNED,
        ],
        at: incident.handledAt,
        note: incident.redispatchPlan,
      },
      {
        label: "Đóng Incident",
        statuses: [INCIDENT_STATUS.RESOLVED],
        at: incident.resolvedAt,
        note: incident.resolutionNote,
      },
    ];
  }

  return [
    ...common,
    {
      label: "Điều xe cứu hộ",
      statuses: [INCIDENT_STATUS.RESCUE_DISPATCHED],
      at: incident.rescueDispatchedAt,
    },
    {
      label: "Hoàn tất sang hàng",
      statuses: [INCIDENT_STATUS.TRANSLOAD_COMPLETED],
      at: incident.transloadConfirmedAt,
      note: incident.transloadNote,
    },
    {
      label: "Đóng Incident",
      statuses: [INCIDENT_STATUS.RESOLVED],
      at: incident.resolvedAt,
      note: incident.resolutionNote,
    },
  ];
};

const IncidentTimelinePanel = ({ incident }: { incident: TIncident }) => {
  const steps = getWorkflowSteps(incident);
  const matchedIndex = steps.findIndex((step) =>
    step.statuses.includes(incident.status),
  );
  const currentIndex = matchedIndex >= 0 ? matchedIndex : 0;

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock3 className="h-5 w-5 text-blue-700" /> Tiến trình cứu hộ
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Bước hiện tại được xác định từ status backend: {incident.status}
        </p>
      </CardHeader>
      <CardContent className="p-5">
        <ol className="space-y-0">
          {steps.map((step, index) => {
            const completed = index < currentIndex;
            const active = index === currentIndex;
            const Icon = completed ? CheckCircle2 : active ? CircleDot : Circle;

            return (
              <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                {index < steps.length - 1 && (
                  <span
                    className={`absolute left-[7px] top-5 h-[calc(100%-8px)] w-px ${
                      completed ? "bg-emerald-400" : "bg-border"
                    }`}
                  />
                )}
                <Icon
                  className={`relative mt-0.5 h-4 w-4 shrink-0 ${
                    completed
                      ? "text-emerald-700"
                      : active
                        ? "text-blue-700"
                        : "text-muted-foreground/50"
                  }`}
                />
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${!completed && !active ? "text-muted-foreground" : ""}`}>
                    {step.label}
                  </p>
                  {active && (
                    <p className="mt-1 text-xs font-medium text-blue-700">Đang ở bước này</p>
                  )}
                  {step.at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatIncidentDate(step.at)}
                    </p>
                  )}
                  {step.note && (
                    <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                      {step.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
};

export default IncidentTimelinePanel;
