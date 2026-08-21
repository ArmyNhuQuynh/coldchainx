import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncident } from "@/hooks/use-incident";
import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE } from "@/types/enums/incident-type.enum";
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
import InboundRouteWarehouseDialog from "./inbound-route-warehouse-dialog";
import RescueDispatchForm from "./rescue-dispatch-form";
import RescueFallbackForm from "./rescue-fallback-form";
import {
  getIncidentPrimaryAction,
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

const RescueOptionsSummary = ({ plan }: { plan: TIncidentRescuePlan }) => (
  <Card className="gap-0 rounded-lg border-blue-200 py-0">
    <CardHeader className="border-b px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Phương án backend đề xuất</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{plan.recommendationReason}</p>
        </div>
        <Badge className="bg-blue-700 text-white">{plan.recommendedAction}</Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Nhiệt độ mục tiêu</p>
          <p className="mt-1 font-semibold">{plan.targetTemperature}°C</p>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Safe time</p>
          <p className="mt-1 font-semibold">{plan.remainingSafeTimeMinutes != null ? `${plan.remainingSafeTimeMinutes} phút` : "Không xác định"}</p>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Ngưỡng / giao trực tiếp</p>
          <p className={`mt-1 font-semibold ${plan.temperatureThresholdBreached || plan.directDeliveryLocked ? "text-rose-700" : ""}`}>
            {plan.temperatureThresholdBreached ? "Đã vượt ngưỡng" : "Trong ngưỡng"} · {plan.directDeliveryLocked ? "Đang khóa" : "Không khóa"}
          </p>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Cờ backend</p>
          <p className="mt-1 font-semibold">
            {plan.requiresExternalVehicleRental ? "Cần thuê xe ngoài" : plan.requiresManualEscalation ? "Cần escalated thủ công" : "Có phương án nội bộ"}
          </p>
        </div>
      </div>
      <div className="rounded-lg border p-3 text-sm">
        <p className="font-medium">Xe phù hợp ({plan.vehicles.length})</p>
        <p className="mt-1 text-muted-foreground">
          {plan.vehicles.length
            ? plan.vehicles.map((vehicle) => `${vehicle.truckPlate}${vehicle.recommended ? " (đề xuất)" : ""}`).join(" · ")
            : "Không có xe nội bộ phù hợp"}
        </p>
      </div>
      <div className="rounded-lg border p-3 text-sm">
        <p className="font-medium">Kho lạnh nội bộ ({plan.internalColdStorages.length})</p>
        <div className="mt-2 space-y-2">
          {plan.internalColdStorages.length === 0 ? (
            <p className="text-muted-foreground">Không có kho phù hợp</p>
          ) : (
            plan.internalColdStorages.map((warehouse) => (
              <div key={warehouse.warehouseId} className={`rounded border p-2 ${warehouse.isRouteDestinationWarehouse ? "border-violet-400 bg-violet-50" : ""}`}>
                <p className="font-medium">
                  {warehouse.warehouseName}{warehouse.isRouteDestinationWarehouse ? " · kho đích tuyến" : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {warehouse.address || "—"} · {warehouse.distanceKm ?? "?"} km · ETA {warehouse.estimatedArrivalMinutes ?? "?"} phút · còn {warehouse.availablePalletPositions} vị trí pallet · nhiệt {warehouse.minTemperature ?? "?"}..{warehouse.maxTemperature ?? "?"}°C
                </p>
              </div>
            ))
          )}
        </div>
      </div>
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
        <Button
          type="button"
          variant="outline"
          onClick={() => optionsQuery.refetch()}
        >
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

  let operation: ReactNode;
  switch (plan.recommendedAction) {
    case "DIRECT_RESCUE":
    case "WAREHOUSE_RESCUE":
      operation = <RescueDispatchForm incident={incident} trip={trip} plan={plan} />;
      break;
    case "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE":
      operation = <ExternalReeferDispatchForm incident={incident} plan={plan} />;
      break;
    case "INTERNAL_COLD_STORAGE":
    case "MANUAL_ESCALATION":
      operation = <RescueFallbackForm incident={incident} plan={plan} />;
      break;
    default:
      operation = (
        <StatusCard
          title="Phương án backend chưa được hỗ trợ"
          description={`recommendedAction=${plan.recommendedAction}. Incident được giữ mở để tránh thao tác sai.`}
          icon={AlertTriangle}
        />
      );
  }

  return (
    <div className="space-y-5">
      <RescueOptionsSummary plan={plan} />
      {operation}
    </div>
  );
};

const ExternalReeferTracking = ({ incident }: { incident: TIncident }) => {
  const plan = incident.externalReeferPlan;
  const [inboundOpen, setInboundOpen] = useState(false);
  return (
    <>
      <StatusCard
        title="Xe lạnh ngoài đang về kho đích tuyến"
        description="Chờ xác nhận inbound bằng seal tại kho. Xe ngoài không được giao trực tiếp cho khách."
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
          <p className="mt-2 font-semibold">{plan?.lpnIds?.length ?? 0} LPN</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">
            Next action của Warehouse
          </p>
          <p className="mt-2 font-semibold">INBOUND_RESCUE_BY_SEAL</p>
        </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">Xe ngoài / tài xế</p>
            <p className="mt-1 font-semibold">{plan?.vehiclePlate || "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{plan?.driverName || "—"} · {plan?.rentalProvider || "—"}</p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">Nhiệt độ / ETA</p>
            <p className="mt-1 font-semibold">{plan?.agreedTemperature ?? "—"}°C</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatIncidentDate(plan?.expectedWarehouseArrivalAt)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <span>Warehouse/Dispatcher xác nhận inbound bằng đúng seal bàn giao</span>
          <Badge variant="outline">Chờ inbound</Badge>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => setInboundOpen(true)}>
          <PackageCheck className="h-4 w-4" /> Xác nhận inbound tại kho tuyến
        </Button>
      </StatusCard>
      <InboundRouteWarehouseDialog
        open={inboundOpen}
        incident={incident}
        onOpenChange={setInboundOpen}
      />
    </>
  );
};

const RescueOperationPanel = ({ incident, trip }: Props) => {
  const navigate = useNavigate();
  const { getAvailableLpns } = useDispatchLookup();
  const [assessOpen, setAssessOpen] = useState(false);
  const [containmentOpen, setContainmentOpen] = useState(false);
  const [continueOpen, setContinueOpen] = useState(false);
  const action = getIncidentPrimaryAction(
    incident.status,
    incident.requiresRescue,
  );
  const redispatchTripId =
    incident.externalReeferPlan?.redispatchTripId ?? incident.tripId ?? null;
  const isNoShowReturnReady =
    incident.incidentType === INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN &&
    incident.status === INCIDENT_STATUS.READY_FOR_REDISPATCH;
  const noShowLpnsQuery = getAvailableLpns(
    incident.externalReeferPlan?.destinationWarehouseId,
    isNoShowReturnReady,
  );
  if (incident.status === INCIDENT_STATUS.RESOLVED) {
    return (
      <StatusCard
        title="Incident đã đóng"
        description={incident.resolutionNote || "Không có ghi chú kết thúc."}
        icon={CheckCircle2}
      >
        <p className="text-sm">
          Hoàn tất lúc {formatIncidentDate(incident.resolvedAt)}
        </p>
      </StatusCard>
    );
  }

  if (action === "PLAN_RESCUE") {
    return <RescuePlanning incident={incident} trip={trip} />;
  }
  if (action === "TRACK_RESCUE") {
    return (
      <StatusCard
        title={
          incident.transloadConfirmedAt
            ? "Đã sang hàng"
            : "Đang theo dõi sang hàng"
        }
        description={
          incident.transloadConfirmedAt
            ? "Chuyến đã tiếp tục vận chuyển. Incident sẽ do hệ thống tự đóng sau khi hàng hoàn và accountant hoàn tiền cho tài xế."
            : "Theo dõi xe cứu hộ ở thanh tiến trình phía trên và xác nhận sang hàng khi hoàn tất bàn giao."
        }
        icon={incident.transloadConfirmedAt ? PackageCheck : Truck}
      />
    );
  }
  if (action === "TRACK_EXTERNAL_REEFER") {
    return <ExternalReeferTracking incident={incident} />;
  }

  if (action === "CREATE_REDISPATCH_TRIP") {
    const plan = incident.externalReeferPlan;
    const isNoShowReturn =
      incident.incidentType === INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN;
    const availableNoShowLpnIds = new Set(
      (noShowLpnsQuery.data ?? [])
        .filter(
          (lpn) =>
            lpn.state?.trim().toUpperCase() === "IN_STOCK" && !lpn.tripId,
        )
        .map((lpn) => lpn.lpnId),
    );
    const allNoShowLpnsAvailable = Boolean(
      plan?.lpnIds?.length &&
        plan.lpnIds.every((lpnId) => availableNoShowLpnIds.has(lpnId)),
    );
    let blocker: string | null = null;
    if (!plan?.destinationWarehouseId) {
      blocker = isNoShowReturn
        ? "Thiếu kho đang giữ hàng trong hồ sơ trả hàng."
        : "Thiếu kho đích tuyến trong externalReeferPlan.";
    } else if (!plan.lpnIds?.length) {
      blocker = isNoShowReturn
        ? "Backend chưa trả danh sách LPN của lần trả hàng."
        : "Backend chưa trả danh sách toàn bộ LPN đã inbound.";
    } else if (isNoShowReturn && noShowLpnsQuery.isLoading) {
      blocker = "Đang xác minh trạng thái LPN tại kho.";
    } else if (isNoShowReturn && noShowLpnsQuery.isError) {
      blocker = "Không tải được trạng thái LPN tại kho.";
    } else if (isNoShowReturn && !allNoShowLpnsAvailable) {
      blocker =
        "Chỉ có thể tạo chuyến khi toàn bộ LPN đang IN_STOCK, chưa có TripId và nằm cùng kho.";
    }
    return (
      <StatusCard
        title={
          isNoShowReturn
            ? "TẠO CHUYẾN GẦN KHO"
            : "TẠO LẠI CHUYẾN TỪ INCIDENT"
        }
        description={
          isNoShowReturn
            ? "Hàng khách vắng mặt đã nhập lại kho. Tạo chuyến giao mới từ đúng kho đang giữ toàn bộ LPN."
            : "Hàng đã inbound bằng seal. Tạo trip mới gấp từ đúng kho đích với toàn bộ LPN bị khóa."
        }
        icon={Siren}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">Kho xuất phát</p>
            <p className="mt-1 font-semibold">
              {plan?.destinationWarehouseName || "—"}
            </p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">LPN bắt buộc</p>
            <p className="mt-1 font-semibold">
              {plan?.lpnIds?.length ?? 0}/{plan?.lpnIds?.length ?? 0} LPN
            </p>
          </div>
        </div>
        {blocker && (
          <p className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">
            {blocker}
          </p>
        )}
        {(!isNoShowReturn || allNoShowLpnsAvailable) && (
          <Button
            type="button"
            className="w-full"
            disabled={Boolean(blocker)}
            onClick={() =>
              navigate(
                `${PATH_DISPATCHER_DASHBOARD.dispatch.root}?incidentId=${encodeURIComponent(incident.incidentId)}${isNoShowReturn ? "&source=warehouse-return" : ""}`,
              )
            }
          >
            <PackageCheck className="h-4 w-4" /> {isNoShowReturn ? "Tạo chuyến gần kho" : "Tạo lại chuyến gấp"}
          </Button>
        )}
      </StatusCard>
    );
  }

  if (action === "OPEN_REDISPATCH_TRIP") {
    return (
      <StatusCard
        title="Trip mới đã được tạo"
        description={
          incident.redispatchPlan ||
          "Đã có xe ColdChainX cho chuyến giao lại. Incident sẽ do hệ thống tự đóng khi hoàn tất các điều kiện vận hành và hoàn tiền."
        }
        icon={PackageCheck}
      >
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground">Trip redispatch</p>
          <p className="mt-1 font-semibold">
            {redispatchTripId
              ? "Đã tạo chuyến giao lại"
              : "Chưa có chuyến giao lại"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!redispatchTripId}
            onClick={() =>
              navigate(
                `${PATH_DISPATCHER_DASHBOARD.trip.root}?tripId=${encodeURIComponent(redispatchTripId ?? "")}`,
              )
            }
          >
            <ExternalLink className="h-4 w-4" /> Mở trip mới
          </Button>
        </div>
      </StatusCard>
    );
  }

  if (action === "TRACK_TRIP") {
    return (
      <StatusCard
        title="Incident vẫn đang mở"
        description={
          incident.redispatchPlan ||
          incident.handlingNote ||
          "Theo dõi phương án tiếp theo từ kho lạnh nội bộ."
        }
        icon={Clock3}
      />
    );
  }

  if (action === "EMERGENCY_PLAN") {
    const emergencyPlan: TIncidentRescuePlan = {
      incidentId: incident.incidentId,
      tripId: incident.tripId ?? "",
      targetTemperature: incident.latestTemperature ?? 0,
      temperatureThresholdBreached: Boolean(
        incident.temperatureThresholdBreached,
      ),
      directDeliveryLocked: Boolean(incident.directDeliveryLocked),
      recommendedAction: "MANUAL_ESCALATION",
      recommendationReason:
        incident.handlingNote ||
        "Chưa có phương án hệ thống hợp lệ; cập nhật quyết định khẩn cấp.",
      vehicles: [],
      internalColdStorages: [],
      requiresExternalVehicleRental: false,
      requiresManualEscalation: true,
    };
    return <RescueFallbackForm incident={incident} plan={emergencyPlan} />;
  }

  if (action === "RESOLVE") {
    return null;
  }

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
                : "Theo dõi xử lý sự cố"
        }
        description={
          action === "ASSESS_RISK"
            ? "Chọn LOW, WARNING hoặc CRITICAL và gửi đầy đủ dữ liệu đo cho backend quyết định trạng thái."
            : action === "CONFIRM_CONTAINMENT"
              ? "Không được mở cứu hộ trước khi toàn bộ hàng được bảo toàn trong điều kiện lạnh."
              : action === "CONTINUE_TRIP"
                ? incident.safeTimeCalculation ||
                  "Có thể cho chuyến tiếp tục hoặc đánh giá lại theo trạng thái thực tế."
                : incident.handlingNote || "Theo dõi cập nhật tiếp theo từ hệ thống."
        }
        icon={
          action === "CONFIRM_CONTAINMENT"
            ? ShieldCheck
            : action === "ASSESS_RISK"
              ? AlertTriangle
              : Play
        }
      >
        {incident.status === INCIDENT_STATUS.MONITORING && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Reading</p>
              <p className="mt-1 font-semibold">
                {incident.latestTemperature != null
                  ? `${incident.latestTemperature}°C`
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Nguồn / thời điểm</p>
              <p className="mt-1 font-semibold">
                {incident.temperatureSource || "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatIncidentDate(incident.temperatureMeasuredAt)}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">An toàn còn lại</p>
              <p className="mt-1 font-semibold">
                {incident.remainingSafeTimeMinutes != null
                  ? `${incident.remainingSafeTimeMinutes} phút`
                  : "—"}
              </p>
            </div>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAssessOpen(true)}
                >
                  Đánh giá lại
                </Button>
              )}
            </>
          )}
        </div>
      </StatusCard>

      <AssessRiskDialog
        open={assessOpen}
        incident={incident}
        onOpenChange={setAssessOpen}
      />
      <AssessRiskDialog
        open={containmentOpen}
        incident={incident}
        containmentOnly
        onOpenChange={setContainmentOpen}
      />
      <ContinueTripDialog
        open={continueOpen}
        incident={incident}
        onOpenChange={setContinueOpen}
      />
    </>
  );
};

export default RescueOperationPanel;
