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
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import { useMonitoring } from "@/hooks/use-monitoring";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { ClipboardList, Loader2, Route, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TripCancelDialog from "./components/trip-cancel-dialog";
import TripDetailDialog from "./components/trip-detail-dialog";
import TripFilterBar from "./components/trip-filter-bar";
import TripSummaryCards from "./components/trip-summary-cards";
import TripTable from "./components/trip-table";
import { ALL_TRIP_STATUS, formatShortTripId } from "./components/trip-helpers";

const matchTripSearch = (trip: TDispatchTrip, search: string) => {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return true;

  return [
    trip.tripId,
    trip.vehicle,
    trip.driver,
    trip.status,
    trip.label,
    trip.plannedStartTime,
    trip.plannedEndTime,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(keyword);
};

const TripListPage = () => {
  const navigate = useNavigate();
  const { getCreatedTrips, cancelTrip, startPicking, sealAndDispatch } =
    useDispatchTrips();
  const { checkTripVehicleIoT } = useMonitoring();
  const tripsQuery = getCreatedTrips();
  const trips = tripsQuery.data ?? [];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_TRIP_STATUS);
  const [selectedTrip, setSelectedTrip] = useState<TDispatchTrip | null>(null);
  const [tripToCancel, setTripToCancel] = useState<TDispatchTrip | null>(null);
  const [tripToDepart, setTripToDepart] = useState<TDispatchTrip | null>(null);
  const [sealCode, setSealCode] = useState("");
  const isDepartSubmitting =
    sealAndDispatch.isPending || checkTripVehicleIoT.isPending;

  const filteredTrips = useMemo(() => {
    return trips.filter(
      (trip) =>
        matchTripSearch(trip, search) &&
        (status === ALL_TRIP_STATUS || trip.status === status)
    );
  }, [search, status, trips]);

  const statusCounts = useMemo(
    () => ({
      [ALL_TRIP_STATUS]: trips.length,
      PLANNED: trips.filter((trip) => trip.status === "PLANNED").length,
      PICKING: trips.filter((trip) => trip.status === "PICKING").length,
      LOADING_COMPLETED: trips.filter(
        (trip) => trip.status === "LOADING_COMPLETED"
      ).length,
    }),
    [trips]
  );

  const handleConfirmCancel = async () => {
    if (!tripToCancel) return;

    try {
      const result = await cancelTrip.mutateAsync(tripToCancel.tripId);
      toast.success(result.message || "Đã hủy bốc hàng và trả LPN về kho.");
      if (selectedTrip?.tripId === tripToCancel.tripId) {
        setSelectedTrip(null);
      }
      setTripToCancel(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        error?.message ||
        "Không thể hủy bốc hàng.";
      toast.error(message);
    }
  };

  const handleStartPicking = async (trip: TDispatchTrip) => {
    try {
      const result = await startPicking.mutateAsync(trip.tripId);
      toast.success(
        `Đã bắt đầu bốc hàng cho ${result.lpnCount} LPN trong trip ${result.tripId.slice(
          0,
          8
        )}.`
      );
      if (selectedTrip?.tripId === trip.tripId) {
        setSelectedTrip(null);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        error?.message ||
        "Không thể bắt đầu bốc hàng.";
      toast.error(message);
    }
  };

  const handleRequestDepart = (trip: TDispatchTrip) => {
    setSelectedTrip(null);
    setTripToDepart(trip);
    setSealCode(trip.sealNumber ?? "");
  };

  const handleCloseDepartDialog = () => {
    setTripToDepart(null);
    setSealCode("");
  };

  const handleConfirmDepart = async () => {
    if (!tripToDepart) return;

    const trimmedSealCode = sealCode.trim();
    if (!trimmedSealCode) {
      toast.warning("Nhập mã kẹp chì trước khi xuất phát.");
      return;
    }

    try {
      const departingTripId = tripToDepart.tripId;
      const result = await sealAndDispatch.mutateAsync({
        tripId: departingTripId,
        sealCode: trimmedSealCode,
      });
      const trackingTripId = result.tripId || departingTripId;
      const nextStatus = result.tripStatus ? ` (${result.tripStatus})` : "";
      toast.success(
        `Đã xuất phát trip ${formatShortTripId(departingTripId)}${nextStatus}.`
      );

      try {
        const trackingCheck = await checkTripVehicleIoT.mutateAsync(trackingTripId);
        const iotStatus = trackingCheck.iotStatus?.overallStatus?.toUpperCase();

        if (!trackingCheck.iotStatus) {
          toast.warning("Chưa lấy được xe để kiểm tra thiết bị IoT cho chuyến này.");
        } else if (iotStatus === "ONLINE") {
          toast.success("Thiết bị IoT của xe đang online.");
        } else if (iotStatus === "NO_DEVICE") {
          toast.warning("Xe chưa gắn thiết bị IoT, bản đồ sẽ chờ dữ liệu telemetry.");
        } else if (iotStatus === "OFFLINE" || iotStatus === "PARTIAL") {
          toast.warning("Có thiết bị IoT đang offline, cần kiểm tra trước khi theo dõi.");
        }
      } catch {
        toast.warning("Đã xuất phát, nhưng chưa kiểm tra được trạng thái IoT.");
      }

      handleCloseDepartDialog();
      navigate(PATH_DISPATCHER_DASHBOARD.tracking.detail(trackingTripId));
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.Error ||
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.message ||
        "Không thể xuất phát chuyến.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Trip đã tạo</h1>
            <p className="mt-1 text-muted-foreground">
              Theo dõi các chuyến đã ghép, xem tiến độ bốc hàng và hủy trước khi xuất phát
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => tripsQuery.refetch()}
          disabled={tripsQuery.isFetching}
        >
          <Route className="h-4 w-4" />
          Đồng bộ trip
        </Button>
      </div>

      <TripSummaryCards trips={trips} />

      <TripFilterBar
        search={search}
        status={status}
        statusCounts={statusCounts}
        isLoading={tripsQuery.isFetching}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onRefresh={() => tripsQuery.refetch()}
      />

      <TripTable
        trips={filteredTrips}
        isLoading={tripsQuery.isLoading}
        isStartingPicking={startPicking.isPending}
        isDeparting={isDepartSubmitting}
        onSelect={setSelectedTrip}
        onCancel={setTripToCancel}
        onStartPicking={handleStartPicking}
        onDepart={handleRequestDepart}
      />

      <TripDetailDialog
        open={Boolean(selectedTrip)}
        trip={selectedTrip}
        onOpenChange={(open) => {
          if (!open) setSelectedTrip(null);
        }}
        onCancel={setTripToCancel}
        onStartPicking={handleStartPicking}
        onDepart={handleRequestDepart}
        isStartingPicking={startPicking.isPending}
        isDeparting={isDepartSubmitting}
      />

      <TripCancelDialog
        trip={tripToCancel}
        isSubmitting={cancelTrip.isPending}
        onOpenChange={(open) => {
          if (!open) setTripToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />

      <Dialog
        open={Boolean(tripToDepart)}
        onOpenChange={(open) => {
          if (!open) handleCloseDepartDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xuất Phát</DialogTitle>
            <DialogDescription>
              {tripToDepart
                ? `Nhập mã kẹp chì cho trip ${formatShortTripId(
                    tripToDepart.tripId
                  )} để hoàn tất bước điều phối cuối.`
                : "Nhập mã kẹp chì để xuất phát chuyến."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="seal-code">Mã kẹp chì</Label>
            <Input
              id="seal-code"
              value={sealCode}
              placeholder="VD: SEAL-001"
              autoFocus
              disabled={isDepartSubmitting}
              onChange={(event) => setSealCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleConfirmDepart();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDepartSubmitting}
              onClick={handleCloseDepartDialog}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="gap-2"
              disabled={isDepartSubmitting || !sealCode.trim()}
              onClick={handleConfirmDepart}
            >
              {isDepartSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Xuất Phát
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripListPage;
