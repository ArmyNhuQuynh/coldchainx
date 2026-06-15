import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TDriverLicense } from "@/schemas/driver.schema";
import { getDriverStatusLabel } from "@/types/enums/driver-status.enum";
import { Calendar, ExternalLink, FileText, IdCard } from "lucide-react";

type Props = {
  licenses: TDriverLicense[] | null;
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

const DriverLicenseCard = ({ licenses }: Props) => {
  if (!licenses?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Giấy phép lái xe
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {licenses.map((license) => {
            const status = hasValue(license.status)
              ? getDriverStatusLabel(license.status)
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
                  {status && <Badge className={status.className}>{status.label}</Badge>}
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

                {hasValue(license.documentUrl) && (
                  <a
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    href={license.documentUrl!}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText className="h-4 w-4" />
                    Xem tài liệu
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverLicenseCard;
