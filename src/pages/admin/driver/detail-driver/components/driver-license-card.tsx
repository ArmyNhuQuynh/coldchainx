import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { handleApiError } from "@/lib/error";
import { useDriver } from "@/hooks/use-driver";
import type { TDriverLicense } from "@/schemas/driver.schema";
import { Calendar, IdCard, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  driverId: string;
  licenses: TDriverLicense[] | null;
  onCreate: () => void;
  onEdit: (license: TDriverLicense) => void;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatDate = (value: string | null | undefined) => {
  if (!hasValue(value)) {
    return "—";
  }

  const date = new Date(value!);

  if (Number.isNaN(date.getTime())) {
    return value!;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getLicenseStatusLabel = (status: string | null | undefined) => {
  const normalized = status?.trim().toUpperCase();

  switch (normalized) {
    case "ACTIVE":
      return {
        label: "Còn hiệu lực",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case "EXPIRED":
      return {
        label: "Hết hạn",
        className: "border-red-200 bg-red-50 text-red-700",
      };
    case "WARNING":
      return {
        label: "Sắp hết hạn",
        className: "border-orange-200 bg-orange-50 text-orange-700",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
  }
};

const DriverLicenseCard = ({ driverId, licenses, onCreate, onEdit }: Props) => {
  const { deleteDriverLicense } = useDriver();

  const handleDelete = async (license: TDriverLicense) => {
    const confirmed = window.confirm(
      `Xóa GPLX ${license.licenseNumber}? Trạng thái tài xế sẽ được BE tính lại.`
    );

    if (!confirmed) return;

    try {
      await deleteDriverLicense.mutateAsync({
        licenseId: license.licenseId,
        driverId,
      });
      toast.success("Đã xóa GPLX");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <span className="font-semibold text-lg">Giấy phép lái xe</span>
        <Button type="button" className="rounded-xl" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm GPLX
        </Button>
      </CardHeader>
      <CardContent>
        {!licenses?.length && (
          <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Tài xế chưa có GPLX. Thêm GPLX để BE có thể đưa tài xế về trạng thái sẵn sàng.
          </div>
        )}

        <div className="space-y-4">
          {licenses?.map((license) => {
            const status = hasValue(license.status)
              ? getLicenseStatusLabel(license.status)
              : null;

            return (
              <div
                key={license.licenseId}
                className="rounded-xl border p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <IdCard className="h-4 w-4 text-primary" />
                      {license.licenseNumber || "Chưa có số GPLX"}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {license.licenseClass ? `Hạng ${license.licenseClass}` : "Chưa có hạng GPLX"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {status && <Badge className={status.className}>{status.label}</Badge>}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => onEdit(license)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-destructive hover:text-destructive"
                      disabled={deleteDriverLicense.isPending}
                      onClick={() => handleDelete(license)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày cấp:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(license.issueDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Hết hạn:{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(license.expiryDate)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverLicenseCard;
