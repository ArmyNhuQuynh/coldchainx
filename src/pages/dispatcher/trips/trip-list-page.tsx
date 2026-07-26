import { Button } from "@/components/ui/button";
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { ClipboardList, Route } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TripCancelDialog from "./components/trip-cancel-dialog";
import TripDetailDialog from "./components/trip-detail-dialog";
import TripFilterBar from "./components/trip-filter-bar";
import TripSummaryCards from "./components/trip-summary-cards";
import TripTable from "./components/trip-table";
import { ALL_TRIP_STATUS } from "./components/trip-helpers";

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
  const { getCreatedTrips, cancelTrip, startPicking } = useDispatchTrips();
  const tripsQuery = getCreatedTrips();
  const trips = tripsQuery.data ?? [];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_TRIP_STATUS);
  const [selectedTrip, setSelectedTrip] = useState<TDispatchTrip | null>(null);
  const [tripToCancel, setTripToCancel] = useState<TDispatchTrip | null>(null);

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
        onSelect={setSelectedTrip}
        onCancel={setTripToCancel}
        onStartPicking={handleStartPicking}
      />

      <TripDetailDialog
        open={Boolean(selectedTrip)}
        trip={selectedTrip}
        onOpenChange={(open) => {
          if (!open) setSelectedTrip(null);
        }}
        onCancel={setTripToCancel}
        onStartPicking={handleStartPicking}
        isStartingPicking={startPicking.isPending}
      />

      <TripCancelDialog
        trip={tripToCancel}
        isSubmitting={cancelTrip.isPending}
        onOpenChange={(open) => {
          if (!open) setTripToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default TripListPage;
