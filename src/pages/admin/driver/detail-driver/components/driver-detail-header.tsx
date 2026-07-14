import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TDriver } from "@/schemas/driver.schema";
import { getDriverStatusLabel } from "@/types/enums/driver-status.enum";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  driver: TDriver;
  onEdit: () => void;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const DriverDetailHeader = ({ driver, onEdit }: Props) => {
  const navigate = useNavigate();
  const status = hasValue(driver.status)
    ? getDriverStatusLabel(driver.status)
    : null;
  const summary = [driver.email, driver.phoneNumber, driver.dateOfBirth].filter(
    hasValue
  );

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Chi tiết tài xế</h1>
          <span className="text-2xl font-bold text-primary">
            {driver.fullName || driver.driverId}
          </span>
          {status && <Badge className={status.className}>{status.label}</Badge>}
        </div>
        {summary.length > 0 && (
          <p className="text-muted-foreground">{summary.join(" • ")}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="rounded-xl" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate(PATH_ADMIN_DASHBOARD.driver.root)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default DriverDetailHeader;
