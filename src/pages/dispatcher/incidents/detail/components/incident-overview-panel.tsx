import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { CalendarClock, CircleDollarSign, MapPin, ShieldAlert, Truck, UserRound } from "lucide-react";
import {
  IncidentExpenseBadge,
  IncidentSeverityBadge,
  IncidentRiskBadge,
} from "@/components/incidents/incident-badges";
import {
  formatIncidentDate,
  formatIncidentId,
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
            <IncidentRiskBadge risk={incident.riskLevel} />
          </div>
          <p className="mt-3 whitespace-pre-wrap leading-6 text-muted-foreground">
            {incident.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="h-4 w-4 shrink-0" /> Người báo cáo
            </p>
            <p className="mt-2 break-all font-medium leading-5">
              {incident.reportedByUsername || "—"}
            </p>
            <p className="mt-1 break-all text-xs text-muted-foreground">
              {incident.reportedBy}
            </p>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Nhiệt độ mới nhất</p>
            <p className="mt-2 font-medium">
              {incident.latestTemperature != null ? `${incident.latestTemperature}°C` : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {incident.temperatureSource || "Chưa có nguồn"} · {formatIncidentDate(incident.temperatureMeasuredAt)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Safe time / ngưỡng</p>
            <p className="mt-2 font-medium">
              {incident.remainingSafeTimeMinutes != null ? `${incident.remainingSafeTimeMinutes} phút` : "—"}
            </p>
            <p className={`mt-1 text-xs ${incident.temperatureThresholdBreached ? "text-rose-700" : "text-muted-foreground"}`}>
              {incident.temperatureThresholdBreached ? "Đã vượt ngưỡng" : "Chưa ghi nhận vượt ngưỡng"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dung sai: ±{incident.temperatureTolerance ?? "—"}°C
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">SLA due</p>
            <p className="mt-2 font-medium">{formatIncidentDate(incident.slaDueAt)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Duyệt / hoàn ứng</p>
            <p className="mt-2 font-medium">
              {formatIncidentMoney(incident.approvedAmount)} / {formatIncidentMoney(incident.reimbursedAmount)}
            </p>
          </div>
        </div>

        {incident.safeTimeCalculation && (
          <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            {incident.safeTimeCalculation}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldAlert className="h-4 w-4" /> Khóa giao trực tiếp
            </p>
            <p className={`mt-2 font-medium ${incident.directDeliveryLocked ? "text-rose-700" : ""}`}>
              {incident.directDeliveryLocked ? "Đang khóa" : "Không khóa"}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" /> Xe hỏng / xe thay thế
            </p>
            <p className="mt-2 font-medium">
              {formatIncidentId(incident.brokenVehicleId)} / {formatIncidentId(incident.replacementVehicleId)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ticket bảo trì: {formatIncidentId(incident.maintenanceTicketId)}
            </p>
          </div>
          <div className="rounded-lg border p-3 sm:col-span-2">
            <p className="text-sm text-muted-foreground">Phương án cứu hộ</p>
            <p className="mt-2 font-medium">{incident.rescuePlanType || "Chưa có"}</p>
            {incident.redispatchPlan && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {incident.redispatchPlan}
              </p>
            )}
          </div>
        </div>

        {(incident.handlingNote || incident.transloadNote || incident.rescuePlanDetails) && (
          <div className="space-y-3 border-t pt-4">
            <p className="font-medium">Ghi chú và dữ liệu xử lý</p>
            {incident.handlingNote && (
              <div className="rounded-lg border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Handling note · {formatIncidentDate(incident.handledAt)}</p>
                <p className="mt-1 whitespace-pre-wrap">{incident.handlingNote}</p>
              </div>
            )}
            {incident.transloadNote && (
              <div className="rounded-lg border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Transload note · {formatIncidentDate(incident.transloadConfirmedAt)}</p>
                <p className="mt-1 whitespace-pre-wrap">{incident.transloadNote}</p>
              </div>
            )}
            {incident.transloadDetails && (
              <div className="rounded-lg border p-3 text-sm">
                <p className="text-xs text-muted-foreground">Chi tiết sang hàng</p>
                <p className="mt-1">
                  {incident.transloadDetails.lpnIds.length} LPN · seal {incident.transloadDetails.sealNumber || "—"} · nhiệt {incident.transloadDetails.transferTemperature ?? "—"}°C
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatIncidentDate(incident.transloadDetails.transferredAt)} · {incident.transloadDetails.locationDescription || "Không có mô tả vị trí"}
                </p>
              </div>
            )}
            {incident.rescuePlanDetails && (
              <details className="rounded-lg border p-3 text-sm">
                <summary className="cursor-pointer font-medium">Chi tiết kế hoạch backend</summary>
                <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/40 p-3 text-xs">
                  {incident.rescuePlanDetails}
                </pre>
              </details>
            )}
          </div>
        )}

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
