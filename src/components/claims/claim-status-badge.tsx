import { Badge } from "@/components/ui/badge";
import {
  getClaimStatusClassName,
  getClaimStatusLabel,
} from "@/types/enums/claim-status.enum";

type Props = { status?: string | null };

const ClaimStatusBadge = ({ status }: Props) => (
  <Badge
    variant="outline"
    className={`rounded-md bg-transparent ${getClaimStatusClassName(status)}`}
  >
    {getClaimStatusLabel(status)}
  </Badge>
);

export default ClaimStatusBadge;
