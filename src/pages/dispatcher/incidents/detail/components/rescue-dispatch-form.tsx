import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import type { TTrackingTrip } from "@/schemas/monitoring.schema";
import { Clock, Loader2, RadioTower } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import RescueCandidateList from "./rescue-candidate-list";
import TripDriverList from "./trip-driver-list";

type Props = {
  incident: TIncident;
  trip?: TTrackingTrip | null;
};

const RescueDispatchForm = ({ incident, trip }: Props) => {
  const { getRescueCandidates, dispatchRescue } = useIncident();
  const candidatesQuery = getRescueCandidates(incident.incidentId);
  const candidates = candidatesQuery.data ?? [];
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [transloadMinutes, setTransloadMinutes] = useState("45");
  const [note, setNote] = useState("");

  const selectedVehicle = useMemo(
    () => candidates.find((vehicle) => vehicle.vehicleId === selectedVehicleId),
    [candidates, selectedVehicleId]
  );

  const handleDispatch = async () => {
    if (!selectedVehicle) {
      toast.warning("Chọn xe thay thế trước khi điều động.");
      return;
    }

    const minutes = Number(transloadMinutes);
    if (!Number.isInteger(minutes) || minutes <= 0) {
      toast.warning("Thời gian sang hàng phải là số phút lớn hơn 0.");
      return;
    }

    try {
      const result = await dispatchRescue.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          replacementVehicleId: selectedVehicle.vehicleId,
          transloadMinutes: minutes,
          note: note.trim() || undefined,
        },
      });
      toast.success(
        `Đã điều xe ${result.rescueVehiclePlate}; ${result.notifiedCustomerCount} khách hàng được cập nhật ETA.`
      );
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể điều xe cứu hộ."));
    }
  };

  return (
    <Card className="gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-lg">Điều xe cứu hộ</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Chọn một xe đủ tải, đúng dải nhiệt và không bận chuyến khác
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="grid min-h-0 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <RescueCandidateList
            candidates={candidates}
            selectedVehicleId={selectedVehicleId}
            isLoading={candidatesQuery.isLoading}
            error={candidatesQuery.error}
            onSelect={setSelectedVehicleId}
          />
          <TripDriverList trip={trip} />
        </div>

        <div className="grid gap-4 border-t pt-5 md:grid-cols-[220px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="transload-minutes">Thời gian sang hàng dự kiến</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="transload-minutes"
                type="number"
                min={1}
                value={transloadMinutes}
                className="pl-9"
                onChange={(event) => setTransloadMinutes(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rescue-note">Ghi chú điều động</Label>
            <Textarea
              id="rescue-note"
              value={note}
              rows={3}
              placeholder="Vị trí tiếp cận, yêu cầu bốc xếp hoặc lưu ý cho đội hiện trường..."
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        {selectedVehicle && !selectedVehicle.isIotOnline && (
          <div className="flex gap-2 rounded-lg border border-amber-300 p-3 text-sm text-amber-800">
            <RadioTower className="mt-0.5 h-4 w-4 shrink-0" />
            Có thể điều xe này, nhưng phải bật và kết nối IoT trước khi xác nhận sang hàng.
          </div>
        )}

        <Button
          type="button"
          className="w-full"
          disabled={!selectedVehicle || dispatchRescue.isPending}
          onClick={handleDispatch}
        >
          {dispatchRescue.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Điều xe đến hiện trường
        </Button>
      </CardContent>
    </Card>
  );
};

export default RescueDispatchForm;
