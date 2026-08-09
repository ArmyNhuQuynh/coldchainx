import { useDriver } from "@/hooks/use-driver";
import type { TDriverLicense } from "@/schemas/driver.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DriverLicenseDialog from "../components/driver-license-dialog";
import DriverUpsertDialog from "../components/driver-upsert-dialog";
import DriverDetailHeader from "./components/driver-detail-header";
import DriverDetailInfo from "./components/driver-detail-info";
import DriverLicenseCard from "./components/driver-license-card";
import DriverStatusCard from "./components/driver-status-card";
import DriverTripHistory from "./components/driver-trip-history";

const DriverDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDriverById } = useDriver();
  const { data, isLoading } = getDriverById(id);
  const [editDriverOpen, setEditDriverOpen] = useState(false);
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<TDriverLicense | null>(
    null
  );

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
      <DriverDetailHeader
        driver={driver}
        onEdit={() => setEditDriverOpen(true)}
      />

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList>
          <TabsTrigger value="overview">Thông tin</TabsTrigger>
          <TabsTrigger value="trip-history">Lịch sử chuyến</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <DriverDetailInfo driver={driver} />
              <DriverLicenseCard
                driverId={driver.driverId}
                licenses={driver.licenses}
                onCreate={() => {
                  setSelectedLicense(null);
                  setLicenseDialogOpen(true);
                }}
                onEdit={(license) => {
                  setSelectedLicense(license);
                  setLicenseDialogOpen(true);
                }}
              />
            </div>
            <div>
              <DriverStatusCard driver={driver} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trip-history" className="mt-0">
          <DriverTripHistory driverId={driver.driverId} />
        </TabsContent>
      </Tabs>

      <DriverUpsertDialog
        open={editDriverOpen}
        onOpenChange={setEditDriverOpen}
        mode="edit"
        driver={driver}
      />
      {id && (
        <DriverLicenseDialog
          open={licenseDialogOpen}
          onOpenChange={setLicenseDialogOpen}
          driverId={id}
          license={selectedLicense}
        />
      )}
    </div>
  );
};

export default DriverDetailPage;
