import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import type { TServiceCatalog } from "@/schemas/service-catalog.schema";

type Props = {
  services: TServiceCatalog[];
  isLoading: boolean;
  onEdit: (service: TServiceCatalog) => void;
};

const ServiceCatalogTable = ({ services, isLoading, onEdit }: Props) => (
  <div className="overflow-hidden rounded-md border bg-background">
    <Table>
      <TableHeader className="bg-muted/60">
        <TableRow>
          <TableHead>Dịch vụ</TableHead>
          <TableHead className="text-right">Giá mặc định</TableHead>
          <TableHead className="text-center">Loại</TableHead>
          <TableHead className="text-center">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              Đang tải bảng giá dịch vụ...
            </TableCell>
          </TableRow>
        )}

        {!isLoading && services.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              Chưa có dịch vụ nào.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          services.map((service) => (
            <TableRow
              key={service.serviceCatalogId}
              className="cursor-pointer"
              tabIndex={0}
              onClick={() => onEdit(service)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onEdit(service);
                }
              }}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{service.serviceName}</span>
                    <Badge variant="outline">{service.serviceCode}</Badge>
                  </div>
                  {service.description && (
                    <p className="max-w-xl text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatPrice(service.defaultPrice)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    service.isMandatory
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  }
                >
                  {service.isMandatory ? "Bắt buộc" : "Tùy chọn"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    service.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  }
                >
                  {service.isActive ? "Đang dùng" : "Ngừng dùng"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </div>
);

export default ServiceCatalogTable;
