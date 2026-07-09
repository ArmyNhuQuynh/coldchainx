import { useVehicle } from "@/hooks/use-vehicle";
import { useParams } from "react-router-dom";
import VehicleDetailHeader from "./components/vehicle-detail-header";
import VehicleDetailInfo from "./components/vehicle-detail-info";
import VehicleStatusCard from "./components/vehicle-status-card";
import VehicleDocumentCard from "./components/vehicle-document-card";
import { AssignIotDialog } from "./components/vehicle-iot-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Cpu } from "lucide-react";

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getVehicleById } = useVehicle();
  const { data, isLoading } = getVehicleById(id);
  const [isAssignIotOpen, setIsAssignIotOpen] = useState(false);

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
      <div className="flex justify-between items-start">
        <VehicleDetailHeader vehicle={vehicle} />
        <Button variant="outline" onClick={() => setIsAssignIotOpen(true)}>
          <Cpu className="w-4 h-4 mr-2" />
          Gán thiết bị IoT
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleDetailInfo vehicle={vehicle} />
        </div>
        <div>
          <VehicleStatusCard vehicle={vehicle} />
        </div>
      </div>

      <VehicleDocumentCard documents={vehicle.documents} />
      
      <AssignIotDialog 
        vehicle={vehicle} 
        isOpen={isAssignIotOpen} 
        onClose={() => setIsAssignIotOpen(false)} 
      />
    </div>
  );
};

export default VehicleDetailPage;
