import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TDriver, TDriverLicense } from "@/schemas/driver.schema";
import {
  AtSign,
  Calendar,
  Fingerprint,
  Hash,
  IdCard,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  driver: TDriver;
};

type InfoRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
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

const compactRows = (rows: Array<InfoRowData | null>) =>
  rows.filter((row): row is InfoRowData => row !== null);

const getPrimaryLicense = (driver: TDriver): TDriverLicense | null =>
  driver.driverLicenses?.[0] ?? null;

const InfoRow = ({ icon: Icon, label, value }: InfoRowData) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="font-medium text-sm text-right">{value}</div>
  </div>
);

const InfoSection = ({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: InfoRowData[];
}) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        {title}
      </p>
      <div>{rows.map((row) => <InfoRow key={row.label} {...row} />)}</div>
    </div>
  );
};

const DriverDetailInfo = ({ driver }: Props) => {
  const primaryLicense = getPrimaryLicense(driver);
  const profileRows = compactRows([
    hasValue(driver.fullName)
      ? {
          icon: User,
          label: "Họ tên",
          value: <span className="text-primary font-semibold">{driver.fullName}</span>,
        }
      : null,
    hasValue(driver.username)
      ? { icon: AtSign, label: "Tài khoản", value: driver.username }
      : null,
    hasValue(driver.email)
      ? { icon: Mail, label: "Email", value: driver.email }
      : null,
    hasValue(driver.dateOfBirth)
      ? { icon: Calendar, label: "Ngày sinh", value: formatDate(driver.dateOfBirth) }
      : null,
    hasValue(driver.userId)
      ? { icon: Fingerprint, label: "Mã người dùng", value: driver.userId }
      : null,
  ]);

  const licenseRows = compactRows([
    hasValue(primaryLicense?.licenseNumber)
      ? {
          icon: IdCard,
          label: "Số GPLX",
          value: primaryLicense?.licenseNumber,
        }
      : null,
    hasValue(primaryLicense?.licenseClass)
      ? {
          icon: Hash,
          label: "Hạng GPLX",
          value: primaryLicense?.licenseClass,
        }
      : null,
    hasValue(primaryLicense?.issueDate)
      ? {
          icon: Calendar,
          label: "Ngày cấp",
          value: formatDate(primaryLicense?.issueDate),
        }
      : null,
    hasValue(primaryLicense?.expiryDate)
      ? {
          icon: Calendar,
          label: "Ngày hết hạn",
          value: formatDate(primaryLicense?.expiryDate),
        }
      : null,
  ]);

  if (profileRows.length === 0 && licenseRows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Thông tin tài xế
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InfoSection title="Hồ sơ" icon={User} rows={profileRows} />
          <InfoSection title="Giấy phép chính" icon={IdCard} rows={licenseRows} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverDetailInfo;
