import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type {
  TIncident,
  TIncidentRiskAssessmentResult,
} from "@/schemas/incident.schema";
import {
  INCIDENT_RISK,
  INCIDENT_RISK_OPTIONS,
  TEMPERATURE_SOURCE,
  TEMPERATURE_SOURCE_OPTIONS,
  type TIncidentRisk,
  type TTemperatureSource,
} from "@/types/enums/incident-risk.enum";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  incident: TIncident;
  containmentOnly?: boolean;
  onOpenChange: (open: boolean) => void;
};

const toDateTimeLocal = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const AssessRiskDialog = ({
  open,
  incident,
  containmentOnly,
  onOpenChange,
}: Props) => {
  const { assessRisk } = useIncident();
  const [riskLevel, setRiskLevel] = useState<TIncidentRisk>(
    containmentOnly ? INCIDENT_RISK.CRITICAL : INCIDENT_RISK.LOW
  );
  const [temperatureSource, setTemperatureSource] =
    useState<TTemperatureSource>(TEMPERATURE_SOURCE.NONE);
  const [measuredTemperature, setMeasuredTemperature] = useState("");
  const [measuredAt, setMeasuredAt] = useState(toDateTimeLocal(new Date()));
  const [temperatureStable, setTemperatureStable] = useState(true);
  const [canSafelyRepairOnSite, setCanSafelyRepairOnSite] = useState<
    boolean | null
  >(null);
  const [containmentConfirmed, setContainmentConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [result, setResult] =
    useState<TIncidentRiskAssessmentResult | null>(null);

  useEffect(() => {
    if (!open) return;
    setResult(null);
    if (containmentOnly) {
      setRiskLevel(INCIDENT_RISK.CRITICAL);
      setContainmentConfirmed(false);
    }
  }, [containmentOnly, open]);

  const warningFieldsValid =
    riskLevel !== INCIDENT_RISK.WARNING ||
    (temperatureSource !== TEMPERATURE_SOURCE.NONE &&
      measuredTemperature.trim() !== "" &&
      measuredAt.trim() !== "");
  const lowFieldsValid =
    riskLevel !== INCIDENT_RISK.LOW || canSafelyRepairOnSite !== null;
  const containmentValid = !containmentOnly || containmentConfirmed;
  const canSubmit =
    warningFieldsValid &&
    lowFieldsValid &&
    containmentValid &&
    !assessRisk.isPending;

  const hasTimestampedPhoto = useMemo(
    () =>
      incident.evidences.some((evidence) =>
        /PHOTO|IMAGE/i.test(evidence.evidenceType)
      ),
    [incident.evidences]
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (
      riskLevel === INCIDENT_RISK.WARNING &&
      temperatureSource === TEMPERATURE_SOURCE.TIMESTAMPED_PHOTO &&
      !hasTimestampedPhoto
    ) {
      toast.warning("Incident chưa có ảnh evidence có thời gian; backend có thể nâng lên CRITICAL.");
    }

    try {
      const assessment = await assessRisk.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          riskLevel,
          temperatureSource,
          measuredTemperature:
            measuredTemperature.trim() === ""
              ? undefined
              : Number(measuredTemperature),
          measuredAt: measuredAt
            ? new Date(measuredAt).toISOString()
            : undefined,
          temperatureStable,
          canSafelyRepairOnSite:
            riskLevel === INCIDENT_RISK.LOW
              ? canSafelyRepairOnSite
              : null,
          containmentConfirmed,
          note: note.trim() || undefined,
        },
      });
      setResult(assessment);
      toast.success("Backend đã cập nhật đánh giá risk của Incident.");
    } catch (error: unknown) {
      toast.error(
        getIncidentErrorMessage(error, "Không thể đánh giá risk Incident.")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {containmentOnly
              ? "Xác nhận đã bảo toàn hàng"
              : "Đánh giá risk Incident"}
          </DialogTitle>
          <DialogDescription>
            Backend quyết định effective risk và trạng thái tiếp theo. FE không tự
            đổi trạng thái trước khi nhận response.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4 py-2">
            <div
              className={`rounded-lg border p-4 ${
                result.effectiveRiskLevel === INCIDENT_RISK.CRITICAL
                  ? "border-rose-300 bg-rose-50"
                  : "border-emerald-300 bg-emerald-50"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Dispatcher chọn {result.requestedRiskLevel} · Backend xác nhận {result.effectiveRiskLevel}
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p>Trạng thái mới: {result.incidentStatus}</p>
                <p>{result.decisionReason}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3 text-sm">
                <p className="text-muted-foreground">Reading backend dùng</p>
                <p className="mt-1 font-semibold">
                  {result.latestTemperature != null
                    ? `${result.latestTemperature}°C · ${result.temperatureSource}`
                    : "Không có reading tin cậy"}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="text-muted-foreground">Thời gian an toàn còn lại</p>
                <p className="mt-1 font-semibold">
                  {result.remainingSafeTimeMinutes != null
                    ? `${result.remainingSafeTimeMinutes} phút`
                    : "Không xác định"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Mức risk Dispatcher chọn</Label>
              <Select
                value={riskLevel}
                disabled={containmentOnly}
                onValueChange={(value) => setRiskLevel(value as TIncidentRisk)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INCIDENT_RISK_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {riskLevel === INCIDENT_RISK.LOW && (
              <div className="space-y-3 rounded-lg border p-4">
                <Label>Có thể sửa an toàn tại chỗ? *</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={canSafelyRepairOnSite === true ? "default" : "outline"}
                    onClick={() => setCanSafelyRepairOnSite(true)}
                  >
                    Có, có thể sửa
                  </Button>
                  <Button
                    type="button"
                    variant={canSafelyRepairOnSite === false ? "destructive" : "outline"}
                    onClick={() => setCanSafelyRepairOnSite(false)}
                  >
                    Không, cần cứu hộ
                  </Button>
                </div>
              </div>
            )}

            {riskLevel === INCIDENT_RISK.WARNING && (
              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nguồn nhiệt độ tin cậy *</Label>
                  <Select
                    value={temperatureSource}
                    onValueChange={(value) =>
                      setTemperatureSource(value as TTemperatureSource)
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TEMPERATURE_SOURCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-temperature">Nhiệt độ đo (°C) *</Label>
                  <Input
                    id="incident-temperature"
                    type="number"
                    step="0.1"
                    value={measuredTemperature}
                    onChange={(event) => setMeasuredTemperature(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-measured-at">Thời điểm đo *</Label>
                  <Input
                    id="incident-measured-at"
                    type="datetime-local"
                    value={measuredAt}
                    onChange={(event) => setMeasuredAt(event.target.value)}
                  />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
              <Checkbox
                checked={temperatureStable}
                onCheckedChange={(checked) => setTemperatureStable(checked === true)}
              />
              <span>
                <strong>Nhiệt độ đang ổn định</strong>
                <span className="mt-1 block text-muted-foreground">
                  Bỏ chọn sẽ khiến LOW/WARNING có thể được backend nâng lên CRITICAL.
                </span>
              </span>
            </label>

            {(riskLevel === INCIDENT_RISK.CRITICAL || containmentOnly) && (
              <label className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm">
                <Checkbox
                  checked={containmentConfirmed}
                  onCheckedChange={(checked) =>
                    setContainmentConfirmed(checked === true)
                  }
                />
                <span>
                  <strong>Đã bảo toàn toàn bộ hàng trong điều kiện lạnh</strong>
                  <span className="mt-1 block text-muted-foreground">
                    Nếu chưa xác nhận, backend giữ Incident tại CONTAINMENT_REQUIRED.
                  </span>
                </span>
              </label>
            )}

            <div className="space-y-2">
              <Label htmlFor="risk-note">Ghi chú đánh giá</Label>
              <Textarea
                id="risk-note"
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Tình trạng hàng, cách bảo toàn và quyết định vận hành..."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Đóng và xem trạng thái mới
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={assessRisk.isPending}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
                {assessRisk.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Gửi đánh giá
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessRiskDialog;
