import { useIotDevice } from "@/hooks/use-iot-device";
import { useParams } from "react-router-dom";
import IotDeviceDetailHeader from "./components/iot-device-detail-header";
import IotDeviceDetailInfo from "./components/iot-device-detail-info";
import IotDeviceStatusCard from "./components/iot-device-status-card";

const DetailIotDevicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getIotDeviceById } = useIotDevice();
  const { data: device, isLoading } = getIotDeviceById(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy thiết bị IoT
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <IotDeviceDetailHeader device={device} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IotDeviceDetailInfo device={device} />
        </div>
        <IotDeviceStatusCard device={device} />
      </div>
    </div>
  );
};

export default DetailIotDevicePage;
