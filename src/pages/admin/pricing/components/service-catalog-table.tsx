import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  services: TServiceCatalog[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (service: TServiceCatalog) => void;
  onDelete: (service: TServiceCatalog) => void;
};

const ServiceCatalogTable = ({
  services,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}: Props) => (
  <div className="overflow-hidden rounded-md border bg-background">
    <Table>
      <TableHeader className="bg-muted/60">
        <TableRow>
          <TableHead>Dịch vụ</TableHead>
          <TableHead className="text-right">Giá mặc định</TableHead>
          <TableHead className="text-center">Loại</TableHead>
          <TableHead className="text-center">Trạng thái</TableHead>
          <TableHead className="w-[150px] text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center text-muted-foreground"
            >
              Đang tải bảng giá dịch vụ...
            </TableCell>
          </TableRow>
        )}

        {!isLoading && services.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center text-muted-foreground"
            >
              Chưa có dịch vụ nào.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          services.map((service) => (
            <TableRow key={service.serviceCatalogId}>
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
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() => onDelete(service)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </div>
);

export default ServiceCatalogTable;
