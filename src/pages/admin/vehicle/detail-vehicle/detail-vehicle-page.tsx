import { useVehicle } from "@/hooks/use-vehicle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import VehicleDetailHeader from "./components/vehicle-detail-header";
import VehicleDetailInfo from "./components/vehicle-detail-info";
import VehicleStatusCard from "./components/vehicle-status-card";
import VehicleDocumentCard from "./components/vehicle-document-card";
import VehicleMaintenanceCard from "./components/vehicle-maintenance-card";

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getVehicleById } = useVehicle();
  const { data, isLoading } = getVehicleById(id);

  const vehicle = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy xe tải
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleDetailHeader vehicle={vehicle} />

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="documents">Giấy tờ</TabsTrigger>
          <TabsTrigger value="maintenance">Bảo dưỡng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VehicleDetailInfo vehicle={vehicle} />
            </div>
            <div>
              <VehicleStatusCard vehicle={vehicle} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <VehicleDocumentCard
            vehicleId={vehicle.vehicleId}
            documents={vehicle.documents ?? []}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-0">
          <VehicleMaintenanceCard vehicle={vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetailPage;
