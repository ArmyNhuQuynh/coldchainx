import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TDriver } from "@/schemas/driver.schema";
import { getDriverStatusLabel } from "@/types/enums/driver-status.enum";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  driver: TDriver;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const DriverDetailHeader = ({ driver }: Props) => {
  const navigate = useNavigate();
  const status = hasValue(driver.status)
    ? getDriverStatusLabel(driver.status)
    : null;
  const summary = [driver.username, driver.email, driver.dateOfBirth].filter(
    hasValue
  );

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Chi tiết tài xế</h1>
          <span className="text-2xl font-bold text-primary">
            {driver.fullName || driver.username || driver.driverId}
          </span>
          {status && <Badge className={status.className}>{status.label}</Badge>}
        </div>
        {summary.length > 0 && (
          <p className="text-muted-foreground">{summary.join(" • ")}</p>
        )}
      </div>

      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>
    </div>
  );
};

export default DriverDetailHeader;
