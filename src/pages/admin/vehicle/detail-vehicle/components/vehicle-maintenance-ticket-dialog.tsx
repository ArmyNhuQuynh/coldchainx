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
import { Textarea } from "@/components/ui/textarea";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import {
  CreateMaintenanceTicketRequestSchema,
  MAINTENANCE_TICKET_FORM_DEFAULTS,
  type TCreateMaintenanceTicketRequest,
} from "@/schemas/vehicle.schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
};

const getDefaultForm = (): TCreateMaintenanceTicketRequest => ({
  maintenanceType: MAINTENANCE_TICKET_FORM_DEFAULTS.maintenanceType,
  garageName: "",
  description: "",
});

const VehicleMaintenanceTicketDialog = ({
  open,
  onOpenChange,
  vehicleId,
}: Props) => {
  const { createMaintenanceTicket } = useVehicle();
  const [form, setForm] =
    useState<TCreateMaintenanceTicketRequest>(getDefaultForm);

  useEffect(() => {
    if (open) setForm(getDefaultForm());
  }, [open]);

  const updateField = <K extends keyof TCreateMaintenanceTicketRequest>(
    key: K,
    value: TCreateMaintenanceTicketRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    if (createMaintenanceTicket.isPending) return;

    const parsed = CreateMaintenanceTicketRequestSchema.safeParse({
      maintenanceType: form.maintenanceType.trim(),
      garageName: form.garageName.trim(),
      description: form.description.trim(),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dữ liệu phiếu chưa hợp lệ");
      return;
    }

    try {
      await createMaintenanceTicket.mutateAsync({
        vehicleId,
        data: parsed.data,
      });
      toast.success("Đã tạo phiếu bảo dưỡng");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!createMaintenanceTicket.isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo phiếu bảo dưỡng</DialogTitle>
          <DialogDescription>
            Khi tạo phiếu, BE sẽ chuyển xe sang trạng thái bảo dưỡng nếu hợp lệ.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Loại bảo dưỡng</Label>
            <Input
              className="h-11 rounded-xl bg-background"
              value={form.maintenanceType}
              onChange={(event) => updateField("maintenanceType", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Garage</Label>
            <Input
              className="h-11 rounded-xl bg-background"
              value={form.garageName}
              onChange={(event) => updateField("garageName", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              className="min-h-28 rounded-xl bg-background"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={createMaintenanceTicket.isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={createMaintenanceTicket.isPending}
            onClick={handleSubmit}
          >
            {createMaintenanceTicket.isPending ? "Đang tạo..." : "Tạo phiếu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleMaintenanceTicketDialog;
