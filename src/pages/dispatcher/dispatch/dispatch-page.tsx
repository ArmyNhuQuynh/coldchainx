import { Button } from "@/components/ui/button";
import { useDispatchLookup } from "@/hooks/use-dispatch-lookup";
import { useDispatchPlanning } from "@/hooks/use-dispatch";
import { useWarehouse } from "@/hooks/use-warehouse";
import type {
  TDispatchFilters,
  TDispatchReadyLpn,
} from "@/schemas/dispatch.schema";
import { Boxes, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DispatchFilterBar from "./components/dispatch-filter-bar";
import {
  ALL_FILTER_VALUE,
  formatNumber,
  getDefaultPlanningWindow,
  getTemperatureGroup,
  isVehicleTempCompatible,
} from "./components/dispatch-helpers";
import DispatchStepper from "./components/dispatch-stepper";
import DispatchSummaryStrip from "./components/dispatch-summary-strip";
import LpnSelectionPanel from "./components/lpn-selection-panel";
import VehicleDriverPanel from "./components/vehicle-driver-panel";

const defaultFilters: TDispatchFilters = {
  search: "",
  warehouseId: ALL_FILTER_VALUE,
  temperatureGroup: ALL_FILTER_VALUE,
};

const planningWindow = getDefaultPlanningWindow();
const READY_LPN_PAGE_SIZE = 100;

const DispatchPage = () => {
  const { manualDispatch } = useDispatchPlanning();
  const { getReadyLpns, getAvailableVehicles, getAvailableDrivers } =
    useDispatchLookup();
  const { getWarehouses } = useWarehouse();

  const [filters, setFilters] = useState<TDispatchFilters>(defaultFilters);
  const [selectedLpnIds, setSelectedLpnIds] = useState<string[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [plannedStartTime, setPlannedStartTime] = useState(planningWindow.start);
  const [plannedEndTime, setPlannedEndTime] = useState(planningWindow.end);

  const selectedWarehouseId =
    filters.warehouseId === ALL_FILTER_VALUE ? undefined : filters.warehouseId;
  const readyLpnParams = useMemo(
    () => ({
      pageNumber: 1,
      pageSize: READY_LPN_PAGE_SIZE,
      ...(selectedWarehouseId ? { warehouseId: selectedWarehouseId } : {}),
    }),
    [selectedWarehouseId]
  );
  const readyLpnsQuery = getReadyLpns(readyLpnParams);
  const vehiclesQuery = getAvailableVehicles();
  const driversQuery = getAvailableDrivers();
  const warehousesQuery = getWarehouses();

  const lpns = readyLpnsQuery.data ?? [];
  const vehicles = vehiclesQuery.data ?? [];
  const drivers = driversQuery.data ?? [];
  const warehouses = warehousesQuery.data ?? [];

  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].vehicleId);
    }
  }, [selectedVehicleId, vehicles]);

  const selectedLpns = useMemo(
    () => lpns.filter((lpn) => selectedLpnIds.includes(lpn.lpnId)),
    [lpns, selectedLpnIds]
  );

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.vehicleId === selectedVehicleId
  );

  const filteredLpns = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return lpns.filter((lpn) => {
      const tempGroup = getTemperatureGroup(lpn.tempCondition);
      const searchable = [
        lpn.lpnCode,
        lpn.trackingCode,
        lpn.itemName,
        lpn.customerName,
        lpn.destinationAddress,
        lpn.routeName,
        lpn.tempCondition,
        lpn.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!search || searchable.includes(search)) &&
        (filters.temperatureGroup === ALL_FILTER_VALUE ||
          tempGroup === filters.temperatureGroup)
      );
    });
  }, [filters, lpns]);

  const filteredVehicles = vehicles;
  const filteredDrivers = drivers;

  const totalWeight = selectedLpns.reduce(
    (sum, item) => sum + (item.actualWeightKg || 0),
    0
  );
  const totalCbm = selectedLpns.reduce(
    (sum, item) => sum + (item.actualCbm || 0),
    0
  );

  const validationMessages = useMemo(() => {
    const messages: string[] = [];
    const start = new Date(plannedStartTime);
    const end = new Date(plannedEndTime);

    if (!selectedWarehouseId) messages.push("Chọn kho trước khi tạo chuyến.");
    if (selectedLpns.length === 0) messages.push("Chọn ít nhất 1 LPN.");
    if (!selectedVehicle) messages.push("Chọn 1 xe để ghép chuyến.");
    if (selectedDriverIds.length < 1) messages.push("Chọn 1 hoặc 2 tài xế.");
    if (selectedDriverIds.length > 2) messages.push("Mỗi chuyến tối đa 2 tài xế.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      messages.push("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
    }
    if (selectedVehicle && totalWeight > selectedVehicle.maxWeight) {
      messages.push(
        `Tải trọng vượt xe: ${formatNumber(totalWeight)} / ${formatNumber(
          selectedVehicle.maxWeight
        )} kg.`
      );
    }
    if (selectedVehicle && totalCbm > selectedVehicle.maxCbm) {
      messages.push(
        `Thể tích vượt xe: ${formatNumber(totalCbm)} / ${formatNumber(
          selectedVehicle.maxCbm
        )} m³.`
      );
    }
    if (!isVehicleTempCompatible(selectedVehicle, selectedLpns)) {
      messages.push("Dải nhiệt hàng đã chọn nằm ngoài khả năng của xe.");
    }

    return messages;
  }, [
    plannedEndTime,
    plannedStartTime,
    selectedDriverIds.length,
    selectedLpns,
    selectedWarehouseId,
    selectedVehicle,
    totalCbm,
    totalWeight,
  ]);

  const canCreateTrip = validationMessages.length === 0;

  const handleToggleLpn = (lpn: TDispatchReadyLpn) => {
    const exists = selectedLpnIds.includes(lpn.lpnId);
    if (exists) {
      setSelectedLpnIds((ids) => ids.filter((id) => id !== lpn.lpnId));
      return;
    }

    setSelectedLpnIds((ids) => [...ids, lpn.lpnId]);
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

  const handleRefresh = () => {
    readyLpnsQuery.refetch();
    vehiclesQuery.refetch();
    driversQuery.refetch();
    warehousesQuery.refetch();
  };

  const handleFilterChange = (nextFilters: TDispatchFilters) => {
    if (nextFilters.warehouseId !== filters.warehouseId) {
      setSelectedLpnIds([]);
    }
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setSelectedLpnIds([]);
    setFilters(defaultFilters);
  };

  const handleCreateTrip = async () => {
    if (!canCreateTrip || !selectedVehicle || !selectedWarehouseId) return;

    try {
      const result = await manualDispatch.mutateAsync({
        warehouseId: selectedWarehouseId,
        lpnIds: selectedLpnIds,
        vehicleId: selectedVehicle.vehicleId,
        driverIds: selectedDriverIds,
        plannedStartTime: new Date(plannedStartTime).toISOString(),
        plannedEndTime: new Date(plannedEndTime).toISOString(),
      });

      toast.success(`Đã tạo chuyến ${result.tripId}`);
      setSelectedLpnIds([]);
      setSelectedDriverIds([]);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        error?.message ||
        "Không tạo được chuyến.";
      toast.error(message);
    }
  };

  const isLoading =
    readyLpnsQuery.isLoading ||
    vehiclesQuery.isLoading ||
    driversQuery.isLoading ||
    warehousesQuery.isLoading;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Điều phối & Ghép chuyến</h1>
            <p className="mt-1 text-muted-foreground">
              Chọn LPN trong kho, xe và tài xế đủ điều kiện để tạo chuyến
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Dispatch
        </Button>
      </div>

      <DispatchStepper />

      <DispatchFilterBar
        filters={filters}
        warehouseOptions={warehouses}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <DispatchSummaryStrip
        visibleCount={filteredLpns.length}
        selectedLpns={selectedLpns}
        vehicleCount={filteredVehicles.length}
        driverCount={filteredDrivers.length}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)]">
        <LpnSelectionPanel
          lpns={filteredLpns}
          selectedIds={selectedLpnIds}
          isLoading={readyLpnsQuery.isLoading}
          onToggle={handleToggleLpn}
        />

        <VehicleDriverPanel
          vehicles={filteredVehicles}
          drivers={filteredDrivers}
          selectedLpns={selectedLpns}
          selectedVehicleId={selectedVehicleId}
          selectedDriverIds={selectedDriverIds}
          plannedStartTime={plannedStartTime}
          plannedEndTime={plannedEndTime}
          isLoadingVehicles={vehiclesQuery.isLoading}
          isLoadingDrivers={driversQuery.isLoading}
          isSubmitting={manualDispatch.isPending}
          canCreateTrip={canCreateTrip}
          validationMessages={validationMessages}
          onVehicleChange={setSelectedVehicleId}
          onDriverToggle={handleDriverToggle}
          onPlannedStartTimeChange={setPlannedStartTime}
          onPlannedEndTimeChange={setPlannedEndTime}
          onCreateTrip={handleCreateTrip}
        />
      </div>
    </div>
  );
};

export default DispatchPage;
