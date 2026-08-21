import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { useDispatchPlanning } from "@/hooks/use-dispatch";
import { useIncident } from "@/hooks/use-incident";
import { Button } from "@/components/ui/button";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type {
  TDispatchDriverLookup,
  TDispatchPackingResult,
  TDispatchReadyLpn,
  TDispatchScheduleLookup,
} from "@/schemas/dispatch.schema";
import { Boxes, LockKeyhole, PackageCheck, Siren } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE } from "@/types/enums/incident-type.enum";
import DispatchScheduleSelector from "./components/dispatch-schedule-selector";
import {
  getBlockingCompatibilityConflicts,
  getDefaultPlanningWindow,
  getPackingBlockingMessages,
  isScheduleConflict,
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

const INVALID_LPN_STATE_CODE = "INVALID_LPN_STATE";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const hasInvalidLpnState = (message: string) =>
  message.toUpperCase().includes(INVALID_LPN_STATE_CODE);

const hasDriverRejection = (message: string) => {
  const normalized = message.toLocaleUpperCase("vi-VN");
  return (
    normalized.includes("TÀI XẾ") ||
    normalized.includes("TAI XE") ||
    normalized.includes("DRIVER") ||
    normalized.includes("GPLX") ||
    normalized.includes("BẰNG LÁI") ||
    normalized.includes("BANG LAI")
  );
};

const extractInvalidLpnRefs = (message: string) =>
  Array.from(message.matchAll(/\bLPN\s+([a-z0-9-]+)/gi), ([, value]) =>
    value.toUpperCase()
  );

const getDriverSelectionValidation = (
  driverIds: string[],
  availableDrivers: TDispatchDriverLookup[]
) => {
  const normalizedIds = driverIds
    .map((driverId) => driverId.trim())
    .filter(Boolean);
  const uniqueIds = Array.from(new Set(normalizedIds));
  const availableDriverIds = new Set(
    availableDrivers.map((driver) => driver.driverId)
  );
  const validIds = uniqueIds.filter(
    (driverId) =>
      UUID_PATTERN.test(driverId) &&
      driverId.toUpperCase() !== "N/A" &&
      availableDriverIds.has(driverId)
  );
  const messages: string[] = [];

  if (normalizedIds.length < 1) {
    messages.push("Chọn 1 hoặc 2 tài xế.");
  }
  if (normalizedIds.length > 2) {
    messages.push("Mỗi chuyến tối đa 2 tài xế.");
  }
  if (uniqueIds.length !== normalizedIds.length) {
    messages.push("Không được chọn trùng tài xế.");
  }
  if (
    uniqueIds.some(
      (driverId) =>
        driverId.toUpperCase() === "N/A" || !UUID_PATTERN.test(driverId)
    )
  ) {
    messages.push("Tài xế đã chọn không hợp lệ. Vui lòng chọn lại từ danh sách khả dụng.");
  }
  if (uniqueIds.some((driverId) => !availableDriverIds.has(driverId))) {
    messages.push("Một số tài xế đã chọn không còn trong danh sách khả dụng.");
  }

  return {
    valid: messages.length === 0,
    messages,
    validIds,
  };
};

const DispatchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get("incidentId")?.trim() || "";
  const incidentMode = Boolean(incidentId);
  const { manualDispatch, createTripFromWarehouse, simulatePacking } =
    useDispatchPlanning();
  const { getAllIncidents, getIncident } = useIncident();
  const {
    getSchedules,
    searchCompatibleLpns,
    getReadyLpns,
    getAvailableVehicles,
    getAvailableDrivers,
    getAvailableLpns,
  } = useDispatchLookup();
  const incidentQuery = getIncident(incidentId || undefined);
  const incidentsQuery = getAllIncidents(!incidentMode);
  const incident = incidentQuery.data;
  const externalPlan = incident?.externalReeferPlan;
  const warehouseRedispatchMode =
    incidentMode &&
    incident?.incidentType === INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN;

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
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const vehicleDriverPanelRef = useRef<HTMLDivElement | null>(null);
  const createTripSubmittingRef = useRef(false);
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
  const selectedWarehouseIds = useMemo(
    () =>
      new Set(
        selectedLpns
          .map((lpn) => lpn.warehouseId)
          .filter((warehouseId): warehouseId is string => Boolean(warehouseId)),
      ),
    [selectedLpns],
  );
  const selectedLpnsReadyForWarehouseRedispatch =
    selectedLpns.length > 0 &&
    selectedWarehouseIds.size === 1 &&
    selectedLpns.every(
      (lpn) =>
        lpn.state?.trim().toUpperCase() === "IN_STOCK" && !lpn.tripId,
    );
  const matchingNoShowIncident = useMemo(
    () =>
      !incidentMode && selectedLpnsReadyForWarehouseRedispatch
        ? (incidentsQuery.data ?? []).find(
            (candidate) =>
              candidate.incidentType ===
                INCIDENT_TYPE.CUSTOMER_NO_SHOW_RETURN &&
              candidate.status === INCIDENT_STATUS.READY_FOR_REDISPATCH &&
              Boolean(candidate.externalReeferPlan?.arrivedAt) &&
              candidate.externalReeferPlan?.destinationWarehouseId ===
                selectedWarehouseId &&
              hasExactLockedLpnSelection(
                candidate.externalReeferPlan?.lpnIds ?? [],
                selectedLpnIds,
              ),
          )
        : undefined,
    [
      incidentMode,
      incidentsQuery.data,
      selectedLpnIds,
      selectedLpnsReadyForWarehouseRedispatch,
      selectedWarehouseId,
    ],
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
      !incidentMode && selectedScheduleId && selectedLpnIds.length > 0
        ? { scheduleId: selectedScheduleId, selectedLpnIds }
        : undefined,
    [incidentMode, selectedLpnIds, selectedLpnIds.length, selectedScheduleId]
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
    !incidentMode
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
  const filterDriversByCurrentWarehouse = (
    items: TDispatchDriverLookup[] = []
  ) =>
    items.filter(
      (driver) =>
        driver.hasValidLicense === true &&
        (incidentMode ||
          !selectedWarehouseName ||
          driver.currentLocation?.trim().toLocaleLowerCase("vi-VN") ===
            selectedWarehouseName.trim().toLocaleLowerCase("vi-VN"))
    );
  const driverSelectionValidation = useMemo(
    () => getDriverSelectionValidation(selectedDriverIds, drivers),
    [drivers, selectedDriverIds]
  );
  const lpnQuery = readyLpnsQuery;
  const compatibility = selectedScheduleId ? compatibleLpnsQuery.data : undefined;
  const blockingCompatibilityConflicts = useMemo(
    () => getBlockingCompatibilityConflicts(compatibility?.conflicts ?? []),
    [compatibility?.conflicts]
  );
  const allowedScheduleConflictCount = useMemo(
    () =>
      compatibility?.conflicts.filter((conflict) => isScheduleConflict(conflict))
        .length ?? 0,
    [compatibility?.conflicts]
  );
  const lpnResult = lpnQuery.data;
  const candidateLpns = lpnResult?.items ?? [];
  const isCheckingLpnSelection =
    lpnQuery.isFetching || compatibleLpnsQuery.isFetching;
  const selectedScheduleIds = useMemo(
    () =>
      new Set(
        selectedLpns
          .map((lpn) => lpn.scheduleId)
          .filter((scheduleId): scheduleId is string => Boolean(scheduleId))
      ),
    [selectedLpns]
  );
  const hasMixedScheduleSelection = selectedScheduleIds.size > 1;
  const hasScheduleMismatchSelection =
    Boolean(selectedScheduleId) &&
    selectedLpns.some((lpn) => (lpn.scheduleId || "") !== selectedScheduleId);
  const usesFlexibleSchedule =
    !incidentMode && (hasMixedScheduleSelection || hasScheduleMismatchSelection);
  const dispatchScheduleId = usesFlexibleSchedule
    ? undefined
    : selectedScheduleId || undefined;

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
      [
        dispatchScheduleId ?? (usesFlexibleSchedule ? "flexible" : ""),
        selectedVehicleId,
        [...selectedLpnIds].sort().join(","),
      ].join("|"),
    [dispatchScheduleId, selectedLpnIds, selectedVehicleId, usesFlexibleSchedule]
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

  useEffect(() => {
    if (driversQuery.isFetching || selectedDriverIds.length === 0) return;

    if (!driverSelectionValidation.valid) {
      setSelectedDriverIds(driverSelectionValidation.validIds.slice(0, 2));
      resetPackingPreview();
    }
  }, [
    driverSelectionValidation.valid,
    driverSelectionValidation.validIds,
    driversQuery.isFetching,
    selectedDriverIds.length,
  ]);

  const resetPackingPreview = () => {
    setPackingPreview(null);
    setPackingPreviewKey(null);
    setIsPreviewOpen(false);
  };

  const refreshDispatchLookups = async () => {
    await Promise.all([
      lpnQuery.refetch(),
      compatibilityRequest ? compatibleLpnsQuery.refetch() : Promise.resolve(),
    ]);
  };

  const handleInvalidLpnState = async (message: string) => {
    const invalidRefs = new Set(extractInvalidLpnRefs(message));
    const invalidLabels =
      invalidRefs.size === 0
        ? []
        : selectedLpns
            .filter(
              (lpn) =>
                invalidRefs.has(lpn.lpnId.toUpperCase()) ||
                invalidRefs.has(lpn.lpnCode.toUpperCase())
            )
            .map((lpn) => lpn.lpnCode);

    setSelectedLpns((items) => {
      if (invalidRefs.size === 0) return [];

      const remaining = items.filter((lpn) => {
        return (
          !invalidRefs.has(lpn.lpnId.toUpperCase()) &&
          !invalidRefs.has(lpn.lpnCode.toUpperCase())
        );
      });

      return remaining.length === items.length ? [] : remaining;
    });
    setCandidatePage(1);
    resetPackingPreview();
    await refreshDispatchLookups();

    const visibleInvalidLabels =
      invalidLabels.length > 0 ? invalidLabels : Array.from(invalidRefs);
    const suffix =
      visibleInvalidLabels.length > 0
        ? `: ${visibleInvalidLabels.slice(0, 3).join(", ")}${
            visibleInvalidLabels.length > 3 ? "..." : ""
          }`
        : "";

    toast.error(
      `Một số LPN đã được ghép chuyến hoặc không còn trong kho${suffix}. Mình đã làm mới danh sách.`
    );
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
    if (!exists && isCheckingLpnSelection) return;

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
    const normalizedDriverId = driverId.trim();
    const isAvailableDriver = drivers.some(
      (driver) => driver.driverId === normalizedDriverId
    );
    if (
      !UUID_PATTERN.test(normalizedDriverId) ||
      normalizedDriverId.toUpperCase() === "N/A" ||
      !isAvailableDriver
    ) {
      toast.error("Tài xế không còn khả dụng. Mình sẽ tải lại danh sách tài xế.");
      void driversQuery.refetch();
      return;
    }

    setSelectedDriverIds((ids) => {
      if (ids.includes(normalizedDriverId)) {
        return ids.filter((id) => id !== normalizedDriverId);
      }
      if (ids.length >= 2) {
        toast.warning("Mỗi chuyến chỉ được chọn tối đa 2 tài xế.");
        return ids;
      }
      return [...ids, normalizedDriverId];
    });
  };

  const compatibilityValid =
    !isCheckingLpnSelection && blockingCompatibilityConflicts.length === 0;
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
      if (warehouseRedispatchMode && selectedLpns.length > 0) {
        if (
          selectedLpns.some(
            (lpn) =>
              lpn.state?.trim().toUpperCase() !== "IN_STOCK" ||
              Boolean(lpn.tripId),
          )
        ) {
          messages.push("Chỉ được tạo chuyến gần kho khi mọi LPN đang IN_STOCK và chưa có TripId.");
        }

        const warehouseIds = new Set(
          selectedLpns
            .map((lpn) => lpn.warehouseId)
            .filter((warehouseId): warehouseId is string => Boolean(warehouseId)),
        );
        if (
          warehouseIds.size !== 1 ||
          !warehouseIds.has(selectedWarehouseId)
        ) {
          messages.push("Toàn bộ LPN của lần trả hàng phải nằm trong cùng kho đang giữ hàng.");
        }
      }
    } else {
      if (selectedLpns.length === 0) messages.push("Chọn ít nhất 1 LPN.");
    }
    if (selectedLpns.length > 0 && !selectedWarehouseId) {
      messages.push("LPN đã chọn chưa có thông tin kho xuất phát.");
    }
    if (!incidentMode && isCheckingLpnSelection && selectedLpns.length > 0) {
      messages.push("Đang kiểm tra tính tương thích của tập LPN.");
    }
    if (!incidentMode && blockingCompatibilityConflicts.length > 0) {
      messages.push(
        ...blockingCompatibilityConflicts.map(
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
    if (selectedWarehouseId && driversQuery.isFetching && selectedDriverIds.length > 0) {
      messages.push("Đang kiểm tra danh sách tài xế khả dụng.");
    }
    if (!selectedVehicleId) messages.push("Chọn 1 xe để ghép chuyến.");
    messages.push(...driverSelectionValidation.messages);
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
    isCheckingLpnSelection,
    blockingCompatibilityConflicts,
    hasCurrentPreview,
    packingPreview,
    plannedEndTime,
    plannedStartTime,
    selectedDriverIds.length,
    driverSelectionValidation.messages,
    selectedLpns.length,
    selectedLpnIds,
    selectedVehicleId,
    selectedWarehouseId,
    driversQuery.isError,
    driversQuery.isFetching,
    incident,
    incidentLpnsQuery.isError,
    incidentLpnsQuery.isLoading,
    incidentMode,
    incidentQuery.isError,
    warehouseRedispatchMode,
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
        ...(dispatchScheduleId ? { scheduleId: dispatchScheduleId } : {}),
        vehicleId: selectedVehicleId,
        lpnIds: selectedLpnIds,
      });
      setPackingPreview(result);
      setPackingPreviewKey(selectionKey);
    } catch (error: any) {
      setIsPreviewOpen(false);
      const message = getErrorMessage(error, "Không tạo được mô phỏng 3D.");
      if (hasInvalidLpnState(message)) {
        await handleInvalidLpnState(message);
        return;
      }

      toast.error(message);
    }
  };

  const handleCreateTrip = async () => {
    if (!canCreateTrip || createTripSubmittingRef.current) return;

    createTripSubmittingRef.current = true;
    setIsCreatingTrip(true);
    try {
      const latestDriversResult = await driversQuery.refetch();
      if (latestDriversResult.isError) {
        toast.error("Không kiểm tra được tài xế khả dụng. Vui lòng thử lại.");
        return;
      }

      const latestAvailableDrivers = filterDriversByCurrentWarehouse(
        latestDriversResult.data ?? []
      );
      const latestDriverValidation = getDriverSelectionValidation(
        selectedDriverIds,
        latestAvailableDrivers
      );
      if (!latestDriverValidation.valid) {
        setSelectedDriverIds(latestDriverValidation.validIds.slice(0, 2));
        resetPackingPreview();
        toast.error(latestDriverValidation.messages[0]);
        return;
      }

      if (!incidentMode) {
        const latestPreview = await simulatePacking.mutateAsync({
          ...(dispatchScheduleId ? { scheduleId: dispatchScheduleId } : {}),
          vehicleId: selectedVehicleId,
          lpnIds: selectedLpnIds,
        });
        setPackingPreview(latestPreview);
        setPackingPreviewKey(selectionKey);

        if (
          latestPreview.blockingReasons.some(hasInvalidLpnState) ||
          !latestPreview.canCreateTrip ||
          latestPreview.unplacedLpnIds.length > 0
        ) {
          if (latestPreview.blockingReasons.some(hasInvalidLpnState)) {
            await handleInvalidLpnState(latestPreview.blockingReasons.join("; "));
            return;
          }

          const messages = getPackingBlockingMessages(latestPreview);
          toast.error(
            messages[0] ||
              "Lựa chọn hiện tại chưa đáp ứng điều kiện tạo chuyến. Vui lòng kiểm tra lại LPN và xe."
          );
          return;
        }
      }

      const request = {
        lpnIds: selectedLpnIds,
        vehicleId: selectedVehicleId,
        driverIds: latestDriverValidation.validIds,
        plannedStartTime: new Date(plannedStartTime).toISOString(),
        plannedEndTime: new Date(plannedEndTime).toISOString(),
      };

      const result = warehouseRedispatchMode
        ? await createTripFromWarehouse.mutateAsync(request)
        : await manualDispatch.mutateAsync({
            incidentId: incidentMode ? incidentId : undefined,
            ...(dispatchScheduleId ? { scheduleId: dispatchScheduleId } : {}),
            ...request,
          });

      toast.success(
        warehouseRedispatchMode
          ? "Tạo chuyến mới từ kho thành công"
          : "Đã tạo chuyến thành công",
      );
      if (incidentMode) {
        navigate(`${PATH_DISPATCHER_DASHBOARD.trip.root}?tripId=${encodeURIComponent(result.tripId)}`);
        return;
      }
      setSelectedLpns([]);
      setSelectedVehicleId("");
      setSelectedDriverIds([]);
      setCandidatePage(1);
      resetPackingPreview();
      void refreshDispatchLookups().catch(() => {
        toast.warning("Đã tạo chuyến nhưng chưa làm mới được danh sách LPN.");
      });
    } catch (error: any) {
      const message = getErrorMessage(error, "Không tạo được chuyến.");
      if (hasInvalidLpnState(message)) {
        await handleInvalidLpnState(message);
        return;
      }
      if (hasDriverRejection(message)) {
        const refreshedDrivers = await driversQuery.refetch();
        const refreshedAvailableDrivers = filterDriversByCurrentWarehouse(
          refreshedDrivers.data ?? []
        );
        setSelectedDriverIds(
          getDriverSelectionValidation(
            selectedDriverIds,
            refreshedAvailableDrivers
          ).validIds.slice(0, 2)
        );
        toast.error(message);
        return;
      }

      toast.error(message);
    } finally {
      createTripSubmittingRef.current = false;
      setIsCreatingTrip(false);
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
            {warehouseRedispatchMode
              ? "Tạo chuyến gần kho"
              : incidentMode
                ? "Tạo lại chuyến từ Incident"
                : "Điều phối & Ghép chuyến"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {incidentMode
              ? warehouseRedispatchMode
                ? "Chọn xe và 1-2 tài xế tại kho đang giữ hàng; toàn bộ LPN của lần trả hàng đã được khóa."
                : "Chọn xe và 1-2 tài xế tại đúng kho inbound; toàn bộ LPN đã được khóa."
              : "Chọn LPN, xe, tài xế và thời gian vận hành trước khi tạo chuyến"}
          </p>
        </div>
      </div>

      {incidentMode && (
        <div className="flex flex-col gap-3 rounded-lg border border-violet-300 bg-violet-50 p-4 text-violet-900 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold"><Siren className="h-5 w-5" /> {warehouseRedispatchMode ? "TẠO CHUYẾN GẦN KHO" : "TẠO LẠI CHUYẾN TỪ INCIDENT"}</p>
            <p className="mt-1 text-sm">Kho xuất phát đã khóa: {selectedWarehouseName || "Chưa cấu hình"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4" /> Đã chọn {selectedLpnIds.length}/{requiredIncidentLpnIds.length} LPN</div>
        </div>
      )}

      {!incidentMode && matchingNoShowIncident && (
        <div className="flex flex-col gap-3 rounded-lg border border-violet-300 bg-violet-50 p-4 text-violet-900 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold">
              <Siren className="h-5 w-5" /> NHÓM LPN KHÁCH VẮNG MẶT ĐÃ NHẬP KHO
            </p>
            <p className="mt-1 text-sm">
              Đã nhận diện đủ {selectedLpnIds.length} LPN cùng kho. Mở chế độ
              khóa kho và LPN để tạo chuyến giao lại.
            </p>
          </div>
          <Button
            type="button"
            onClick={() =>
              navigate(
                `${PATH_DISPATCHER_DASHBOARD.dispatch.root}?incidentId=${encodeURIComponent(matchingNoShowIncident.incidentId)}&source=warehouse-return`,
              )
            }
          >
            <PackageCheck className="h-4 w-4" /> Tạo chuyến gần kho
          </Button>
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
          schedules={schedules}
          allowsMixedSchedules={usesFlexibleSchedule || allowedScheduleConflictCount > 0}
          isLoading={
            incidentMode ? incidentLpnsQuery.isLoading : lpnQuery.isLoading
          }
          isChecking={
            incidentMode ? incidentLpnsQuery.isFetching : isCheckingLpnSelection
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
            isSubmitting={
              manualDispatch.isPending ||
              createTripFromWarehouse.isPending ||
              isCreatingTrip
            }
            isPreviewing={simulatePacking.isPending}
            isPlanningEnabled={selectedLpnIds.length > 0}
            canPreviewPacking={canPreviewPacking}
            hasCurrentPreview={hasCurrentPreview}
            canCreateTrip={canCreateTrip}
            validationMessages={validationMessages}
            showPackingPreview={!incidentMode}
            createButtonLabel={
              warehouseRedispatchMode
                ? "Tạo chuyến gần kho"
                : incidentMode
                  ? "Tạo trip redispatch gấp"
                  : undefined
            }
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
