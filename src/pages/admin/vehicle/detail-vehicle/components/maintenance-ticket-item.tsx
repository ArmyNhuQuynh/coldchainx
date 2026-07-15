import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import type { TMaintenanceTicket } from "@/schemas/vehicle.schema";
import {
  getMaintenanceTicketStatusLabel,
  MAINTENANCE_TICKET_STATUS,
  normalizeMaintenanceTicketStatus,
} from "@/types/enums/maintenance-ticket-status.enum";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";

type Props = {
  ticket: TMaintenanceTicket;
  onComplete: (ticket: TMaintenanceTicket) => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const formatMoney = (value?: number | null) => {
  if (value == null) return "-";
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const MaintenanceTicketItem = ({ ticket, onComplete }: Props) => {
  const { updateMaintenanceTicketStatus, uploadMaintenanceTicketDocument } =
    useVehicle();
  const normalizedStatus = normalizeMaintenanceTicketStatus(ticket.status);
  const status = getMaintenanceTicketStatusLabel(ticket.status);
  const canAct =
    normalizedStatus !== MAINTENANCE_TICKET_STATUS.RESOLVED &&
    normalizedStatus !== MAINTENANCE_TICKET_STATUS.CANCELLED;

  const changeStatus = async (nextStatus: string) => {
    try {
      await updateMaintenanceTicketStatus.mutateAsync({
        ticketId: ticket.ticketId,
        vehicleId: ticket.vehicleId,
        status: nextStatus,
      });
      toast.success("Đã cập nhật trạng thái phiếu");
    } catch (error) {
      handleApiError(error);
    }
  };

  const uploadDocument = async (file?: File) => {
    if (!file) return;

    try {
      await uploadMaintenanceTicketDocument.mutateAsync({
        ticketId: ticket.ticketId,
        vehicleId: ticket.vehicleId,
        file,
      });
      toast.success("Đã tải chứng từ bảo dưỡng");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">
              {ticket.ticketCode || ticket.maintenanceType}
            </p>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {ticket.garageName || "Chưa có garage"} · {ticket.maintenanceType}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {normalizedStatus === MAINTENANCE_TICKET_STATUS.OPEN && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              disabled={updateMaintenanceTicketStatus.isPending}
              onClick={() =>
                changeStatus(MAINTENANCE_TICKET_STATUS.IN_PROGRESS)
              }
            >
              Đem xe đi sửa
            </Button>
          )}

          {canAct && (
            <>
              <Button
                type="button"
                size="sm"
                className="rounded-lg"
                onClick={() => onComplete(ticket)}
              >
                Hoàn tất
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-lg text-destructive hover:text-destructive"
                disabled={updateMaintenanceTicketStatus.isPending}
                onClick={() =>
                  changeStatus(MAINTENANCE_TICKET_STATUS.CANCELLED)
                }
              >
                Hủy
              </Button>
            </>
          )}
        </div>
      </div>

      {ticket.description && (
        <p className="mt-3 text-sm text-muted-foreground">
          {ticket.description}
        </p>
      )}

      <div className="mt-3 grid gap-2 text-sm md:grid-cols-4">
        <span>
          Ngày tạo: <b>{formatDate(ticket.issueDate)}</b>
        </span>
        <span>
          Ngày xong: <b>{formatDate(ticket.completionDate)}</b>
        </span>
        <span>
          Km ghi nhận:{" "}
          <b>{ticket.triggeredAtOdometer?.toLocaleString("vi-VN") ?? "-"}</b>
        </span>
        <span>
          Chi phí: <b>{formatMoney(ticket.cost)}</b>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {ticket.attachmentUrl && (
          <a
            href={ticket.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Paperclip className="h-4 w-4" />
            Xem chứng từ
          </a>
        )}
        {canAct && (
          <label className="inline-flex cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-accent">
            Tải chứng từ
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              disabled={uploadMaintenanceTicketDocument.isPending}
              onChange={(event) => {
                uploadDocument(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTicketItem;
