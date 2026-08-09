import TripHistoryTable, {
  type TTripHistoryRow,
} from "@/components/trip-history/trip-history-table";
import { useDispatchTrips } from "@/hooks/use-dispatch-trip";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

type VehicleTripHistoryProps = {
  truckPlate: string;
};

const VehicleTripHistory = ({ truckPlate }: VehicleTripHistoryProps) => {
  const [page, setPage] = useState(1);
  const { getTrips } = useDispatchTrips();
  const { data, isLoading, isError } = getTrips(
    {
      pageNumber: page,
      pageSize: PAGE_SIZE,
      status: "COMPLETED",
      search: truckPlate,
    },
    Boolean(truckPlate)
  );
  const currentPage = data?.currentPage ?? page;

  useEffect(() => {
    setPage(1);
  }, [truckPlate]);

  useEffect(() => {
    if (!data || page <= Math.max(data.totalPages, 1)) return;
    setPage(Math.max(data.totalPages, 1));
  }, [data, page]);

  const rows: TTripHistoryRow[] = (data?.data ?? []).map((trip) => ({
    tripId: trip.tripId,
    status: trip.status,
    resource:
      trip.route?.routeCode ||
      [trip.route?.originCity, trip.route?.destinationCity]
        .filter(Boolean)
        .join(" → ") ||
      "Chưa cập nhật tuyến",
    plannedStartTime: trip.plannedStartTime,
    endTime: trip.completedAt ?? trip.plannedEndTime,
    detail: `${trip.summary.totalOrders} đơn · ${trip.summary.totalLpns} LPN`,
  }));

  return (
    <TripHistoryTable
      rows={rows}
      resourceHeader="Tuyến"
      totalItems={data?.totalRecords ?? 0}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="Xe chưa có chuyến hoàn thành."
      onPageChange={setPage}
    />
  );
};

export default VehicleTripHistory;
