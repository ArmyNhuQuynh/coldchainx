import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import { AlertTriangle, Loader2 } from "lucide-react";
import { formatShortTripId, getTripStatusLabel } from "./trip-helpers";

type Props = {
  trip: TDispatchTrip | null;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const TripCancelDialog = ({
  trip,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={Boolean(trip)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Hủy bốc hàng?</DialogTitle>
          <DialogDescription>
            {trip
              ? `Trip ${formatShortTripId(trip.tripId)} đang ở trạng thái ${getTripStatusLabel(
                  trip.status
                )}. Sau khi hủy, BE sẽ đưa LPN về IN_STOCK và giải phóng xe/tài xế nếu chuyến chưa SHIPPING.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Giữ lại
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xác nhận hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TripCancelDialog;
