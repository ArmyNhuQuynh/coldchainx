import TripHistoryTable, {
  type TTripHistoryRow,
} from "@/components/trip-history/trip-history-table";
import { useDriver } from "@/hooks/use-driver";
import { useState } from "react";

const PAGE_SIZE = 5;

const DriverTripHistory = ({ driverId }: { driverId: string }) => {
  const [page, setPage] = useState(1);
  const { getDriverTrips } = useDriver();
  const { data, isLoading, isError } = getDriverTrips(
    driverId,
    "COMPLETED"
  );
  const trips = data?.data ?? [];
  const totalPages = Math.max(Math.ceil(trips.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const rows: TTripHistoryRow[] = trips
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .map((trip) => ({
      tripId: trip.tripId,
      status: trip.status,
      resource:
        trip.vehicle?.truckPlate ||
        trip.vehicle?.vehicleType ||
        "Chưa cập nhật xe",
      plannedStartTime: trip.plannedStartTime,
      endTime: trip.plannedEndTime,
      detail: [
        `${trip.stopCount ?? 0} điểm dừng`,
        trip.totalDistanceKm != null
          ? `${trip.totalDistanceKm.toLocaleString("vi-VN")} km`
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }));

  return (
    <TripHistoryTable
      rows={rows}
      resourceHeader="Xe thực hiện"
      totalItems={trips.length}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="Tài xế chưa có chuyến hoàn thành."
      onPageChange={setPage}
    />
  );
};

export default DriverTripHistory;
