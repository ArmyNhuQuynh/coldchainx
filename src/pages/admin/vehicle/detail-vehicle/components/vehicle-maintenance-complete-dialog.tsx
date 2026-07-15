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
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import {
  CompleteMaintenanceTicketRequestSchema,
  type TMaintenanceTicket,
  type TCompleteMaintenanceTicketRequest,
} from "@/schemas/vehicle.schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: TMaintenanceTicket | null;
};

const today = () => new Date().toISOString().slice(0, 10);

const VehicleMaintenanceCompleteDialog = ({
  open,
  onOpenChange,
  ticket,
}: Props) => {
  const { completeMaintenanceTicket } = useVehicle();
  const [form, setForm] = useState<TCompleteMaintenanceTicketRequest>({
    cost: 0,
    completionDate: today(),
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      cost: ticket?.cost ?? 0,
      completionDate: ticket?.completionDate?.slice(0, 10) ?? today(),
    });
  }, [open, ticket]);

  const handleSubmit = async () => {
    if (!ticket || completeMaintenanceTicket.isPending) return;

    const parsed = CompleteMaintenanceTicketRequestSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dữ liệu hoàn tất chưa hợp lệ");
      return;
    }

    try {
      await completeMaintenanceTicket.mutateAsync({
        ticketId: ticket.ticketId,
        vehicleId: ticket.vehicleId,
        data: parsed.data,
      });
      toast.success("Đã hoàn tất bảo dưỡng");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!completeMaintenanceTicket.isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Hoàn tất phiếu bảo dưỡng</DialogTitle>
          <DialogDescription>
            Sau khi hoàn tất, BE sẽ cập nhật mốc bảo dưỡng tiếp theo cho xe.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Chi phí</Label>
            <Input
              type="number"
              min={0}
              className="h-11 rounded-xl bg-background"
              value={form.cost}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  cost: Number(event.target.value || 0),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ngày hoàn tất</Label>
            <Input
              type="date"
              className="h-11 rounded-xl bg-background"
              value={form.completionDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  completionDate: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={completeMaintenanceTicket.isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={!ticket || completeMaintenanceTicket.isPending}
            onClick={handleSubmit}
          >
            {completeMaintenanceTicket.isPending ? "Đang lưu..." : "Hoàn tất"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleMaintenanceCompleteDialog;
