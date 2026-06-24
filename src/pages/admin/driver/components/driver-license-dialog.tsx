import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDriverLicenseForm } from "@/hooks/use-driver-license-form";
import { useDriver } from "@/hooks/use-driver";
import { toDriverLicenseRequest } from "@/schemas/driver.mapper";
import type {
  TDriverLicense,
  TDriverLicenseRequest,
} from "@/schemas/driver.schema";
import { toast } from "sonner";
import DriverLicenseForm from "./driver-license-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverId: string;
  license?: TDriverLicense | null;
};

const DriverLicenseDialog = ({
  open,
  onOpenChange,
  driverId,
  license,
}: Props) => {
  const { createDriverLicense, updateDriverLicense } = useDriver();
  const isEdit = !!license;
  const isSubmitting =
    createDriverLicense.isPending || updateDriverLicense.isPending;

  const handleSubmit = async (values: TDriverLicenseRequest) => {
    const payload = toDriverLicenseRequest(values);

    if (isEdit && license) {
      await updateDriverLicense.mutateAsync({
        licenseId: license.licenseId,
        data: payload,
      });
      toast.success("Cập nhật GPLX thành công");
    } else {
      await createDriverLicense.mutateAsync({
        driverId,
        data: payload,
      });
      toast.success("Tạo GPLX thành công");
    }

    onOpenChange(false);
  };

  const licenseForm = useDriverLicenseForm({
    license,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa GPLX" : "Thêm GPLX"}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin bằng lái theo cấu trúc DriverLicenses của BE.
          </DialogDescription>
        </DialogHeader>

        <DriverLicenseForm
          form={licenseForm.form}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={licenseForm.handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DriverLicenseDialog;
