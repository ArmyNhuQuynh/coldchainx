import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServiceCatalog } from "@/hooks/use-service-catalog";
import { handleApiError } from "@/lib/error";
import {
  ServiceCatalogFormSchema,
  type TServiceCatalog,
} from "@/schemas/service-catalog.schema";
import { CirclePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import ServiceCatalogDialog from "./service-catalog-dialog";
import {
  collectServiceCatalogFormErrors,
  EMPTY_SERVICE_CATALOG_FORM,
  parseServiceCatalogForm,
  toServiceCatalogFormState,
  type ServiceCatalogFormErrors,
  type ServiceCatalogFormState,
} from "./service-catalog-form.utils";
import ServiceCatalogTable from "./service-catalog-table";

const ServicePricingTab = () => {
  const {
    getServiceCatalogs,
    createServiceCatalog,
    updateServiceCatalog,
    deleteServiceCatalog,
  } = useServiceCatalog();
  const servicesQuery = getServiceCatalogs();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<TServiceCatalog | null>(
    null
  );
  const [deletingService, setDeletingService] = useState<TServiceCatalog | null>(
    null
  );
  const [formValues, setFormValues] = useState<ServiceCatalogFormState>(
    EMPTY_SERVICE_CATALOG_FORM
  );
  const [formErrors, setFormErrors] = useState<ServiceCatalogFormErrors>({});

  const services = useMemo(
    () =>
      [...(servicesQuery.data?.data ?? [])].sort((left, right) =>
        left.serviceCode.localeCompare(right.serviceCode)
      ),
    [servicesQuery.data?.data]
  );

  const activeCount = services.filter((service) => service.isActive).length;
  const mandatoryCount = services.filter((service) => service.isMandatory).length;
  const isSubmitting =
    createServiceCatalog.isPending || updateServiceCatalog.isPending;

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    setFormValues(EMPTY_SERVICE_CATALOG_FORM);
    setFormErrors({});
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setFormValues(EMPTY_SERVICE_CATALOG_FORM);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (service: TServiceCatalog) => {
    setEditingService(service);
    setFormValues(toServiceCatalogFormState(service));
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
      return;
    }
    if (!isSubmitting) resetDialog();
  };

  const handleFieldChange = (
    field: keyof ServiceCatalogFormState,
    value: string | boolean
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const rawValues = parseServiceCatalogForm(formValues);
    if (Number.isNaN(rawValues.defaultPrice)) {
      setFormErrors({ defaultPrice: "Vui lòng nhập giá mặc định" });
      return;
    }

    const parsed = ServiceCatalogFormSchema.safeParse(rawValues);
    if (!parsed.success) {
      setFormErrors(collectServiceCatalogFormErrors(parsed.error.issues));
      return;
    }

    try {
      if (editingService) {
        const { serviceCode: _serviceCode, ...updatePayload } = parsed.data;
        await updateServiceCatalog.mutateAsync({
          id: editingService.serviceCatalogId,
          data: updatePayload,
        });
        toast.success("Cập nhật giá dịch vụ thành công");
      } else {
        await createServiceCatalog.mutateAsync(parsed.data);
        toast.success("Thêm giá dịch vụ thành công");
      }
      resetDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;

    try {
      await deleteServiceCatalog.mutateAsync(deletingService.serviceCatalogId);
      toast.success("Xóa giá dịch vụ thành công");
      setDeletingService(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Tổng dịch vụ" value={services.length} />
        <SummaryCard label="Đang dùng" value={activeCount} />
        <SummaryCard label="Bắt buộc" value={mandatoryCount} />
      </div>

      <Card className="rounded-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Giá dịch vụ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quản lý phụ phí, dịch vụ mặc định và trạng thái sử dụng trong báo giá.
              </p>
            </div>
            <Button className="rounded-md" onClick={openCreateDialog}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ServiceCatalogTable
            services={services}
            isLoading={servicesQuery.isFetching}
            isDeleting={deleteServiceCatalog.isPending}
            onEdit={openEditDialog}
            onDelete={setDeletingService}
          />
        </CardContent>
      </Card>

      <ServiceCatalogDialog
        open={dialogOpen}
        editingService={editingService}
        formValues={formValues}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        onOpenChange={handleDialogOpenChange}
        onFieldChange={handleFieldChange}
        onCancel={resetDialog}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa giá dịch vụ?</DialogTitle>
            <DialogDescription>
              Dịch vụ {deletingService?.serviceName} sẽ bị xóa khỏi danh mục giá.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteServiceCatalog.isPending}
              onClick={() => setDeletingService(null)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteServiceCatalog.isPending}
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type SummaryCardProps = {
  label: string;
  value: number;
};

const SummaryCard = ({ label, value }: SummaryCardProps) => (
  <Card className="rounded-lg px-4 py-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </Card>
);

export default ServicePricingTab;
