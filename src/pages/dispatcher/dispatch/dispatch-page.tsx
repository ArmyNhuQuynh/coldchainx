import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { useDispatchPlanning } from "@/hooks/use-dispatch";
import { useIncident } from "@/hooks/use-incident";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type {
  TDispatchPackingResult,
  TDispatchReadyLpn,
  TDispatchScheduleLookup,
} from "@/schemas/dispatch.schema";
import { Boxes, LockKeyhole, Siren } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import DispatchScheduleSelector from "./components/dispatch-schedule-selector";
import {
  getDefaultPlanningWindow,
  getPackingBlockingMessages,
} from "./components/dispatch-helpers";
import LpnSelectionPanel from "./components/lpn-selection-panel";
import PackingPreviewDialog from "./components/packing-preview-dialog";
import VehicleDriverPanel from "./components/vehicle-driver-panel";
import { hasExactLockedLpnSelection } from "../incidents/detail/incident-workflow";

const COMPATIBLE_LPN_PAGE_SIZE = 20;
const planningWindow = getDefaultPlanningWindow();

const toLocalDateTimeInput = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const getSchedulePlanningWindow = (schedule: TDispatchScheduleLookup) => {
  const date = schedule.departureDate.slice(0, 10);
  const time = schedule.departureTime.slice(0, 5);
  const startDate = new Date(`${date}T${time}`);

  if (Number.isNaN(startDate.getTime())) return getDefaultPlanningWindow();

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 8);

  return {
    start: toLocalDateTimeInput(startDate),
    end: toLocalDateTimeInput(endDate),
  };
};

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.Message ||
  error?.response?.data?.error ||
  error?.response?.data?.Error ||
  error?.message ||
  fallback;

const DispatchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get("incidentId")?.trim() || "";
  const incidentMode = Boolean(incidentId);
  const { manualDispatch, simulatePacking } = useDispatchPlanning();
  const { getIncident } = useIncident();
  const {
    getSchedules,
    searchCompatibleLpns,
    getReadyLpns,
    getAvailableVehicles,
    getAvailableDrivers,
    getAvailableLpns,
  } = useDispatchLookup();
  const incidentQuery = getIncident(incidentId || undefined);
  const incident = incidentQuery.data;
  const externalPlan = incident?.externalReeferPlan;

  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [selectedLpns, setSelectedLpns] = useState<TDispatchReadyLpn[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [plannedStartTime, setPlannedStartTime] = useState(planningWindow.start);
  const [plannedEndTime, setPlannedEndTime] = useState(planningWindow.end);
  const [candidatePage, setCandidatePage] = useState(1);
  const [packingPreview, setPackingPreview] =
    useState<TDispatchPackingResult | null>(null);
  const [packingPreviewKey, setPackingPreviewKey] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const vehicleDriverPanelRef = useRef<HTMLDivElement | null>(null);
  const [vehicleDriverPanelHeight, setVehicleDriverPanelHeight] = useState<
    number | null
  >(null);

  const selectedWarehouseId = incidentMode
    ? externalPlan?.destinationWarehouseId ?? ""
    : selectedLpns[0]?.warehouseId ?? "";
  const selectedWarehouseName = incidentMode
    ? externalPlan?.destinationWarehouseName ?? ""
    : selectedLpns[0]?.warehouseName ?? "";

  const schedulesQuery = getSchedules(!incidentMode);
  const vehiclesQuery = getAvailableVehicles(selectedWarehouseId);
  const driversQuery = getAvailableDrivers(selectedWarehouseId);
  const incidentLpnsQuery = getAvailableLpns(selectedWarehouseId, incidentMode);

  const requiredIncidentLpnIds = useMemo(
    () => externalPlan?.lpnIds ?? [],
    [externalPlan?.lpnIds]
  );
  const requiredIncidentLpnSet = useMemo(
    () => new Set(requiredIncidentLpnIds),
    [requiredIncidentLpnIds]
  );
  const incidentRequiredLpns = useMemo(
    () =>
      (incidentLpnsQuery.data ?? [])
        .filter((lpn) => requiredIncidentLpnSet.has(lpn.lpnId))
        .map((lpn) => ({
          ...lpn,
          warehouseId: selectedWarehouseId,
          warehouseName: selectedWarehouseName,
        })),
    [
      incidentLpnsQuery.data,
      requiredIncidentLpnSet,
      selectedWarehouseId,
      selectedWarehouseName,
    ]
  );

  const selectedLpnIds = useMemo(
    () => selectedLpns.map((lpn) => lpn.lpnId),
    [selectedLpns]
  );
  const selectedCargoTotals = useMemo(
    () =>
      selectedLpns.reduce(
        (totals, lpn) => ({
          weightKg: totals.weightKg + lpn.actualWeightKg,
          cbm: totals.cbm + lpn.actualCbm,
        }),
        { weightKg: 0, cbm: 0 }
      ),
    [selectedLpns]
  );
  const compatibilityRequest = useMemo(
    () =>
      !incidentMode && selectedScheduleId
        ? { scheduleId: selectedScheduleId, selectedLpnIds }
        : undefined,
    [incidentMode, selectedLpnIds, selectedScheduleId]
  );
  const compatibleLpnsQuery = searchCompatibleLpns(compatibilityRequest, {
    pageNumber: candidatePage,
    pageSize: COMPATIBLE_LPN_PAGE_SIZE,
  });
  const readyLpnsQuery = getReadyLpns(
    {
      pageNumber: candidatePage,
      pageSize: COMPATIBLE_LPN_PAGE_SIZE,
      warehouseId: selectedWarehouseId || undefined,
    },
    !incidentMode && !selectedScheduleId
  );

  const schedules = schedulesQuery.data ?? [];
  const vehicles = useMemo(
    () =>
      (vehiclesQuery.data ?? []).filter(
        (vehicle) =>
          (incidentMode ||
            !selectedWarehouseName ||
            vehicle.currentLocation?.trim().toLocaleLowerCase("vi-VN") ===
              selectedWarehouseName.trim().toLocaleLowerCase("vi-VN")) &&
          vehicle.maxWeight >= selectedCargoTotals.weightKg &&
          vehicle.maxCbm >= selectedCargoTotals.cbm
      ),
    [
      incidentMode,
      selectedCargoTotals,
      selectedWarehouseName,
      vehiclesQuery.data,
    ]
  );
  const drivers = useMemo(
    () =>
      (driversQuery.data ?? []).filter(
        (driver) =>
          driver.hasValidLicense === true &&
          (incidentMode ||
            !selectedWarehouseName ||
            driver.currentLocation?.trim().toLocaleLowerCase("vi-VN") ===
              selectedWarehouseName.trim().toLocaleLowerCase("vi-VN"))
      ),
    [driversQuery.data, incidentMode, selectedWarehouseName]
  );
  const lpnQuery = selectedScheduleId ? compatibleLpnsQuery : readyLpnsQuery;
  const compatibility = selectedScheduleId ? compatibleLpnsQuery.data : undefined;
  const lpnResult = lpnQuery.data;
  const candidateLpns = lpnResult?.items ?? [];

  const displayedLpns = useMemo(() => {
    const selectedIds = new Set(selectedLpnIds);
    if (incidentMode) return incidentRequiredLpns;
    return [
      ...selectedLpns,
      ...candidateLpns.filter((lpn) => !selectedIds.has(lpn.lpnId)),
    ];
  }, [candidateLpns, incidentMode, incidentRequiredLpns, selectedLpnIds, selectedLpns]);

  useEffect(() => {
    if (!incidentMode || incidentLpnsQuery.isLoading) return;
    setSelectedLpns(incidentRequiredLpns);
  }, [incidentLpnsQuery.isLoading, incidentMode, incidentRequiredLpns]);

  const selectionKey = useMemo(
    () =>
      [selectedScheduleId, selectedVehicleId, [...selectedLpnIds].sort().join(",")].join(
        "|"
      ),
    [selectedLpnIds, selectedScheduleId, selectedVehicleId]
  );
  const hasCurrentPreview =
    Boolean(packingPreview) && packingPreviewKey === selectionKey;

  useEffect(() => {
    const element = vehicleDriverPanelRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      setVehicleDriverPanelHeight(Math.ceil(entry.contentRect.height));
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const totalPages = lpnResult?.totalPages ?? 0;
    if (totalPages > 0 && candidatePage > totalPages) {
      setCandidatePage(totalPages);
    }
  }, [candidatePage, lpnResult?.totalPages]);

  useEffect(() => {
    setSelectedVehicleId("");
    setSelectedDriverIds([]);
    setPackingPreview(null);
    setPackingPreviewKey(null);
    setIsPreviewOpen(false);
  }, [selectedWarehouseId]);

  useEffect(() => {
    if (!selectedVehicleId || vehiclesQuery.isFetching) return;
    if (vehicles.some((vehicle) => vehicle.vehicleId === selectedVehicleId)) {
      return;
    }

    setSelectedVehicleId("");
    setPackingPreview(null);
    setPackingPreviewKey(null);
    setIsPreviewOpen(false);
  }, [selectedVehicleId, vehicles, vehiclesQuery.isFetching]);

  const resetPackingPreview = () => {
    setPackingPreview(null);
    setPackingPreviewKey(null);
    setIsPreviewOpen(false);
  };

  const handleScheduleChange = (scheduleId: string) => {
    const schedule = schedules.find((item) => item.scheduleId === scheduleId);
    setSelectedScheduleId(scheduleId);
    setSelectedLpns([]);
    setSelectedVehicleId("");
    setSelectedDriverIds([]);
    setCandidatePage(1);
    resetPackingPreview();

    if (schedule) {
      const window = getSchedulePlanningWindow(schedule);
      setPlannedStartTime(window.start);
      setPlannedEndTime(window.end);
    }
  };

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    handleScheduleChange("");
  };

  const handleToggleLpn = (lpn: TDispatchReadyLpn) => {
    if (incidentMode) return;
    const exists = selectedLpnIds.includes(lpn.lpnId);
    if (!exists && lpnQuery.isFetching) return;

    setSelectedLpns((items) =>
      exists
        ? items.filter((item) => item.lpnId !== lpn.lpnId)
        : [...items, lpn]
    );
    setCandidatePage(1);
    resetPackingPreview();
  };

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    resetPackingPreview();
  };

  const handleDriverToggle = (driverId: string) => {
    setSelectedDriverIds((ids) => {
      if (ids.includes(driverId)) return ids.filter((id) => id !== driverId);
      if (ids.length >= 2) {
        toast.warning("Mỗi chuyến chỉ được chọn tối đa 2 tài xế.");
        return ids;
      }
      return [...ids, driverId];
    });
  };

  const compatibilityValid =
    !lpnQuery.isFetching &&
    (!selectedScheduleId || compatibility?.selectedSetValid === true);
  const canPreviewPacking =
    !incidentMode &&
    compatibilityValid &&
    selectedLpnIds.length > 0 &&
    Boolean(selectedWarehouseId) &&
    Boolean(selectedVehicleId);

  const validationMessages = useMemo(() => {
    const messages: string[] = [];
    const start = new Date(plannedStartTime);
    const end = new Date(plannedEndTime);

    if (incidentMode) {
      if (incidentQuery.isError) messages.push("Không tải được Incident cần tạo lại chuyến.");
      if (incident && incident.status !== INCIDENT_STATUS.READY_FOR_REDISPATCH) {
        messages.push("Incident chỉ được tạo trip mới tại READY_FOR_REDISPATCH.");
      }
      if (!selectedWarehouseId) messages.push("Incident thiếu kho đích tuyến.");
      if (requiredIncidentLpnIds.length === 0) messages.push("Incident chưa có danh sách LPN bắt buộc.");
      if (incidentLpnsQuery.isLoading) messages.push("Đang tải toàn bộ LPN đã inbound.");
      if (incidentLpnsQuery.isError) messages.push("Không tải được LPN tại kho đích tuyến.");
      if (!hasExactLockedLpnSelection(requiredIncidentLpnIds, selectedLpnIds)) {
        messages.push(`Phải chọn đủ ${requiredIncidentLpnIds.length}/${requiredIncidentLpnIds.length} LPN của Incident.`);
      }
    } else {
      if (selectedLpns.length === 0) messages.push("Chọn ít nhất 1 LPN.");
    }
    if (selectedLpns.length > 0 && !selectedWarehouseId) {
      messages.push("LPN đã chọn chưa có thông tin kho xuất phát.");
    }
    if (!incidentMode && lpnQuery.isFetching && selectedLpns.length > 0) {
      messages.push("Đang kiểm tra tính tương thích của tập LPN.");
    }
    if (!incidentMode && compatibility && !compatibility.selectedSetValid) {
      messages.push(
        ...compatibility.conflicts.map(
          (conflict) => conflict.message || "Tập LPN đang chọn không tương thích."
        )
      );
    }
    if (!incidentMode && lpnQuery.isError) {
      messages.push("Không tải được danh sách LPN sẵn sàng từ BE.");
    }
    if (selectedWarehouseId && vehiclesQuery.isError) {
      messages.push("Không tải được xe tại kho xuất phát.");
    }
    if (selectedWarehouseId && driversQuery.isError) {
      messages.push("Không tải được tài xế tại kho xuất phát.");
    }
    if (!selectedVehicleId) messages.push("Chọn 1 xe để ghép chuyến.");
    if (selectedDriverIds.length < 1) messages.push("Chọn 1 hoặc 2 tài xế.");
    if (selectedDriverIds.length > 2) messages.push("Mỗi chuyến tối đa 2 tài xế.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      messages.push("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
    }
    if (
      !incidentMode &&
      selectedLpns.length > 0 &&
      selectedVehicleId &&
      !hasCurrentPreview
    ) {
      messages.push("Xem mô phỏng 3D cho lựa chọn hiện tại trước khi tạo chuyến.");
    }
    if (hasCurrentPreview && packingPreview && !packingPreview.canCreateTrip) {
      messages.push(...getPackingBlockingMessages(packingPreview));
    }

    return [...new Set(messages)];
  }, [
    lpnQuery.isError,
    lpnQuery.isFetching,
    compatibility,
    hasCurrentPreview,
    packingPreview,
    plannedEndTime,
    plannedStartTime,
    selectedDriverIds.length,
    selectedLpns.length,
    selectedLpnIds,
    selectedScheduleId,
    selectedVehicleId,
    selectedWarehouseId,
    driversQuery.isError,
    incident,
    incidentLpnsQuery.isError,
    incidentLpnsQuery.isLoading,
    incidentMode,
    incidentQuery.isError,
    requiredIncidentLpnIds.length,
    requiredIncidentLpnSet,
    vehiclesQuery.isError,
  ]);

  const canCreateTrip = incidentMode
    ? validationMessages.length === 0
    : validationMessages.length === 0 &&
      hasCurrentPreview &&
      packingPreview?.canCreateTrip === true &&
      packingPreview.unplacedLpnIds.length === 0;

  const handlePreviewPacking = async () => {
    if (incidentMode || !canPreviewPacking) return;

    setIsPreviewOpen(true);
    setPackingPreview(null);
    setPackingPreviewKey(null);

    try {
      const result = await simulatePacking.mutateAsync({
        ...(selectedScheduleId ? { scheduleId: selectedScheduleId } : {}),
        vehicleId: selectedVehicleId,
        lpnIds: selectedLpnIds,
      });
      setPackingPreview(result);
      setPackingPreviewKey(selectionKey);
    } catch (error: any) {
      setIsPreviewOpen(false);
      toast.error(getErrorMessage(error, "Không tạo được mô phỏng 3D."));
    }
  };

  const handleCreateTrip = async () => {
    if (!canCreateTrip) return;

    try {
      const result = await manualDispatch.mutateAsync({
        incidentId: incidentMode ? incidentId : undefined,
        ...(selectedScheduleId ? { scheduleId: selectedScheduleId } : {}),
        lpnIds: selectedLpnIds,
        vehicleId: selectedVehicleId,
        driverIds: selectedDriverIds,
        plannedStartTime: new Date(plannedStartTime).toISOString(),
        plannedEndTime: new Date(plannedEndTime).toISOString(),
      });

      toast.success(`Đã tạo chuyến ${result.tripId}`);
      if (incidentMode) {
        navigate(`${PATH_DISPATCHER_DASHBOARD.trip.root}?tripId=${encodeURIComponent(result.tripId)}`);
        return;
      }
      setSelectedLpns([]);
      setSelectedVehicleId("");
      setSelectedDriverIds([]);
      setCandidatePage(1);
      resetPackingPreview();
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Không tạo được chuyến."));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            {incidentMode ? "Tạo lại chuyến từ Incident" : "Điều phối & Ghép chuyến"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {incidentMode
              ? "Chọn xe và 1-2 tài xế tại đúng kho inbound; toàn bộ LPN đã được khóa."
              : "Chọn LPN, xe, tài xế và thời gian vận hành trước khi tạo chuyến"}
          </p>
        </div>
      </div>

      {incidentMode && (
        <div className="flex flex-col gap-3 rounded-lg border border-violet-300 bg-violet-50 p-4 text-violet-900 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold"><Siren className="h-5 w-5" /> TẠO LẠI CHUYẾN TỪ INCIDENT</p>
            <p className="mt-1 text-sm">Kho xuất phát: {selectedWarehouseName || "Chưa cấu hình"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4" /> Đã chọn {selectedLpnIds.length}/{requiredIncidentLpnIds.length} LPN</div>
        </div>
      )}

      {!incidentMode && <DispatchScheduleSelector
        schedules={schedules}
        selectedRouteId={selectedRouteId}
        selectedScheduleId={selectedScheduleId}
        isLoading={schedulesQuery.isLoading}
        isError={schedulesQuery.isError}
        onRouteChange={handleRouteChange}
        onScheduleChange={handleScheduleChange}
        onRetry={() => schedulesQuery.refetch()}
      />}

      <div className="grid min-h-0 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)]">
        <LpnSelectionPanel
          lpns={displayedLpns}
          selectedIds={selectedLpnIds}
          totalRecords={
            incidentMode
              ? requiredIncidentLpnIds.length
              : lpnResult?.totalRecords ?? 0
          }
          currentPage={lpnResult?.currentPage ?? candidatePage}
          totalPages={lpnResult?.totalPages ?? 0}
          hasSchedule={incidentMode || Boolean(selectedScheduleId)}
          isLoading={
            incidentMode ? incidentLpnsQuery.isLoading : lpnQuery.isLoading
          }
          isChecking={
            incidentMode ? incidentLpnsQuery.isFetching : lpnQuery.isFetching
          }
          locked={incidentMode}
          panelHeight={vehicleDriverPanelHeight}
          onToggle={handleToggleLpn}
          onPageChange={setCandidatePage}
        />

        <div ref={vehicleDriverPanelRef}>
          <VehicleDriverPanel
            vehicles={vehicles}
            drivers={drivers}
            warehouseName={selectedWarehouseName}
            hasWarehouse={Boolean(selectedWarehouseId)}
            selectedVehicleId={selectedVehicleId}
            selectedDriverIds={selectedDriverIds}
            plannedStartTime={plannedStartTime}
            plannedEndTime={plannedEndTime}
            isLoadingVehicles={vehiclesQuery.isLoading}
            isLoadingDrivers={driversQuery.isLoading}
            isVehiclesError={vehiclesQuery.isError}
            isDriversError={driversQuery.isError}
            isSubmitting={manualDispatch.isPending}
            isPreviewing={simulatePacking.isPending}
            isPlanningEnabled={selectedLpnIds.length > 0}
            canPreviewPacking={canPreviewPacking}
            hasCurrentPreview={hasCurrentPreview}
            canCreateTrip={canCreateTrip}
            validationMessages={validationMessages}
            showPackingPreview={!incidentMode}
            createButtonLabel={incidentMode ? "Tạo trip redispatch gấp" : undefined}
            onVehicleChange={handleVehicleChange}
            onDriverToggle={handleDriverToggle}
            onPlannedStartTimeChange={setPlannedStartTime}
            onPlannedEndTimeChange={setPlannedEndTime}
            onPreviewPacking={handlePreviewPacking}
            onCreateTrip={handleCreateTrip}
            onRetryVehicles={() => vehiclesQuery.refetch()}
            onRetryDrivers={() => driversQuery.refetch()}
          />
        </div>
      </div>

      <PackingPreviewDialog
        open={isPreviewOpen}
        preview={packingPreview}
        isLoading={simulatePacking.isPending}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
};

export default DispatchPage;
