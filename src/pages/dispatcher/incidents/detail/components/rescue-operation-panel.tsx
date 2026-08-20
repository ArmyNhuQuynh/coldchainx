import {
  formatIncidentDate,
  formatIncidentId,
} from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncident } from "@/hooks/use-incident";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  PackageCheck,
  Play,
  RefreshCw,
  ShieldCheck,
  Siren,
  Truck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AssessRiskDialog from "./assess-risk-dialog";
import ContinueTripDialog from "./continue-trip-dialog";
import ExternalReeferDispatchForm from "./external-reefer-dispatch-form";
import RescueDispatchForm from "./rescue-dispatch-form";
import RescueFallbackForm from "./rescue-fallback-form";
import RescueProgressPanel from "./rescue-progress-panel";
import ResolveIncidentDialog from "./resolve-incident-dialog";
import {
  getIncidentPrimaryAction,
  getResolutionBlocker,
  isMandatoryExternalReeferIncident,
} from "../incident-workflow";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
  isTripLoading?: boolean;
};

const StatusCard = ({
  title,
  description,
  icon: Icon = Clock3,
  children,
}: {
  title: string;
  description: string;
  icon?: typeof Clock3;
  children?: ReactNode;
}) => (
  <Card className="gap-0 rounded-lg py-0">
    <CardHeader className="border-b px-5 py-4">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5 text-primary" /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 p-5">
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      {children}
    </CardContent>
  </Card>
);

