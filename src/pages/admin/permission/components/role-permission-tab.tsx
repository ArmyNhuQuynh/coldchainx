import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermission } from "@/hooks/use-permission";
import { handleApiError } from "@/lib/error";
import type { TRolePermissionMatrix } from "@/schemas/permission.schema";
import { RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  arePermissionIdsEqual,
  getPermissionDescription,
  getPermissionLabel,
  getPermissionModuleLabel,
  groupPermissionsByModule,
  isAdminPermissionRole,
} from "../permission.utils";

type Props = {
  matrix: TRolePermissionMatrix;
};

const RolePermissionTab = ({ matrix }: Props) => {
  const { replaceRolePermissions } = usePermission();
  const activePermissions = useMemo(
    () => matrix.permissions.filter((permission) => permission.isActive),
    [matrix.permissions]
  );
  const activePermissionIds = useMemo(
    () => new Set(activePermissions.map((permission) => permission.id)),
    [activePermissions]
  );
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [draftPermissionIds, setDraftPermissionIds] = useState<Set<string>>(
    new Set()
  );

  const selectedRole = matrix.roles.find((role) => role.id === selectedRoleId);
  const rolePermissionIds = useMemo(
    () =>
      new Set(
        (selectedRole?.permissionIds ?? []).filter((permissionId) =>
          activePermissionIds.has(permissionId)
        )
      ),
    [activePermissionIds, selectedRole]
  );
  const isAdminRole = isAdminPermissionRole(selectedRole?.name);
  const isDirty = !arePermissionIdsEqual(
    draftPermissionIds,
    rolePermissionIds
  );
  const permissionGroups = useMemo(
    () => groupPermissionsByModule(activePermissions),
    [activePermissions]
  );

  useEffect(() => {
    if (!selectedRoleId || !matrix.roles.some((role) => role.id === selectedRoleId)) {
      setSelectedRoleId(
        matrix.roles.find((role) => !isAdminPermissionRole(role.name))?.id ??
          matrix.roles[0]?.id ??
          ""
      );
    }
  }, [matrix.roles, selectedRoleId]);

  useEffect(() => {
    setDraftPermissionIds(new Set(rolePermissionIds));
  }, [rolePermissionIds]);

  const handleRoleChange = (roleId: string) => {
    if (isDirty) {
      toast.info("Các thay đổi chưa lưu của role trước đã được hủy.");
    }
    setSelectedRoleId(roleId);
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    setDraftPermissionIds((current) => {
      const next = new Set(current);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const resetDraft = () => {
    setDraftPermissionIds(new Set(rolePermissionIds));
  };

  const saveRolePermissions = async () => {
    if (!selectedRole || isAdminRole || !isDirty) return;

    try {
      const response = await replaceRolePermissions.mutateAsync({
        roleId: selectedRole.id,
        data: { permissionIds: Array.from(draftPermissionIds) },
      });
      toast.success(response.message || "Đã cập nhật quyền của role");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-lg">
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full space-y-1.5 lg:max-w-sm">
            <p className="text-sm font-medium">Vai trò</p>
            <Select value={selectedRoleId} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn role cần phân quyền" />
              </SelectTrigger>
              <SelectContent>
                {matrix.roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {draftPermissionIds.size}/{activePermissions.length} quyền
            </Badge>
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || replaceRolePermissions.isPending}
              onClick={resetDraft}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Hoàn tác
            </Button>
            <Button
              type="button"
              disabled={
                isAdminRole || !isDirty || replaceRolePermissions.isPending
              }
              onClick={saveRolePermissions}
            >
              <Save className="mr-2 h-4 w-4" />
              {replaceRolePermissions.isPending ? "Đang lưu..." : "Lưu quyền"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAdminRole && (
        <div className="rounded-lg border border-amber-300 px-4 py-3 text-sm text-amber-800">
          Admin luôn có toàn bộ quyền đang hoạt động. BE không cho phép chỉnh sửa
          quyền của role này.
        </div>
      )}

      <Card className="rounded-lg">
        <CardHeader className="border-b px-5 py-4">
          <div className="font-semibold">Danh sách quyền</div>
          <p className="text-sm text-muted-foreground">
            Khi lưu, FE gửi lại toàn bộ danh sách quyền đang được chọn cho role.
          </p>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {Object.entries(permissionGroups).map(([module, permissions]) => (
            <section key={module} className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {getPermissionModuleLabel(module)}
                  </h3>
                </div>
                <Badge variant="outline">
                  {
                    permissions.filter((permission) =>
                      draftPermissionIds.has(permission.id)
                    ).length
                  }
                  /{permissions.length}
                </Badge>
              </div>

              <div className="grid gap-2 lg:grid-cols-2">
                {permissions.map((permission) => {
                  const checked = draftPermissionIds.has(permission.id);
                  return (
                    <label
                      key={permission.id}
                      className="flex min-h-20 cursor-pointer items-start gap-3 rounded-md border p-3 hover:border-primary/40"
                    >
                      <Checkbox
                        className="mt-0.5"
                        checked={checked}
                        disabled={isAdminRole || replaceRolePermissions.isPending}
                        onCheckedChange={(value) =>
                          togglePermission(permission.id, value === true)
                        }
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {getPermissionLabel(permission)}
                        </span>
                        <span className="block break-all text-xs text-muted-foreground">
                          Mã quyền: {permission.code}
                        </span>
                        {getPermissionDescription(permission) && (
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {getPermissionDescription(permission)}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionTab;
