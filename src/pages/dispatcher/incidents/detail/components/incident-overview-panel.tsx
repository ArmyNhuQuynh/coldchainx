import {
  IncidentExpenseBadge,
  IncidentSeverityBadge,
} from "@/components/incidents/incident-badges";
import {
  formatIncidentDate,
  formatIncidentMoney,
} from "@/components/incidents/incident-formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TIncident } from "@/schemas/incident.schema";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";
import {
  Clock,
  Lock,
  MapPin,
  ShieldAlert,
  Thermometer,
  Truck,
  User,
  Wallet,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatLocation = (incident: TIncident) => {
  if (incident.currentLatitude == null || incident.currentLongitude == null) {
    return "Chưa có tọa độ";
  }
  return `${incident.currentLatitude}, ${incident.currentLongitude}`;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Một ô thông tin trong grid */
const InfoCell = ({
  icon: Icon,
  label,
  children,
  highlight,
}: {
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className={`rounded-lg border p-3 ${highlight ? "border-blue-200 bg-blue-50/60" : "bg-background"}`}>
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </p>
    <div className="mt-1">{children}</div>
  </div>
);

/** Section divider */
const SectionLabel = ({ label }: { label: string }) => (
  <p className="mb-2 mt-1 text-sm font-semibold text-foreground">{label}</p>
);

// ─── Main component ───────────────────────────────────────────────────────────

const IncidentOverviewPanel = ({ incident }: { incident: TIncident }) => {
  const hasNotes =
    incident.handlingNote ||
    incident.transloadNote ||
    incident.rescuePlanDetails;

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-lg">Thông tin báo cáo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        {/* ── Tiêu đề sự cố ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold">
            {getIncidentTypeLabel(incident.incidentType)}
          </span>
          <IncidentSeverityBadge severity={incident.severity} />
          {incident.incidentType && (
            <span className="rounded border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
              CRITICAL
            </span>
          )}
        </div>
        {incident.description && (
          <p className="text-sm text-muted-foreground">{incident.description}</p>
        )}

        {/* ── Grid 2 cột – row 1 ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCell icon={User} label="Người báo cáo">
            <p className="font-semibold leading-tight">
              {incident.reportedByUsername || "—"}
            </p>
            {incident.reportedBy && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {incident.reportedBy}
              </p>
            )}
          </InfoCell>

          <InfoCell icon={Clock} label="Thời điểm báo">
            <p className="font-semibold">
              {formatIncidentDate(incident.reportedAt)}
            </p>
          </InfoCell>
        </div>

        {/* ── Grid 2 cột – row 2 ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCell icon={MapPin} label="Vị trí sự cố">
            <p className="font-semibold">{formatLocation(incident)}</p>
          </InfoCell>

          <InfoCell icon={Wallet} label="Chi phí tài xế đã trả">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">
                {formatIncidentMoney(incident.driverPaidAmount)}
              </p>
              <IncidentExpenseBadge status={incident.expenseStatus} />
            </div>
          </InfoCell>
        </div>

        {/* ── Grid 2 cột – row 3: Nhiệt độ + Safe time ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCell icon={Thermometer} label="Nhiệt độ mới nhất">
            {incident.latestTemperature != null ? (
              <p className="font-semibold">{incident.latestTemperature}°C</p>
            ) : (
              <p className="font-semibold text-muted-foreground">—</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {incident.temperatureSource ? `Nguồn: ${incident.temperatureSource}` : "Chưa có nguồn —"}
            </p>
          </InfoCell>

          <InfoCell icon={ShieldAlert} label="Safe time / ngưỡng">
            {incident.remainingSafeTimeMinutes != null ? (
              <p className="font-semibold">{incident.remainingSafeTimeMinutes} phút còn lại</p>
            ) : (
              <p className="font-semibold text-muted-foreground">—</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {incident.temperatureThresholdBreached
                ? "⚠ Đã vượt ngưỡng nhiệt độ"
                : "Chưa ghi nhận vượt ngưỡng"}
              <br />
              Dung sai: ±{incident.temperatureTolerance ?? 2}°C
            </p>
          </InfoCell>
        </div>

        {/* ── Grid 2 cột – row 4: SLA + Duyệt/hoàn ứng ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCell icon={Clock} label="SLA due">
            <p className="font-semibold">
              {incident.slaDueAt ? formatIncidentDate(incident.slaDueAt) : "—"}
            </p>
          </InfoCell>

          <InfoCell icon={Wallet} label="Duyệt / hoàn ứng">
            <p className="font-semibold">
              {formatIncidentMoney(incident.approvedAmount)} /{" "}
              {formatIncidentMoney(incident.reimbursedAmount)}
            </p>
          </InfoCell>
        </div>

        {/* ── Grid 2 cột – row 5: Khóa giao + Xe hỏng/thay ── */}
        <div className="grid gap-2 sm:grid-cols-2">
          <InfoCell icon={Lock} label="Khóa giao trực tiếp" highlight={incident.directDeliveryLocked}>
            <span
              className={`inline-block rounded px-2 py-0.5 text-sm font-bold ${
                incident.directDeliveryLocked
                  ? "bg-blue-700 text-white"
                  : "text-foreground"
              }`}
            >
              {incident.directDeliveryLocked ? "Đang khóa" : "Không khóa"}
            </span>
          </InfoCell>

          <InfoCell icon={Truck} label="Xe hỏng / xe thay thế">
            {incident.brokenVehicleId || incident.replacementVehicleId ? (
              <>
                <p className="font-semibold">
                  {incident.brokenVehicleId || "—"} /{" "}
                  {incident.replacementVehicleId || "—"}
                </p>
                {incident.maintenanceTicketId && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Ticket báo trị: {incident.maintenanceTicketId.slice(0, 8).toUpperCase()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa ghi nhận</p>
            )}
          </InfoCell>
        </div>

        {/* ── Phương án cứu hộ (full width) ── */}
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs text-muted-foreground">Phương án cứu hộ</p>
          <p className="mt-1 font-semibold">
            {incident.rescuePlanType || "Chưa có"}
          </p>
          {incident.redispatchPlan && (
            <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
              {incident.redispatchPlan}
            </p>
          )}
        </div>

        {/* ── Ghi chú và dữ liệu xử lý ── */}
        {hasNotes && (
          <div className="space-y-2 pt-1">
            <SectionLabel label="Ghi chú và dữ liệu xử lý" />

            {incident.handlingNote && (
              <div className="rounded-lg border bg-background p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Handling note · {formatIncidentDate(incident.handledAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{incident.handlingNote}</p>
              </div>
            )}

            {incident.transloadNote && (
              <div className="rounded-lg border bg-background p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Transload note · {formatIncidentDate(incident.transloadConfirmedAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{incident.transloadNote}</p>
              </div>
            )}

            {incident.transloadDetails && (
              <div className="rounded-lg border bg-background p-3 text-sm">
                <p className="text-xs text-muted-foreground">Chi tiết sang hàng</p>
                <p className="mt-1">
                  {incident.transloadDetails.lpnIds.length} LPN · seal{" "}
                  {incident.transloadDetails.sealNumber || "—"} · nhiệt{" "}
                  {incident.transloadDetails.transferTemperature ?? "—"}°C
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatIncidentDate(incident.transloadDetails.transferredAt)} ·{" "}
                  {incident.transloadDetails.locationDescription || "Không có mô tả vị trí"}
                </p>
              </div>
            )}

            {incident.rescuePlanDetails && (
              <p className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                Backend đã ghi nhận chi tiết kế hoạch cứu hộ.
              </p>
            )}
          </div>
        )}

        {/* ── Footer: Yêu cầu điều xe cứu hộ ── */}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">
            Yêu cầu điều xe cứu hộ
          </span>
          <span
            className={`text-sm font-semibold ${
              incident.requiresRescue ? "text-rose-600" : "text-muted-foreground"
            }`}
          >
            {incident.requiresRescue ? "Có" : "Không"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentOverviewPanel;