const RescuePlanning = ({ incident, trip }: Props) => {
  const { getRescueOptions } = useIncident();
  const optionsQuery = getRescueOptions(incident.incidentId);
  const plan = optionsQuery.data;

  if (optionsQuery.isLoading) {
    return (
      <Card className="gap-0 rounded-lg py-0">
        <CardContent className="space-y-3 p-5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (optionsQuery.isError || !plan) {
    return (
      <StatusCard
        title="Không tải được phương án cứu hộ"
        description="Không tự đoán phương án. Hãy tải lại rescue options từ backend."
        icon={AlertTriangle}
      >
        <Button type="button" variant="outline" onClick={() => optionsQuery.refetch()}>
          <RefreshCw className="h-4 w-4" /> Tải lại phương án
        </Button>
      </StatusCard>
    );
  }

  const mandatoryExternal = isMandatoryExternalReeferIncident(incident);
  if (
    mandatoryExternal &&
    (plan.recommendedAction !== "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE" ||
      !plan.requiresExternalVehicleRental)
  ) {
    return (
      <StatusCard
        title="Backend trả phương án không hợp lệ cho breakdown"
        description="VEHICLE_BREAKDOWN/REEFER_BREAKDOWN chỉ được dùng xe lạnh ngoài về kho đích tuyến. FE đã chặn mọi phương án khác."
        icon={AlertTriangle}
      />
    );
  }

  switch (plan.recommendedAction) {
    case "DIRECT_RESCUE":
    case "WAREHOUSE_RESCUE":
      return <RescueDispatchForm incident={incident} trip={trip} plan={plan} />;
    case "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE":
      return <ExternalReeferDispatchForm incident={incident} plan={plan} />;
    case "INTERNAL_COLD_STORAGE":
    case "MANUAL_ESCALATION":
      return <RescueFallbackForm incident={incident} plan={plan} />;
    default:
      return (
        <StatusCard
          title="Phương án backend chưa được hỗ trợ"
          description={`recommendedAction=${plan.recommendedAction}. Incident được giữ mở để tránh thao tác sai.`}
          icon={AlertTriangle}
        />
      );
  }
};

const ExternalReeferTracking = ({ incident }: { incident: TIncident }) => {
  const plan = incident.externalReeferPlan;
  return (
    <StatusCard
      title="Đang chờ kho inbound cứu hộ"
      description="Xe lạnh ngoài đã được xác nhận. Backend đã giao task cho Warehouse đích; Dispatcher không quản lý xe và không xác nhận xe đến."
      icon={Truck}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Kho đích tuyến</p>
          <p className="mt-2 font-semibold">
            {plan?.destinationWarehouseName || "Backend đang cập nhật"}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Toàn bộ hàng cứu hộ</p>
          <p className="mt-2 font-semibold">
            {plan?.lpnIds?.length ?? 0} LPN
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">
            Next action của Warehouse
          </p>
          <p className="mt-2 font-semibold">INBOUND_RESCUE_BY_SEAL</p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <span>Warehouse chỉ cần nhập seal, không QC</span>
        <Badge variant="outline">Chờ inbound</Badge>
      </div>
    </StatusCard>
  );
};

const RescueOperationPanel = ({ incident, trip, isTripLoading }: Props) => {
  const navigate = useNavigate();
  const [assessOpen, setAssessOpen] = useState(false);
  const [containmentOpen, setContainmentOpen] = useState(false);
  const [continueOpen, setContinueOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const action = getIncidentPrimaryAction(incident.status);
  const redispatchTripId =
    incident.externalReeferPlan?.redispatchTripId ?? incident.tripId ?? null;
  if (incident.status === INCIDENT_STATUS.RESOLVED) {
    return (
      <StatusCard
        title="Incident đã đóng"
        description={incident.resolutionNote || "Không có ghi chú kết thúc."}
        icon={CheckCircle2}
      >
        <p className="text-sm">Hoàn tất lúc {formatIncidentDate(incident.resolvedAt)}</p>
      </StatusCard>
    );
  }

  if (action === "PLAN_RESCUE") {
    return <RescuePlanning incident={incident} trip={trip} />;
  }
  if (action === "TRACK_RESCUE") {
    return (
      <RescueProgressPanel
        incident={incident}
        trip={trip}
        isTripLoading={isTripLoading}
      />
    );
  }
  if (action === "TRACK_EXTERNAL_REEFER") {
    return <ExternalReeferTracking incident={incident} />;
  }

  if (action === "CREATE_REDISPATCH_TRIP") {
    const plan = incident.externalReeferPlan;
    const blocker = !plan?.destinationWarehouseId
      ? "Thiếu kho đích tuyến trong externalReeferPlan."
      : !plan.lpnIds?.length
        ? "Backend chưa trả danh sách toàn bộ LPN đã inbound."
        : null;
    return (
      <StatusCard
        title="TẠO LẠI CHUYẾN TỪ INCIDENT"
        description="Hàng đã inbound bằng seal. Tạo trip mới gấp từ đúng kho đích với toàn bộ LPN bị khóa."
        icon={Siren}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm"><p className="text-muted-foreground">Kho xuất phát</p><p className="mt-1 font-semibold">{plan?.destinationWarehouseName || "—"}</p></div>
          <div className="rounded-lg border p-3 text-sm"><p className="text-muted-foreground">LPN bắt buộc</p><p className="mt-1 font-semibold">{plan?.lpnIds?.length ?? 0}/{plan?.lpnIds?.length ?? 0} LPN</p></div>
        </div>
        {blocker && <p className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">{blocker}</p>}
        <Button
          type="button"
          className="w-full"
          disabled={Boolean(blocker)}
          onClick={() => navigate(`${PATH_DISPATCHER_DASHBOARD.dispatch.root}?incidentId=${encodeURIComponent(incident.incidentId)}`)}
        >
          <PackageCheck className="h-4 w-4" /> Tạo lại chuyến gấp
        </Button>
      </StatusCard>
    );
  }

  if (action === "OPEN_REDISPATCH_TRIP") {
    return (
      <StatusCard
        title="Trip mới đã được tạo"
        description={incident.redispatchPlan || "Warehouse đang picking/loading/kẹp seal. Incident chưa đủ điều kiện resolve."}
        icon={PackageCheck}
      >
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Trip redispatch</p>
          <p className="mt-1 font-semibold">{formatIncidentId(redispatchTripId)}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={!redispatchTripId}
          onClick={() => navigate(`${PATH_DISPATCHER_DASHBOARD.trip.root}?tripId=${encodeURIComponent(redispatchTripId ?? "")}`)}
        >
          <ExternalLink className="h-4 w-4" /> Mở trip mới
        </Button>
      </StatusCard>
    );
  }

  if (action === "TRACK_TRIP") {
    return (
      <StatusCard
        title="Incident vẫn đang mở"
        description={incident.redispatchPlan || incident.handlingNote || "Theo dõi phương án tiếp theo từ kho lạnh nội bộ."}
        icon={Clock3}
      />
    );
  }

  if (action === "EMERGENCY_PLAN") {
    const emergencyPlan: TIncidentRescuePlan = {
      incidentId: incident.incidentId,
      tripId: incident.tripId ?? "",
      targetTemperature: incident.latestTemperature ?? 0,
      temperatureThresholdBreached: Boolean(incident.temperatureThresholdBreached),
      directDeliveryLocked: Boolean(incident.directDeliveryLocked),
      recommendedAction: "MANUAL_ESCALATION",
      recommendationReason: incident.handlingNote || "Chưa có phương án hệ thống hợp lệ; cập nhật quyết định khẩn cấp.",
      vehicles: [],
      internalColdStorages: [],
      requiresExternalVehicleRental: false,
      requiresManualEscalation: true,
    };
    return <RescueFallbackForm incident={incident} plan={emergencyPlan} />;
  }

  const resolutionBlocker = getResolutionBlocker(incident);

  return (
    <>
      <StatusCard
        title={
          action === "ASSESS_RISK"
            ? "Chờ Dispatcher đánh giá risk"
            : action === "CONFIRM_CONTAINMENT"
              ? "Cần xác nhận bảo toàn hàng"
              : action === "CONTINUE_TRIP"
                ? incident.status === INCIDENT_STATUS.MONITORING
                  ? "Đang theo dõi nhiệt độ"
                  : "Đã xử lý tại chỗ"
                : "Theo dõi hoàn tất Incident"
        }
        description={
          action === "ASSESS_RISK"
            ? "Chọn LOW, WARNING hoặc CRITICAL và gửi đầy đủ dữ liệu đo cho backend quyết định trạng thái."
            : action === "CONFIRM_CONTAINMENT"
              ? "Không được mở cứu hộ trước khi toàn bộ hàng được bảo toàn trong điều kiện lạnh."
              : action === "CONTINUE_TRIP"
                ? incident.safeTimeCalculation || "Có thể cho chuyến tiếp tục hoặc đánh giá lại theo trạng thái thực tế."
                : resolutionBlocker || "Đã đủ điều kiện vận hành để đóng Incident."
        }
        icon={action === "CONFIRM_CONTAINMENT" ? ShieldCheck : action === "ASSESS_RISK" ? AlertTriangle : Play}
      >
        {incident.status === INCIDENT_STATUS.MONITORING && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3 text-sm"><p className="text-muted-foreground">Reading</p><p className="mt-1 font-semibold">{incident.latestTemperature != null ? `${incident.latestTemperature}°C` : "—"}</p></div>
            <div className="rounded-lg border p-3 text-sm"><p className="text-muted-foreground">Nguồn / thời điểm</p><p className="mt-1 font-semibold">{incident.temperatureSource || "—"}</p><p className="mt-1 text-xs text-muted-foreground">{formatIncidentDate(incident.temperatureMeasuredAt)}</p></div>
            <div className="rounded-lg border p-3 text-sm"><p className="text-muted-foreground">An toàn còn lại</p><p className="mt-1 font-semibold">{incident.remainingSafeTimeMinutes != null ? `${incident.remainingSafeTimeMinutes} phút` : "—"}</p></div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {action === "ASSESS_RISK" && (
            <Button type="button" onClick={() => setAssessOpen(true)}>
              Đánh giá Risk
            </Button>
          )}
          {action === "CONFIRM_CONTAINMENT" && (
            <Button type="button" onClick={() => setContainmentOpen(true)}>
              <ShieldCheck className="h-4 w-4" /> Xác nhận đã bảo toàn hàng
            </Button>
          )}
          {action === "CONTINUE_TRIP" && (
            <>
              <Button type="button" onClick={() => setContinueOpen(true)}>
                <Play className="h-4 w-4" /> Cho chuyến tiếp tục
              </Button>
              {incident.status === INCIDENT_STATUS.MONITORING && (
                <Button type="button" variant="outline" onClick={() => setAssessOpen(true)}>
                  Đánh giá lại
                </Button>
              )}
            </>
          )}
          {action === "RESOLVE" && (
            <Button type="button" disabled={Boolean(resolutionBlocker)} onClick={() => setResolveOpen(true)}>
              <CheckCircle2 className="h-4 w-4" /> Đóng Incident
            </Button>
          )}
        </div>
      </StatusCard>

      <AssessRiskDialog open={assessOpen} incident={incident} onOpenChange={setAssessOpen} />
      <AssessRiskDialog open={containmentOpen} incident={incident} containmentOnly onOpenChange={setContainmentOpen} />
      <ContinueTripDialog open={continueOpen} incident={incident} onOpenChange={setContinueOpen} />
      <ResolveIncidentDialog open={resolveOpen} incident={incident} onOpenChange={setResolveOpen} />
    </>
  );
};

export default RescueOperationPanel;
