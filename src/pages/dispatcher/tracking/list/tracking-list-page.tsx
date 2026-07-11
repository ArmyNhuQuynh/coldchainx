import { Button } from "@/components/ui/button";
import { useMonitoring, TRACKING_DEFAULT_STATUSES } from "@/hooks/use-monitoring";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { MapPinned, Route } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackingFilterBar from "./components/tracking-filter-bar";
import {
  TRACKING_ALL_STATUS,
  formatShortTripId,
} from "../shared/tracking-formatters";
import TrackingSummaryCards from "./components/tracking-summary-cards";
import TrackingTripTable from "./components/tracking-trip-table";

const TrackingListPage = () => {
  const navigate = useNavigate();
  const { getTrackingTrips } = useMonitoring();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(TRACKING_ALL_STATUS);
  const [pageNumber, setPageNumber] = useState(1);

  const statuses = useMemo(
    () =>
      status === TRACKING_ALL_STATUS
        ? [...TRACKING_DEFAULT_STATUSES]
        : [status],
    [status]
  );

  const trackingTripsQuery = getTrackingTrips({
    statuses,
    search: search.trim() || undefined,
    pageNumber,
    pageSize: 50,
  });

  const data = trackingTripsQuery.data;
  const trips = data?.data ?? [];

  const handleStatusChange = (nextStatus: string) => {
    setStatus(nextStatus);
    setPageNumber(1);
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    setPageNumber(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Theo dõi chuyến</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý các chuyến đã xuất phát, kiểm tra IoT, vị trí và nhiệt độ
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => trackingTripsQuery.refetch()}
          disabled={trackingTripsQuery.isFetching}
        >
          <Route className="h-4 w-4" />
          Đồng bộ tracking
        </Button>
      </div>

      <TrackingSummaryCards
        trips={trips}
        totalRecords={data?.totalRecords ?? trips.length}
      />

      <TrackingFilterBar
        search={search}
        status={status}
        isLoading={trackingTripsQuery.isFetching}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRefresh={() => trackingTripsQuery.refetch()}
      />

      <TrackingTripTable
        trips={trips}
        isLoading={trackingTripsQuery.isLoading}
        onOpenDetail={(trip) =>
          navigate(PATH_DISPATCHER_DASHBOARD.tracking.detail(trip.tripId))
        }
      />

      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
        <span>
          Trang {data?.pageNumber ?? pageNumber} / {data?.totalPages ?? 1}
        </span>
        <span>
          {trips.length > 0
            ? `Đang hiển thị ${trips.length} chuyến, ví dụ ${formatShortTripId(
                trips[0]?.tripId
              )}`
            : "Chưa có dữ liệu hiển thị"}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
          >
            Trước
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!data || pageNumber >= data.totalPages}
            onClick={() => setPageNumber((page) => page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingListPage;
