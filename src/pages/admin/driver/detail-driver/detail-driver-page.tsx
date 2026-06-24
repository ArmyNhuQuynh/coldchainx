import { useDriver } from "@/hooks/use-driver";
import type { TDriverLicense } from "@/schemas/driver.schema";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DriverLicenseDialog from "../components/driver-license-dialog";
import DriverUpsertDialog from "../components/driver-upsert-dialog";
import DriverDetailHeader from "./components/driver-detail-header";
import DriverDetailInfo from "./components/driver-detail-info";
import DriverLicenseCard from "./components/driver-license-card";
import DriverStatusCard from "./components/driver-status-card";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
