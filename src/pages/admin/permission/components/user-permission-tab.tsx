import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermission } from "@/hooks/use-permission";
import { useUser } from "@/hooks/use-user";
import { handleApiError } from "@/lib/error";
import type {
  TPermission,
  TRolePermissionMatrix,
  TUpsertUserPermissionRequest,
  TUserPermission,
} from "@/schemas/permission.schema";
import type { TUserProfile } from "@/schemas/user.schema";
import {
  PERMISSION_EFFECT,
  getPermissionEffectLabel,
  type TPermissionEffect,
} from "@/types/enums/permission-effect.enum";
import { getUserRoleLabel } from "@/types/enums/user-role.enum";
import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getPermissionDescription,
  getPermissionLabel,
  getPermissionModuleLabel,
  groupPermissionsByModule,
  isAdminPermissionRole,
} from "../permission.utils";
import UserPermissionDialog from "./user-permission-dialog";

type Props = {
  matrix: TRolePermissionMatrix;
};

const UserPermissionTab = ({ matrix }: Props) => {
  const { getUsers } = useUser();
  const {
    getUserPermissions,
    upsertUserPermission,
    revokeUserPermission,
  } = usePermission();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [selectedUser, setSelectedUser] = useState<TUserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<TPermission | null>(null);
  const [selectedOverride, setSelectedOverride] =
    useState<TUserPermission | null>(null);
  const [defaultEffect, setDefaultEffect] = useState<TPermissionEffect>(
    PERMISSION_EFFECT.ALLOW
  );

  const usersQuery = getUsers({
    page: 1,
    pageSize: 30,
    search: deferredSearch || undefined,
    sortBy: "fullname",
    order: "asc",
  });
  const users = usersQuery.data?.data.items ?? [];
  const permissionsQuery = getUserPermissions(selectedUser?.userId);
  const effectivePermissions = permissionsQuery.data?.data;
  const activePermissions = useMemo(
    () => matrix.permissions.filter((permission) => permission.isActive),
    [matrix.permissions]
  );
  const permissionGroups = useMemo(
    () => groupPermissionsByModule(activePermissions),
    [activePermissions]
  );
  const role = matrix.roles.find(
    (item) =>
      item.name.trim().toLowerCase() ===
      effectivePermissions?.role?.trim().toLowerCase()
  );
  const rolePermissionIds = new Set(role?.permissionIds ?? []);
  const effectiveCodes = new Set(effectivePermissions?.permissionCodes ?? []);
  const activeOverrides = new Map(
    (effectivePermissions?.userOverrides ?? [])
      .filter((override) => !override.revokedAt)
      .map((override) => [override.permissionId, override])
  );
  const selectedUserIsAdmin = isAdminPermissionRole(effectivePermissions?.role);
  const isMutationPending =
    upsertUserPermission.isPending || revokeUserPermission.isPending;

  const openPermissionDialog = (permission: TPermission) => {
    const override = activeOverrides.get(permission.id) ?? null;
    setSelectedPermission(permission);
    setSelectedOverride(override);
    setDefaultEffect(
      override?.effect === PERMISSION_EFFECT.DENY
        ? PERMISSION_EFFECT.DENY
        : override?.effect === PERMISSION_EFFECT.ALLOW
          ? PERMISSION_EFFECT.ALLOW
          : rolePermissionIds.has(permission.id)
            ? PERMISSION_EFFECT.DENY
            : PERMISSION_EFFECT.ALLOW
    );
    setDialogOpen(true);
  };

  const saveOverride = async (data: TUpsertUserPermissionRequest) => {
    if (!selectedUser || !selectedPermission) return;
    try {
      const response = await upsertUserPermission.mutateAsync({
        userId: selectedUser.userId,
        permissionId: selectedPermission.id,
        data,
      });
      toast.success(response.message || "Đã lưu quyền riêng của user");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const revokeOverride = async () => {
    if (!selectedUser || !selectedPermission || !selectedOverride) return;
    try {
      const response = await revokeUserPermission.mutateAsync({
        userId: selectedUser.userId,
        permissionId: selectedPermission.id,
      });
      toast.success(response.message || "Đã gỡ quyền ngoại lệ");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  return (
    <>
      <div className="grid min-h-[620px] gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="rounded-lg">
          <CardHeader className="border-b p-4">
            <div className="font-semibold">Chọn người dùng</div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                className="pl-9"
                placeholder="Tìm tên, email..."
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[540px]">
              <div className="space-y-1 p-2">
                {usersQuery.isLoading && (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    Đang tải người dùng...
                  </p>
                )}
                {usersQuery.isError && (
                  <p className="p-4 text-center text-sm text-rose-700">
                    Không tải được danh sách người dùng.
                  </p>
                )}
                {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 && (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    Không tìm thấy người dùng.
                  </p>
                )}
                {users.map((user) => (
                  <button
                    key={user.userId}
                    type="button"
                    className={`w-full rounded-md border px-3 py-3 text-left transition-colors ${
                      selectedUser?.userId === user.userId
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-border hover:bg-muted/40"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <span className="block truncate text-sm font-medium">
                      {user.fullName}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user.email || user.username}
                    </span>
                    <span className="mt-1 block text-xs">
                      {getUserRoleLabel(user.role)}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="min-w-0 rounded-lg">
          {!selectedUser ? (
            <div className="flex min-h-[620px] items-center justify-center p-6 text-center">
              <div>
                <p className="font-semibold">Chọn người dùng để xem quyền</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quyền riêng chỉ dùng để cấp hoặc chặn ngoại lệ so với role.
                </p>
              </div>
            </div>
          ) : permissionsQuery.isLoading ? (
            <div className="flex min-h-[620px] items-center justify-center text-sm text-muted-foreground">
              Đang tải quyền của người dùng...
            </div>
          ) : permissionsQuery.isError || !effectivePermissions ? (
            <div className="flex min-h-[620px] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-semibold text-rose-700">
                Không tải được quyền của người dùng
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void permissionsQuery.refetch()}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <CardHeader className="border-b px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{selectedUser.fullName}</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email || selectedUser.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {getUserRoleLabel(effectivePermissions.role)}
                    </Badge>
                    <Badge variant="outline">
                      {effectivePermissions.permissionCodes.length} quyền hiệu lực
                    </Badge>
                  </div>
                </div>
                {selectedUserIsAdmin && (
                  <p className="mt-3 rounded-md border border-amber-300 px-3 py-2 text-sm text-amber-800">
                    Quyền Admin là cố định và không thể đặt ngoại lệ.
                  </p>
                )}
              </CardHeader>
              <CardContent className="divide-y p-0">
                {Object.entries(permissionGroups).map(([module, permissions]) => (
                  <section key={module} className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold">
                        {getPermissionModuleLabel(module)}
                      </h3>
                    </div>
                    <div className="overflow-hidden rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quyền</TableHead>
                            <TableHead className="w-28">Theo role</TableHead>
                            <TableHead className="w-28">Hiệu lực</TableHead>
                            <TableHead className="w-32">Ngoại lệ</TableHead>
                            <TableHead className="w-28 text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {permissions.map((permission) => {
                            const inherited = rolePermissionIds.has(permission.id);
                            const effective = effectiveCodes.has(permission.code);
                            const override = activeOverrides.get(permission.id);
                            return (
                              <TableRow key={permission.id}>
                                <TableCell>
                                  <p className="text-sm font-medium">
                                    {getPermissionLabel(permission)}
                                  </p>
                                  <p className="break-all text-xs text-muted-foreground">
                                    Mã quyền: {permission.code}
                                  </p>
                                  {getPermissionDescription(permission) && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {getPermissionDescription(permission)}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {inherited ? "Có" : "Không"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      effective
                                        ? "border-emerald-300 text-emerald-700"
                                        : "border-slate-300 text-slate-600"
                                    }
                                  >
                                    {effective ? "Cho phép" : "Không"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {override ? (
                                    <Badge
                                      variant="outline"
                                      className={
                                        override.effect === PERMISSION_EFFECT.DENY
                                          ? "border-rose-300 text-rose-700"
                                          : "border-sky-300 text-sky-700"
                                      }
                                    >
                                      {getPermissionEffectLabel(override.effect)}
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedUserIsAdmin}
                                    onClick={() => openPermissionDialog(permission)}
                                  >
                                    {override ? "Sửa" : "Thiết lập"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </section>
                ))}
              </CardContent>
            </>
          )}
        </Card>
      </div>

      <UserPermissionDialog
        open={dialogOpen}
        permission={selectedPermission}
        override={selectedOverride}
        defaultEffect={defaultEffect}
        isPending={isMutationPending}
        onOpenChange={setDialogOpen}
        onSave={saveOverride}
        onRevoke={revokeOverride}
      />
    </>
  );
};

export default UserPermissionTab;
