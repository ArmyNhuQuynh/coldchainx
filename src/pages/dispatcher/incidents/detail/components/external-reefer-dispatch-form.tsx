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
import { useIncident } from "@/hooks/use-incident";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  buildExternalReeferConfirmationRequest,
  getExternalReeferConfigurationBlocker,
} from "../incident-workflow";

type Props = {
  incident: TIncident;
  plan: TIncidentRescuePlan;
};

const ExternalReeferDispatchForm = ({ incident, plan }: Props) => {
  const { dispatchExternalReefer } = useIncident();
  const destination = plan.routeDestinationWarehouse;
  const configurationBlocker = getExternalReeferConfigurationBlocker(plan);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDialogChange = (open: boolean) => {
    if (dispatchExternalReefer.isPending) return;
    setDialogOpen(open);
    if (!open) setConfirmed(false);
  };

  const handleSubmit = async () => {
    if (
      !confirmed ||
      configurationBlocker ||
      dispatchExternalReefer.isPending
    ) {
      return;
    }

    try {
      const result = await dispatchExternalReefer.mutateAsync({
        incidentId: incident.incidentId,
        data: buildExternalReeferConfirmationRequest(),
      });

      setDialogOpen(false);
      setConfirmed(false);

      if (
        result.warehouseInboundReady &&
        result.requiredWarehouseAction === "INBOUND_RESCUE_BY_SEAL"
      ) {
        toast.success(
          `Đã xác nhận xe lạnh ngoài. Warehouse ${result.destinationWarehouseName} đã nhận yêu cầu inbound cứu hộ.`
        );
      } else {
        toast.warning(
          result.message ||
            "Đã xác nhận xe lạnh ngoài nhưng backend chưa xác nhận task inbound cho kho."
        );
      }
    } catch (error: unknown) {
      toast.error(
        getIncidentErrorMessage(error, "Không thể xác nhận xe lạnh ngoài.")
      );
    }
  };

  return (
    <>
      <Card className="gap-0 rounded-lg border-orange-200 py-0">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-orange-700" /> Xác nhận xe lạnh
                ngoài
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                ColdChainX không quản lý xe ngoài. Dispatcher chỉ xác nhận đã có
                xe để backend chuyển task inbound cho kho đích.
              </p>
            </div>
            <Badge className="bg-orange-700 text-white">BẮT BUỘC</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          {configurationBlocker ? (
            <div className="flex gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Không thể xác nhận xe lạnh ngoài</p>
                <p className="mt-1">{configurationBlocker}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                <LockKeyhole className="h-4 w-4" /> Kho đích tuyến (chỉ xem)
              </p>
              <p className="mt-2 font-semibold">
                {destination?.warehouseName || "Backend tự xác định khi xác nhận"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {destination?.address ||
                  destination?.warehouseId ||
                  "Không cần chọn kho trên FE."}
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <PackageCheck className="h-4 w-4 text-primary" /> Toàn bộ LPN
                SHIPPING
              </p>
              <p className="mt-1 text-muted-foreground">
                Backend tự lấy và khóa toàn bộ LPN trên chuyến.
              </p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Warehouse
                inbound bằng seal
              </p>
              <p className="mt-1 text-muted-foreground">
                Không QC, không nhập nhiệt độ và không chọn LPN.
              </p>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={
              Boolean(configurationBlocker) || dispatchExternalReefer.isPending
            }
            onClick={() => setDialogOpen(true)}
          >
            Xác nhận đã có xe lạnh ngoài
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent showCloseButton={!dispatchExternalReefer.isPending}>
          <DialogHeader>
            <DialogTitle>Xác nhận đã có xe lạnh ngoài?</DialogTitle>
            <DialogDescription>
              Thao tác này chuyển Incident sang EXTERNAL_REEFER_IN_TRANSIT và
              gửi task inbound cứu hộ khẩn cấp cho Warehouse đích.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <p className="font-semibold">
              {destination?.warehouseName || "Kho đích do backend xác định"}
            </p>
            <p className="mt-1 text-muted-foreground">
              Backend tự lấy toàn bộ LPN SHIPPING. Dispatcher không cần khai báo
              biển số, tài xế, nhà cung cấp, ETA, nhiệt độ hoặc seal.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm">
            <Checkbox
              checked={confirmed}
              disabled={dispatchExternalReefer.isPending}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              aria-label="Xác nhận đã có xe lạnh ngoài"
            />
            <span>
              Tôi xác nhận đã có xe lạnh ngoài và đồng ý chuyển toàn bộ hàng về
              kho đích tuyến để Warehouse inbound bằng seal.
            </span>
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={dispatchExternalReefer.isPending}
              onClick={() => handleDialogChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!confirmed || dispatchExternalReefer.isPending}
              onClick={handleSubmit}
            >
              {dispatchExternalReefer.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Xác nhận và chuyển task cho kho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExternalReeferDispatchForm;
