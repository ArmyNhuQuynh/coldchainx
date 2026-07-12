import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TUserProfile } from "@/schemas/user.schema";
import {
  getUserRoleClassName,
  getUserRoleLabel,
} from "@/types/enums/user-role.enum";
import { getUserStatusLabel } from "@/types/enums/user-status.enum";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  user: TUserProfile;
};

const UserDetailHeader = ({ user }: Props) => {
  const navigate = useNavigate();
  const status = getUserStatusLabel(user.status);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Chi tiết User</h1>
          <span className="text-2xl font-bold text-primary">
            {user.fullName || user.username}
          </span>
          <Badge className={getUserRoleClassName(user.role)}>
            {getUserRoleLabel(user.role)}
          </Badge>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <p className="text-muted-foreground">
          {[user.username, user.email].filter(Boolean).join(" • ") || "—"}
        </p>
      </div>

      <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
    </div>
  );
};

export default UserDetailHeader;
