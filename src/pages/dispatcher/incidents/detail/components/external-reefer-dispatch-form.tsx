import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import { AlertTriangle, Loader2, LockKeyhole, PackageCheck, Truck } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getExternalReeferConfigurationBlocker } from "../incident-workflow";

type Props = {
  incident: TIncident;
  plan: TIncidentRescuePlan;
};

const splitEvidenceUrls = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const ExternalReeferDispatchForm = ({ incident, plan }: Props) => {
  const { dispatchExternalReefer } = useIncident();
  const destination = plan.routeDestinationWarehouse;
  const configurationBlocker =
    getExternalReeferConfigurationBlocker(plan) ||
    (!destination?.warehouseId
      ? "Backend chưa trả routeDestinationWarehouse hợp lệ."
      : null);
  const [rentalProvider, setRentalProvider] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [agreedTemperature, setAgreedTemperature] = useState(
    String(plan.targetTemperature),
  );
  const [expectedWarehouseArrivalAt, setExpectedWarehouseArrivalAt] = useState("");
  const [sealNumber, setSealNumber] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [note, setNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const submittingRef = useRef(false);

  const evidenceUrls = useMemo(() => splitEvidenceUrls(evidenceText), [evidenceText]);
  const invalidEvidenceUrls = evidenceUrls.filter((url) => !isHttpUrl(url));
  const temperature = Number(agreedTemperature);
  const tolerance = Number(incident.temperatureTolerance ?? 0);
  const minTemperature = plan.targetTemperature - tolerance;
  const maxTemperature = plan.targetTemperature + tolerance;
  const temperatureValid =
    Number.isFinite(temperature) &&
    temperature >= minTemperature &&
    temperature <= maxTemperature;

  const openConfirmation = () => {
    if (configurationBlocker) return;
    if (!temperatureValid) {
      toast.warning(
        `Nhiệt độ thỏa thuận phải trong khoảng ${minTemperature}°C đến ${maxTemperature}°C.`,
      );
      return;
    }
    if (invalidEvidenceUrls.length > 0) {
      toast.warning("Evidence chỉ nhận URL HTTP/HTTPS hợp lệ.");
      return;
    }
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    if (dispatchExternalReefer.isPending) return;
    setDialogOpen(open);
    if (!open) setConfirmed(false);
  };

  const handleSubmit = async () => {
    if (
      !confirmed ||
      configurationBlocker ||
      !destination ||
      !temperatureValid ||
      invalidEvidenceUrls.length > 0 ||
      submittingRef.current
    ) {
      return;
    }

    submittingRef.current = true;
    try {
      const result = await dispatchExternalReefer.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          externalVehicleConfirmed: true,
          rentalProvider: rentalProvider.trim(),
          vehiclePlate: vehiclePlate.trim(),
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim(),
          destinationWarehouseId: destination.warehouseId,
          agreedTemperature: temperature,
          expectedWarehouseArrivalAt: expectedWarehouseArrivalAt
            ? new Date(expectedWarehouseArrivalAt).toISOString()
            : null,
          sealNumber: sealNumber.trim(),
          lpnIds: [],
          evidenceUrls,
          note: note.trim(),
        },
      });

      handleDialogChange(false);
      toast.success(
        result.message ||
          `Đã điều xe lạnh ngoài về ${result.destinationWarehouseName}.`,
      );
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể điều xe lạnh ngoài."));
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <>
      <Card className="gap-0 rounded-lg border-orange-200 py-0">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-orange-700" /> Thuê xe lạnh ngoài
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Xe ngoài chỉ đưa toàn bộ hàng về kho đích tuyến, không giao trực tiếp cho khách.
              </p>
            </div>
            <Badge className="bg-orange-700 text-white">BACKEND ĐỀ XUẤT</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          {configurationBlocker ? (
            <div className="flex gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Không thể điều xe lạnh ngoài</p>
                <p className="mt-1">{configurationBlocker}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                <LockKeyhole className="h-4 w-4" /> Kho đích tuyến bắt buộc
              </p>
              <p className="mt-2 font-semibold">{destination?.warehouseName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {destination?.address || destination?.warehouseId}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="external-provider">Nhà cung cấp thuê xe</Label>
              <Input id="external-provider" value={rentalProvider} onChange={(event) => setRentalProvider(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-plate">Biển số xe ngoài</Label>
              <Input id="external-plate" value={vehiclePlate} onChange={(event) => setVehiclePlate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-driver">Tài xế đối tác</Label>
              <Input id="external-driver" value={driverName} onChange={(event) => setDriverName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-phone">Điện thoại tài xế</Label>
              <Input id="external-phone" type="tel" value={driverPhone} onChange={(event) => setDriverPhone(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-temperature">Nhiệt độ thỏa thuận (°C) *</Label>
              <Input
                id="external-temperature"
                type="number"
                step="0.1"
                min={minTemperature}
                max={maxTemperature}
                value={agreedTemperature}
                aria-invalid={!temperatureValid}
                onChange={(event) => setAgreedTemperature(event.target.value)}
              />
              <p className={`text-xs ${temperatureValid ? "text-muted-foreground" : "text-rose-700"}`}>
                Dung sai trip: {minTemperature}°C đến {maxTemperature}°C
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-arrival">ETA về kho</Label>
              <Input id="external-arrival" type="datetime-local" value={expectedWarehouseArrivalAt} onChange={(event) => setExpectedWarehouseArrivalAt(event.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="external-seal">Seal bàn giao</Label>
              <Input id="external-seal" value={sealNumber} onChange={(event) => setSealNumber(event.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="external-evidence">Evidence URLs (mỗi dòng một URL)</Label>
              <Textarea id="external-evidence" rows={3} value={evidenceText} onChange={(event) => setEvidenceText(event.target.value)} />
              {invalidEvidenceUrls.length > 0 && (
                <p className="text-xs text-rose-700">URL không hợp lệ: {invalidEvidenceUrls.join(", ")}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="external-note">Ghi chú điều phối</Label>
              <Textarea id="external-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </div>
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <PackageCheck className="h-4 w-4 text-primary" /> Bàn giao toàn bộ LPN SHIPPING
            </p>
            <p className="mt-1 text-muted-foreground">
              FE gửi lpnIds rỗng để backend lấy đúng toàn bộ LPN SHIPPING trên trip theo contract.
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={Boolean(configurationBlocker) || dispatchExternalReefer.isPending}
            onClick={openConfirmation}
          >
            Xem lại và điều xe lạnh ngoài
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent showCloseButton={!dispatchExternalReefer.isPending} className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Xác nhận điều xe lạnh ngoài</DialogTitle>
            <DialogDescription>
              Incident chuyển sang EXTERNAL_REEFER_IN_TRANSIT và trip giữ DELAYED cho đến khi kho inbound.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Xe / tài xế</p>
              <p className="mt-1 font-semibold">{vehiclePlate.trim() || "Backend dùng nhãn mặc định"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{driverName.trim() || "Chưa khai báo"}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Kho đích / nhiệt độ</p>
              <p className="mt-1 font-semibold">{destination?.warehouseName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{temperature}°C · seal {sealNumber.trim() || "chưa có"}</p>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm">
            <Checkbox
              checked={confirmed}
              disabled={dispatchExternalReefer.isPending}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              aria-label="Xác nhận đã có xe lạnh ngoài"
            />
            <span>
              Tôi xác nhận xe ngoài chỉ đưa toàn bộ hàng về kho đích tuyến, không giao trực tiếp cho khách.
            </span>
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={dispatchExternalReefer.isPending} onClick={() => handleDialogChange(false)}>
              Quay lại
            </Button>
            <Button type="button" disabled={!confirmed || dispatchExternalReefer.isPending} onClick={handleSubmit}>
              {dispatchExternalReefer.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Xác nhận điều xe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExternalReeferDispatchForm;
