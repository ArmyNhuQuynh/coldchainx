import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVehicle } from "@/hooks/use-vehicle";
import type { TMaintenanceTicket, TVehicle } from "@/schemas/vehicle.schema";
import {
  getMaintenanceForecastStatusLabel,
} from "@/types/enums/maintenance-forecast-status.enum";
import {
  MAINTENANCE_TICKET_STATUS,
  normalizeMaintenanceTicketStatus,
} from "@/types/enums/maintenance-ticket-status.enum";
import { useMemo, useState } from "react";
import MaintenanceTicketItem from "./maintenance-ticket-item";
import VehicleMaintenanceCompleteDialog from "./vehicle-maintenance-complete-dialog";
import VehicleMaintenanceTicketDialog from "./vehicle-maintenance-ticket-dialog";
import VehicleUnavailableDialog from "./vehicle-unavailable-dialog";

type Props = {
  vehicle: TVehicle;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const formatNumber = (value?: number | null, unit = "") => {
  if (value == null) return "-";
  return `${value.toLocaleString("vi-VN")}${unit ? ` ${unit}` : ""}`;
};

const isClosedTicket = (ticket: TMaintenanceTicket) => {
  const status = normalizeMaintenanceTicketStatus(ticket.status);
  return (
    status === MAINTENANCE_TICKET_STATUS.RESOLVED ||
    status === MAINTENANCE_TICKET_STATUS.CANCELLED
  );
};

const VehicleMaintenanceCard = ({ vehicle }: Props) => {
  const {
    getMaintenanceTickets,
    getVehicleMaintenanceHistory,
    getVehicleMaintenanceForecast,
  } = useVehicle();
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [unavailableDialogOpen, setUnavailableDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completingTicket, setCompletingTicket] =
    useState<TMaintenanceTicket | null>(null);
  const ticketParams = useMemo(
    () => ({
      vehicleId: vehicle.vehicleId,
      pageNumber: 1,
      pageSize: 50,
    }),
    [vehicle.vehicleId]
  );

  const ticketsQuery = getMaintenanceTickets(ticketParams);
  const historyQuery = getVehicleMaintenanceHistory(vehicle.vehicleId);
  const forecastQuery = getVehicleMaintenanceForecast(vehicle.vehicleId);
  const forecast = forecastQuery.data?.data;
  const tickets = ticketsQuery.data?.data?.items ?? [];
  const activeTickets = tickets.filter((ticket) => !isClosedTicket(ticket));
  const history = historyQuery.data?.data ?? [];
  const forecastStatus = getMaintenanceForecastStatusLabel(
    forecast?.forecastStatus
  );

  const openCompleteDialog = (ticket: TMaintenanceTicket) => {
    setCompletingTicket(ticket);
    setCompleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div>
          <p className="text-lg font-semibold">Bảo dưỡng xe</p>
          <p className="text-sm text-muted-foreground">
            Theo dõi dự báo, phiếu bảo dưỡng và lịch sử vận hành của xe.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setUnavailableDialogOpen(true)}
          >
            Khóa xe
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => setTicketDialogOpen(true)}
          >
            Tạo phiếu
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Dự báo bảo dưỡng</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {forecast?.message ?? "Chưa có dữ liệu dự báo từ BE."}
              </p>
            </div>
            <Badge className={forecastStatus.className}>
              {forecastStatus.label}
            </Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs text-muted-foreground">Số km còn lại</p>
              <p className="mt-1 font-semibold">
                {formatNumber(forecast?.headroomKm, "km")}
              </p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs text-muted-foreground">Số ngày còn lại</p>
              <p className="mt-1 font-semibold">
                {formatNumber(forecast?.remainingDays, "ngày")}
              </p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs text-muted-foreground">Mốc km tiếp theo</p>
              <p className="mt-1 font-semibold">
                {formatNumber(vehicle.nextMaintenanceOdometer, "km")}
              </p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs text-muted-foreground">Ngày bảo dưỡng</p>
              <p className="mt-1 font-semibold">
                {formatDate(vehicle.nextMaintenanceDate)}
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Phiếu đang xử lý</p>
            <span className="text-sm text-muted-foreground">
              {activeTickets.length} phiếu
            </span>
          </div>
          {ticketsQuery.isLoading ? (
            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
              Đang tải phiếu bảo dưỡng...
            </div>
          ) : activeTickets.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              Không có phiếu bảo dưỡng đang mở.
            </div>
          ) : (
            <div className="space-y-3">
              {activeTickets.map((ticket) => (
                <MaintenanceTicketItem
                  key={ticket.ticketId}
                  ticket={ticket}
                  onComplete={openCompleteDialog}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Lịch sử bảo dưỡng</p>
            <span className="text-sm text-muted-foreground">
              {history.length} lần
            </span>
          </div>
          {historyQuery.isLoading ? (
            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
              Đang tải lịch sử bảo dưỡng...
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              Chưa có lịch sử bảo dưỡng đã hoàn tất.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((ticket) => (
                <MaintenanceTicketItem
                  key={ticket.ticketId}
                  ticket={ticket}
                  onComplete={openCompleteDialog}
                />
              ))}
            </div>
          )}
        </section>
      </CardContent>

      <VehicleMaintenanceTicketDialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        vehicleId={vehicle.vehicleId}
      />
      <VehicleUnavailableDialog
        open={unavailableDialogOpen}
        onOpenChange={setUnavailableDialogOpen}
        vehicle={vehicle}
      />
      <VehicleMaintenanceCompleteDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        ticket={completingTicket}
      />
    </Card>
  );
};

export default VehicleMaintenanceCard;
