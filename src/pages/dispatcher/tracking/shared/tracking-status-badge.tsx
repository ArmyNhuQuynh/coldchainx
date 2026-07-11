import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getTrackingStatusClassName,
  getTrackingStatusLabel,
} from "./tracking-formatters";

type Props = {
  status?: string | null;
};

const TrackingStatusBadge = ({ status }: Props) => {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md", getTrackingStatusClassName(status))}
    >
      {getTrackingStatusLabel(status)}
    </Badge>
  );
};

export default TrackingStatusBadge;
