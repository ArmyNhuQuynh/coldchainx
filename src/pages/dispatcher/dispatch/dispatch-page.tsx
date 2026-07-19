import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { useDispatchPlanning } from "@/hooks/use-dispatch";
import type {
  TDispatchPackingResult,
  TDispatchReadyLpn,
  TDispatchScheduleLookup,
} from "@/schemas/dispatch.schema";
import { Boxes } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import DispatchScheduleSelector from "./components/dispatch-schedule-selector";
import {
  getDefaultPlanningWindow,
  getPackingBlockingMessages,
} from "./components/dispatch-helpers";
import LpnSelectionPanel from "./components/lpn-selection-panel";
import PackingPreviewDialog from "./components/packing-preview-dialog";
import VehicleDriverPanel from "./components/vehicle-driver-panel";

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
  const { manualDispatch, simulatePacking } = useDispatchPlanning();
  const {
    getSchedules,
    searchCompatibleLpns,
    getAvailableVehicles,
    getAvailableDrivers,
  } = useDispatchLookup();

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

  const schedulesQuery = getSchedules();
  const vehiclesQuery = getAvailableVehicles();
  const driversQuery = getAvailableDrivers();

  const selectedLpnIds = useMemo(
    () => selectedLpns.map((lpn) => lpn.lpnId),
    [selectedLpns]
  );
  const compatibilityRequest = useMemo(
    () =>
      selectedScheduleId
        ? { scheduleId: selectedScheduleId, selectedLpnIds }
        : undefined,
    [selectedLpnIds, selectedScheduleId]
  );
  const compatibleLpnsQuery = searchCompatibleLpns(compatibilityRequest, {
    pageNumber: candidatePage,
    pageSize: COMPATIBLE_LPN_PAGE_SIZE,
  });

  const schedules = schedulesQuery.data ?? [];
  const vehicles = vehiclesQuery.data ?? [];
  const drivers = driversQuery.data ?? [];
  const compatibility = compatibleLpnsQuery.data;
  const candidateLpns = compatibility?.items ?? [];

  const displayedLpns = useMemo(() => {
    const selectedIds = new Set(selectedLpnIds);
    return [
      ...selectedLpns,
      ...candidateLpns.filter((lpn) => !selectedIds.has(lpn.lpnId)),
    ];
  }, [candidateLpns, selectedLpnIds, selectedLpns]);

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
    const totalPages = compatibility?.totalPages ?? 0;
    if (totalPages > 0 && candidatePage > totalPages) {
      setCandidatePage(totalPages);
    }
  }, [candidatePage, compatibility?.totalPages]);

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

  const handleToggleLpn = (lpn: TDispatchReadyLpn) => {
    const exists = selectedLpnIds.includes(lpn.lpnId);
    if (!exists && compatibleLpnsQuery.isFetching) return;

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
    Boolean(selectedScheduleId) &&
    !compatibleLpnsQuery.isFetching &&
    compatibility?.selectedSetValid === true;
  const canPreviewPacking =
    compatibilityValid &&
    selectedLpnIds.length > 0 &&
    Boolean(selectedVehicleId);

  const validationMessages = useMemo(() => {
    const messages: string[] = [];
    const start = new Date(plannedStartTime);
    const end = new Date(plannedEndTime);

    if (!selectedScheduleId) messages.push("Chọn lịch vận chuyển trước.");
    if (selectedScheduleId && selectedLpns.length === 0) {
      messages.push("Chọn ít nhất 1 LPN.");
    }
    if (compatibleLpnsQuery.isFetching && selectedLpns.length > 0) {
      messages.push("Đang kiểm tra tính tương thích của tập LPN.");
    }
    if (compatibility && !compatibility.selectedSetValid) {
      messages.push(
        ...compatibility.conflicts.map(
          (conflict) => conflict.message || "Tập LPN đang chọn không tương thích."
        )
      );
    }
    if (compatibleLpnsQuery.isError) {
      messages.push("Không tải được danh sách LPN tương thích từ BE.");
    }
    if (!selectedVehicleId) messages.push("Chọn 1 xe để ghép chuyến.");
    if (selectedDriverIds.length < 1) messages.push("Chọn 1 hoặc 2 tài xế.");
    if (selectedDriverIds.length > 2) messages.push("Mỗi chuyến tối đa 2 tài xế.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      messages.push("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
    }
    if (
      selectedScheduleId &&
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
    compatibleLpnsQuery.isError,
    compatibleLpnsQuery.isFetching,
    compatibility,
    hasCurrentPreview,
    packingPreview,
    plannedEndTime,
    plannedStartTime,
    selectedDriverIds.length,
    selectedLpns.length,
    selectedScheduleId,
    selectedVehicleId,
  ]);

  const canCreateTrip =
    validationMessages.length === 0 &&
    hasCurrentPreview &&
    packingPreview?.canCreateTrip === true &&
    packingPreview.unplacedLpnIds.length === 0;

  const handlePreviewPacking = async () => {
    if (!canPreviewPacking) return;

    setIsPreviewOpen(true);
    setPackingPreview(null);
    setPackingPreviewKey(null);

    try {
      const result = await simulatePacking.mutateAsync({
        scheduleId: selectedScheduleId,
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
        scheduleId: selectedScheduleId,
        lpnIds: selectedLpnIds,
        vehicleId: selectedVehicleId,
        driverIds: selectedDriverIds,
        plannedStartTime: new Date(plannedStartTime).toISOString(),
        plannedEndTime: new Date(plannedEndTime).toISOString(),
      });

      toast.success(`Đã tạo chuyến ${result.tripId}`);
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
          <h1 className="text-3xl font-semibold">Điều phối & Ghép chuyến</h1>
          <p className="mt-1 text-muted-foreground">
            Chọn lịch, ghép LPN tương thích và kiểm tra xếp hàng trước khi tạo chuyến
          </p>
        </div>
      </div>

      <DispatchScheduleSelector
        schedules={schedules}
        selectedScheduleId={selectedScheduleId}
        isLoading={schedulesQuery.isLoading}
        isError={schedulesQuery.isError}
        onScheduleChange={handleScheduleChange}
        onRetry={() => schedulesQuery.refetch()}
      />

      <div className="grid min-h-0 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)]">
        <LpnSelectionPanel
          lpns={displayedLpns}
          selectedIds={selectedLpnIds}
          totalRecords={compatibility?.totalRecords ?? 0}
          currentPage={compatibility?.currentPage ?? candidatePage}
          totalPages={compatibility?.totalPages ?? 0}
          hasSchedule={Boolean(selectedScheduleId)}
          isLoading={compatibleLpnsQuery.isLoading}
          isChecking={compatibleLpnsQuery.isFetching}
          panelHeight={vehicleDriverPanelHeight}
          onToggle={handleToggleLpn}
          onPageChange={setCandidatePage}
        />

        <div ref={vehicleDriverPanelRef}>
          <VehicleDriverPanel
            vehicles={vehicles}
            drivers={drivers}
            selectedVehicleId={selectedVehicleId}
            selectedDriverIds={selectedDriverIds}
            plannedStartTime={plannedStartTime}
            plannedEndTime={plannedEndTime}
            isLoadingVehicles={vehiclesQuery.isLoading}
            isLoadingDrivers={driversQuery.isLoading}
            isSubmitting={manualDispatch.isPending}
            isPreviewing={simulatePacking.isPending}
            isPlanningEnabled={Boolean(selectedScheduleId)}
            canPreviewPacking={canPreviewPacking}
            hasCurrentPreview={hasCurrentPreview}
            canCreateTrip={canCreateTrip}
            validationMessages={validationMessages}
            onVehicleChange={handleVehicleChange}
            onDriverToggle={handleDriverToggle}
            onPlannedStartTimeChange={setPlannedStartTime}
            onPlannedEndTimeChange={setPlannedEndTime}
            onPreviewPacking={handlePreviewPacking}
            onCreateTrip={handleCreateTrip}
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
