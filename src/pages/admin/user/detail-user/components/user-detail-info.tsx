import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TUserProfile } from "@/schemas/user.schema";
import { formatUserDate } from "../../components/user-formatters";
import {
  getUserRoleClassName,
  getUserRoleLabel,
} from "@/types/enums/user-role.enum";
import { getUserStatusLabel } from "@/types/enums/user-status.enum";
import {
  CalendarClock,
  Mail,
  Shield,
  User,
  UserCircle,
  UserRoundCheck,
} from "lucide-react";

type Props = {
  user: TUserProfile;
};

type InfoRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
};

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 rounded-lg border bg-background/60 p-4">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  </div>
);

const UserDetailInfo = ({ user }: Props) => {
  const status = getUserStatusLabel(user.status);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <InfoRow icon={User} label="Họ tên" value={user.fullName || "—"} />
        <InfoRow
          icon={UserCircle}
          label="Username"
          value={user.username || "—"}
        />
        <InfoRow icon={Mail} label="Email" value={user.email || "—"} />
        <InfoRow
          icon={Shield}
          label="Role"
          value={
            <Badge className={getUserRoleClassName(user.role)}>
              {getUserRoleLabel(user.role)}
            </Badge>
          }
        />
        <InfoRow
          icon={UserRoundCheck}
          label="Trạng thái"
          value={<Badge className={status.className}>{status.label}</Badge>}
        />
        <InfoRow
          icon={CalendarClock}
          label="Ngày tạo"
          value={formatUserDate(user.createdAt)}
        />
        <InfoRow
          icon={CalendarClock}
          label="Cập nhật cuối"
          value={formatUserDate(user.updatedAt)}
        />
      </CardContent>
    </Card>
  );
};

export default UserDetailInfo;
