import { Button } from "@/components/ui/button";
import TripTrackingView from "@/components/tracking/trip-tracking-view";
import { formatShortTripId } from "@/components/tracking/shared/tracking-formatters";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { ArrowLeft, MapPinned } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const TrackingDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  if (!tripId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        Không tìm thấy mã trip.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate(PATH_DISPATCHER_DASHBOARD.tracking.root)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <MapPinned className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            Hành trình {formatShortTripId(tripId)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Vị trí, nhiệt độ và lịch sử di chuyển của xe trong chuyến
          </p>
        </div>
      </div>
      <TripTrackingView tripId={tripId} />
    </div>
  );
};

export default TrackingDetailPage;
