import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Button } from "@/components/ui/button";
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
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2, Warehouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  incident: TIncident;
  onOpenChange: (open: boolean) => void;
};

const InboundRouteWarehouseDialog = ({ open, incident, onOpenChange }: Props) => {
  const { inboundRouteWarehouse } = useIncident();
  const [sealNumber, setSealNumber] = useState(
    incident.externalReeferPlan?.sealNumber ?? "",
  );
  const submittingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setSealNumber(incident.externalReeferPlan?.sealNumber ?? "");
    }
  }, [incident.externalReeferPlan?.sealNumber, open]);

  const handleSubmit = async () => {
    if (!sealNumber.trim() || submittingRef.current) return;
    submittingRef.current = true;
    try {
      const result = await inboundRouteWarehouse.mutateAsync({
        incidentId: incident.incidentId,
        data: { sealNumber: sealNumber.trim() },
      });
      toast.success(
        result.message ||
          `Đã inbound toàn bộ hàng tại ${result.destinationWarehouseName}.`,
      );
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(
        getIncidentErrorMessage(error, "Không thể xác nhận inbound tại kho tuyến."),
      );
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!inboundRouteWarehouse.isPending} className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Xác nhận inbound tại kho đích tuyến</DialogTitle>
          <DialogDescription>
            Hành động này thường do Warehouse Worker tại hiện trường thực hiện; role Dispatcher cũng được backend cho phép.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Backend đối chiếu seal bàn giao, inbound toàn bộ LPN, chuyển trip cũ sang RELAY_COMPLETED và Incident sang READY_FOR_REDISPATCH.
        </div>
        <div className="space-y-2">
          <Label htmlFor="route-inbound-seal">Seal bàn giao *</Label>
          <Input
            id="route-inbound-seal"
            value={sealNumber}
            onChange={(event) => setSealNumber(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={inboundRouteWarehouse.isPending} onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" disabled={!sealNumber.trim() || inboundRouteWarehouse.isPending} onClick={handleSubmit}>
            {inboundRouteWarehouse.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Warehouse className="h-4 w-4" />
            )}
            Xác nhận inbound
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InboundRouteWarehouseDialog;
