import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDriverForm } from "@/hooks/use-driver-form";
import { useDriver } from "@/hooks/use-driver";
import {
  toDriverCreateRequest,
  toDriverUpdateRequest,
  type DriverFormMode,
} from "@/schemas/driver.mapper";
import type { TDriver, TDriverFormValues } from "@/schemas/driver.schema";
import { toast } from "sonner";
import DriverForm from "./driver-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DriverFormMode;
  driver?: TDriver;
  onCreated?: (driver: TDriver) => void;
};

const DriverUpsertDialog = ({
  open,
  onOpenChange,
  mode,
  driver,
  onCreated,
}: Props) => {
  const { createDriver, updateDriver } = useDriver();
  const isCreate = mode === "create";
  const isSubmitting = createDriver.isPending || updateDriver.isPending;

  const handleSubmit = async (values: TDriverFormValues) => {
    if (isCreate) {
      const response = await createDriver.mutateAsync(
        toDriverCreateRequest(values)
      );
      toast.success("Tạo tài xế thành công");
      onCreated?.(response.data);
    } else if (driver) {
      await updateDriver.mutateAsync({
        id: driver.driverId,
        data: toDriverUpdateRequest(values, driver.status),
      });
      toast.success("Cập nhật tài xế thành công");
    }

    onOpenChange(false);
  };

  const driverForm = useDriverForm({
    mode,
    driver,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Thêm tài xế" : "Chỉnh sửa tài xế"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Tạo hồ sơ tài xế mới theo API Fleet hiện tại."
              : "Cập nhật hồ sơ vận hành của tài xế."}
          </DialogDescription>
        </DialogHeader>

        <DriverForm
          mode={mode}
          form={driverForm.form}
          driverStatus={driver?.status}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={driverForm.handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DriverUpsertDialog;
