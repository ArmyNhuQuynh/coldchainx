import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = { incident: TIncident; plan: TIncidentRescuePlan };

const RescueFallbackForm = ({ incident, plan }: Props) => {
  const { recordFallback } = useIncident();
  const isInternal = plan.recommendedAction === "INTERNAL_COLD_STORAGE";
  const warehouse = isInternal
    ? plan.internalColdStorages.find((item) => item.isNearby) ??
      plan.internalColdStorages[0]
    : null;
  const [note, setNote] = useState("");
  const [redispatchPlan, setRedispatchPlan] = useState("");

  const handleSubmit = async () => {
    if (!note.trim() || (isInternal && !warehouse)) return;
    try {
      await recordFallback.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          planType: isInternal ? "INTERNAL_COLD_STORAGE" : "MANUAL_ESCALATION",
          warehouseId: warehouse?.warehouseId,
          redispatchPlan: redispatchPlan.trim() || undefined,
          note: note.trim(),
        },
      });
      toast.success("Đã ghi nhận phương án; Incident vẫn mở để tiếp tục theo dõi.");
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể ghi phương án cứu hộ."));
    }
  };

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-amber-700" />
          {isInternal ? "Fallback kho lạnh nội bộ" : "Phương án khẩn cấp thủ công"}
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{plan.recommendationReason}</p>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {isInternal && warehouse && (
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">Kho nội bộ backend đề xuất</p>
            <p className="mt-1 font-semibold">{warehouse.warehouseName}</p>
            <p className="mt-1 text-muted-foreground">{warehouse.address || "—"}</p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="fallback-note">Ghi chú phương án *</Label>
          <Textarea id="fallback-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="redispatch-plan">Kế hoạch tiếp theo</Label>
          <Textarea id="redispatch-plan" rows={3} value={redispatchPlan} onChange={(e) => setRedispatchPlan(e.target.value)} />
        </div>
        <Button type="button" className="w-full" disabled={!note.trim() || (isInternal && !warehouse) || recordFallback.isPending} onClick={handleSubmit}>
          {recordFallback.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Ghi nhận phương án
        </Button>
      </CardContent>
    </Card>
  );
};

export default RescueFallbackForm;
