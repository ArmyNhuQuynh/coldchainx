import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TUserProfile } from "@/schemas/user.schema";
import { KeyRound, ShieldCheck, UserCog } from "lucide-react";
import { useState } from "react";
import UserPasswordDialog from "./user-password-dialog";
import UserRoleDialog from "./user-role-dialog";
import UserStatusDialog from "./user-status-dialog";

type Props = {
  user: TUserProfile;
};

const UserAdminActions = ({ user }: Props) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Thao tác quản trị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={() => setRoleOpen(true)}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Chỉnh sửa role
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={() => setStatusOpen(true)}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Chỉnh sửa trạng thái
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={() => setPasswordOpen(true)}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Đặt lại mật khẩu
          </Button>
        </CardContent>
      </Card>

      <UserRoleDialog open={roleOpen} onOpenChange={setRoleOpen} user={user} />
      <UserStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        user={user}
      />
      <UserPasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        user={user}
      />
    </>
  );
};

export default UserAdminActions;

