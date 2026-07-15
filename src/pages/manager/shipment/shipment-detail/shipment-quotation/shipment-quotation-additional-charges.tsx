import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceCatalog } from "@/hooks/use-service-catalog";
import { cn, formatPrice } from "@/lib/utils";
import type { TQuotationFormValues } from "@/schemas/quotation.schema";
import type { TServiceCatalog } from "@/schemas/service-catalog.schema";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<TQuotationFormValues>;
};

const ShipmentQuotationAdditionalCharges = ({ form }: Props) => {
  const { getActiveServiceCatalogs } = useServiceCatalog();
  const servicesQuery = getActiveServiceCatalogs();
  const selectedCharges = form.watch("additionalCharges") ?? [];
  const selectedIds = selectedCharges.map((charge) => charge.serviceCatalogId);

  const services = useMemo(
    () =>
      (servicesQuery.data?.data ?? [])
        .filter((service) => service.isActive && service.isMandatory)
        .sort((left, right) => left.serviceCode.localeCompare(right.serviceCode)),
    [servicesQuery.data?.data]
  );

  const toggleService = (serviceId: string, checked: boolean) => {
    const nextIds = checked
      ? Array.from(new Set([...selectedIds, serviceId]))
      : selectedIds.filter((id) => id !== serviceId);

    form.setValue(
      "additionalCharges",
      nextIds.map((serviceCatalogId) => ({ serviceCatalogId })),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold">Dịch vụ tính thêm</h3>
        <p className="text-sm text-muted-foreground">
          Chọn dịch vụ từ bảng giá hệ thống. BE sẽ tự lấy giá mặc định để cộng vào báo giá.
        </p>
      </div>

      {servicesQuery.isFetching && (
        <div className="rounded-md border px-3 py-5 text-center text-sm text-muted-foreground">
          Đang tải danh sách dịch vụ...
        </div>
      )}

      {!servicesQuery.isFetching && services.length === 0 && (
        <div className="rounded-md border px-3 py-5 text-center text-sm text-muted-foreground">
          Chưa có dịch vụ bắt buộc đang hoạt động.
        </div>
      )}

      {!servicesQuery.isFetching && services.length > 0 && (
        <div className="grid gap-2">
          {services.map((service) => (
            <ServiceOption
              key={service.serviceCatalogId}
              service={service}
              checked={selectedIds.includes(service.serviceCatalogId)}
              onCheckedChange={(checked) =>
                toggleService(service.serviceCatalogId, checked)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

type ServiceOptionProps = {
  service: TServiceCatalog;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const ServiceOption = ({
  service,
  checked,
  onCheckedChange,
}: ServiceOptionProps) => (
  <label
    className={cn(
      "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition hover:border-primary/60 hover:bg-muted/30",
      checked && "border-primary bg-primary/5"
    )}
  >
    <Checkbox
      checked={checked}
      className="mt-1"
      onCheckedChange={(value) => onCheckedChange(value === true)}
    />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="font-medium">{service.serviceName}</span>
          <Badge variant="outline">{service.serviceCode}</Badge>
        </div>
        <span className="font-semibold text-primary">
          {formatPrice(service.defaultPrice)}
        </span>
      </div>
      {service.description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {service.description}
        </p>
      )}
    </div>
  </label>
);

export default ShipmentQuotationAdditionalCharges;
