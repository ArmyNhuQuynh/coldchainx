import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { Clock, Loader2, RadioTower } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import RescueCandidateList from "./rescue-candidate-list";
import TripDriverList from "./trip-driver-list";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
  plan?: TIncidentRescuePlan;
};

const RescueDispatchForm = ({ incident, trip, plan }: Props) => {
  const { getRescueCandidates, dispatchRescue } = useIncident();
  const candidatesQuery = getRescueCandidates(incident.incidentId, !plan);
  const candidates = plan?.vehicles ?? candidatesQuery.data ?? [];
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [transloadMinutes, setTransloadMinutes] = useState("45");
  const [note, setNote] = useState("");
  const [destinationWarehouseId, setDestinationWarehouseId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittingRef = useRef(false);

  const selectedVehicle = useMemo(
    () => candidates.find((vehicle) => vehicle.vehicleId === selectedVehicleId),
    [candidates, selectedVehicleId]
  );
  const planType =
    plan?.recommendedAction === "WAREHOUSE_RESCUE"
      ? "WAREHOUSE_RESCUE"
      : "DIRECT_RESCUE";
  const destinationWarehouse = plan?.internalColdStorages.find(
    (warehouse) => warehouse.warehouseId === destinationWarehouseId,
  ) ?? null;

  useEffect(() => {
    if (!selectedVehicleId) {
      const recommendedVehicle = candidates.find((vehicle) => vehicle.recommended);
      if (recommendedVehicle) setSelectedVehicleId(recommendedVehicle.vehicleId);
    }
  }, [candidates, selectedVehicleId]);

  useEffect(() => {
    if (planType !== "WAREHOUSE_RESCUE" || destinationWarehouseId) return;
    const recommendedWarehouse =
      plan?.internalColdStorages.find((warehouse) => warehouse.isNearby) ??
      plan?.routeDestinationWarehouse;
    if (recommendedWarehouse) {
      setDestinationWarehouseId(recommendedWarehouse.warehouseId);
    }
  }, [destinationWarehouseId, plan, planType]);

  const openConfirmation = () => {
    if (!selectedVehicle) {
      toast.warning("Chọn xe thay thế trước khi điều động.");
      return;
    }

    const minutes = Number(transloadMinutes);
    if (!Number.isInteger(minutes) || minutes <= 0) {
      toast.warning("Thời gian sang hàng phải là số phút lớn hơn 0.");
      return;
    }
    if (incident.directDeliveryLocked && planType === "DIRECT_RESCUE") {
      toast.error("Backend đang khóa giao trực tiếp; không thể chọn DIRECT_RESCUE.");
      return;
    }
    if (planType === "WAREHOUSE_RESCUE" && !destinationWarehouse) {
      toast.warning("Chọn kho lạnh đích trước khi điều xe.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleDispatch = async () => {
    if (!selectedVehicle || submittingRef.current) return;
    const minutes = Number(transloadMinutes);
    submittingRef.current = true;

    try {
      const result = await dispatchRescue.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          replacementVehicleId: selectedVehicle.vehicleId,
          planType,
          destinationWarehouseId: destinationWarehouse?.warehouseId ?? null,
          transloadMinutes: minutes,
          note: note.trim() || undefined,
        },
      });
      setConfirmOpen(false);
      toast.success(
        `Đã điều xe ${result.rescueVehiclePlate}; ${result.notifiedCustomerCount} khách hàng được cập nhật ETA.`
      );
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể điều xe cứu hộ."));
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-lg">
          {planType === "WAREHOUSE_RESCUE"
            ? "Điều xe về kho lạnh nội bộ"
            : "Điều xe cứu hộ giao tiếp"}
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan?.recommendationReason ||
            "Chọn một xe đủ tải, đúng dải nhiệt và không bận chuyến khác"}
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="grid min-h-0 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <RescueCandidateList
            candidates={candidates}
            selectedVehicleId={selectedVehicleId}
            isLoading={candidatesQuery.isLoading}
            error={candidatesQuery.error}
            onSelect={setSelectedVehicleId}
          />
          <TripDriverList trip={trip} />
        </div>

        {planType === "WAREHOUSE_RESCUE" && (
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <Label htmlFor="rescue-destination-warehouse">Kho lạnh đích *</Label>
            <Select
              value={destinationWarehouseId}
              onValueChange={setDestinationWarehouseId}
            >
              <SelectTrigger id="rescue-destination-warehouse" className="w-full">
                <SelectValue placeholder="Chọn kho từ rescue options" />
              </SelectTrigger>
              <SelectContent>
                {(plan?.internalColdStorages ?? []).map((warehouse) => (
                  <SelectItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
                    {warehouse.warehouseName} · {warehouse.distanceKm ?? "?"} km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {destinationWarehouse && (
              <p className="text-muted-foreground">{destinationWarehouse.address || "—"}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 border-t pt-5 md:grid-cols-[220px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="transload-minutes">Thời gian sang hàng dự kiến</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="transload-minutes"
                type="number"
                min={1}
                value={transloadMinutes}
                className="pl-9"
                onChange={(event) => setTransloadMinutes(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rescue-note">Ghi chú điều động</Label>
            <Textarea
              id="rescue-note"
              value={note}
              rows={3}
              placeholder="Vị trí tiếp cận, yêu cầu bốc xếp hoặc lưu ý cho đội hiện trường..."
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        {selectedVehicle &&
          selectedVehicle.onlineIotDeviceCount < selectedVehicle.iotDeviceCount && (
          <div className="flex gap-2 rounded-lg border border-amber-300 p-3 text-sm text-amber-800">
            <RadioTower className="mt-0.5 h-4 w-4 shrink-0" />
            Có thể điều xe này, nhưng phải kết nối tất cả thiết bị IoT trước khi xác nhận sang hàng.
          </div>
        )}

        <Button
          type="button"
          className="w-full"
          disabled={
            !selectedVehicle ||
            dispatchRescue.isPending ||
            (planType === "WAREHOUSE_RESCUE" && !destinationWarehouse)
          }
          onClick={openConfirmation}
        >
          {dispatchRescue.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Điều xe đến hiện trường
        </Button>
      </CardContent>
      <Dialog open={confirmOpen} onOpenChange={(open) => !dispatchRescue.isPending && setConfirmOpen(open)}>
        <DialogContent showCloseButton={!dispatchRescue.isPending} className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Xác nhận điều xe cứu hộ</DialogTitle>
            <DialogDescription>
              Kiểm tra lại xe, ETA, kho và kế hoạch trước khi gửi lệnh backend.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Xe cứu hộ</p>
              <p className="mt-1 font-semibold">{selectedVehicle?.truckPlate}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ETA {selectedVehicle?.estimatedArrivalMinutes ?? "?"} phút · IoT {selectedVehicle?.onlineIotDeviceCount}/{selectedVehicle?.iotDeviceCount}
              </p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Kế hoạch</p>
              <p className="mt-1 font-semibold">{planType}</p>
              <p className="mt-1 text-xs text-muted-foreground">Sang hàng {transloadMinutes} phút</p>
            </div>
            <div className="rounded-lg border p-3 text-sm sm:col-span-2">
              <p className="text-muted-foreground">Kho đích</p>
              <p className="mt-1 font-semibold">
                {planType === "WAREHOUSE_RESCUE"
                  ? destinationWarehouse?.warehouseName
                  : "Không áp dụng · tiếp tục tuyến giao hiện tại"}
              </p>
            </div>
          </div>
          {(selectedVehicle?.hasOnlineIot === false ||
            selectedVehicle?.canArriveWithinSafeTime === false) && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              Cảnh báo: xe không có IoT online hoặc ETA vượt thời gian an toàn. Backend sẽ kiểm tra lại trước khi điều động.
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={dispatchRescue.isPending} onClick={() => setConfirmOpen(false)}>
              Quay lại
            </Button>
            <Button type="button" disabled={dispatchRescue.isPending} onClick={handleDispatch}>
              {dispatchRescue.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Xác nhận điều xe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RescueDispatchForm;
