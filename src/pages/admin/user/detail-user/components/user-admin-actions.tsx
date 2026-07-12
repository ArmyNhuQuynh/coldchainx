import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TUserProfile } from "@/schemas/user.schema";
import { isWarehouseOperatorRole } from "@/types/enums/user-role.enum";
import { KeyRound, ShieldCheck, UserCog, Warehouse } from "lucide-react";
import { useState } from "react";
import UserPasswordDialog from "./user-password-dialog";
import UserRoleDialog from "./user-role-dialog";
import UserStatusDialog from "./user-status-dialog";
import UserWarehouseDialog from "./user-warehouse-dialog";

type Props = {
  user: TUserProfile;
};

const UserAdminActions = ({ user }: Props) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const canManageWarehouse =
    isWarehouseOperatorRole(user.role) ||
    !!user.warehouseId ||
    !!user.warehouseName;

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
          {canManageWarehouse && (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-xl"
              onClick={() => setWarehouseOpen(true)}
            >
              <Warehouse className="mr-2 h-4 w-4" />
              Chỉnh sửa kho
            </Button>
          )}
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
      {canManageWarehouse && (
        <UserWarehouseDialog
          open={warehouseOpen}
          onOpenChange={setWarehouseOpen}
          user={user}
        />
      )}
    </>
  );
};

export default UserAdminActions;
