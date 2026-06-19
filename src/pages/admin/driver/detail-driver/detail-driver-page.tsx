import { useDriver } from "@/hooks/use-driver";
import { useParams } from "react-router-dom";
import DriverDetailHeader from "./components/driver-detail-header";
import DriverDetailInfo from "./components/driver-detail-info";
import DriverLicenseCard from "./components/driver-license-card";
import DriverStatusCard from "./components/driver-status-card";

const DriverDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDriverById } = useDriver();
  const { data, isLoading } = getDriverById(id);

  const driver = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy tài xế
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DriverDetailHeader driver={driver} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DriverDetailInfo driver={driver} />
          <DriverLicenseCard licenses={driver.licenses} />
        </div>
        <div>
          <DriverStatusCard driver={driver} />
        </div>
      </div>
    </div>
  );
};

export default DriverDetailPage;
