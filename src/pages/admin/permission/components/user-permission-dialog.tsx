import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  UpsertUserPermissionRequestSchema,
  type TPermission,
  type TUpsertUserPermissionRequest,
  type TUserPermission,
} from "@/schemas/permission.schema";
import {
  PERMISSION_EFFECT,
  PERMISSION_EFFECT_OPTIONS,
  type TPermissionEffect,
} from "@/types/enums/permission-effect.enum";
import { useEffect, useState } from "react";
import {
  getPermissionDescription,
  getPermissionLabel,
} from "../permission.utils";

type Props = {
  open: boolean;
  permission: TPermission | null;
  override?: TUserPermission | null;
  defaultEffect: TPermissionEffect;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TUpsertUserPermissionRequest) => Promise<void>;
  onRevoke: () => Promise<void>;
};

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const toIsoDate = (value: string) =>
  value ? new Date(value).toISOString() : null;

const UserPermissionDialog = ({
  open,
  permission,
  override,
  defaultEffect,
  isPending,
  onOpenChange,
  onSave,
  onRevoke,
}: Props) => {
  const [effect, setEffect] = useState<TPermissionEffect>(defaultEffect);
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [reason, setReason] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setEffect(
      override?.effect === PERMISSION_EFFECT.DENY
        ? PERMISSION_EFFECT.DENY
        : override?.effect === PERMISSION_EFFECT.ALLOW
          ? PERMISSION_EFFECT.ALLOW
          : defaultEffect
    );
    setValidFrom(toDateTimeLocal(override?.validFrom));
    setValidTo(toDateTimeLocal(override?.validTo));
    setReason(override?.reason ?? "");
    setValidationMessage("");
  }, [defaultEffect, open, override]);

  const handleSave = async () => {
    const parsed = UpsertUserPermissionRequestSchema.safeParse({
      effect,
      validFrom: toIsoDate(validFrom),
      validTo: toIsoDate(validTo),
      reason,
    });

    if (!parsed.success) {
      setValidationMessage(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
      return;
    }

    try {
      await onSave(parsed.data);
      onOpenChange(false);
    } catch {
      // API error is displayed by the parent handler.
    }
  };

  const handleRevoke = async () => {
    try {
      await onRevoke();
      onOpenChange(false);
    } catch {
      // API error is displayed by the parent handler.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thiết lập quyền riêng</DialogTitle>
          <DialogDescription>
            Quyền riêng được ưu tiên cao hơn quyền mặc định của role.
          </DialogDescription>
        </DialogHeader>

        {permission && (
          <div className="rounded-md border px-3 py-2">
            <p className="font-medium">{getPermissionLabel(permission)}</p>
            <p className="break-all text-xs text-muted-foreground">
              Mã quyền: {permission.code}
            </p>
            {getPermissionDescription(permission) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {getPermissionDescription(permission)}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Hiệu lực</Label>
            <Select
              value={effect}
              onValueChange={(value) => setEffect(value as TPermissionEffect)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERMISSION_EFFECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="permission-valid-from">Bắt đầu</Label>
            <Input
              id="permission-valid-from"
              type="datetime-local"
              value={validFrom}
              onChange={(event) => setValidFrom(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="permission-valid-to">Kết thúc</Label>
            <Input
              id="permission-valid-to"
              type="datetime-local"
              value={validTo}
              onChange={(event) => setValidTo(event.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="permission-reason">Lý do</Label>
            <Textarea
              id="permission-reason"
              value={reason}
              placeholder="Nhập lý do cấp hoặc chặn quyền..."
              onChange={(event) => setReason(event.target.value)}
            />
            {validationMessage && (
              <p className="text-sm text-rose-700">{validationMessage}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <div>
            {override && !override.revokedAt && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleRevoke}
              >
                Gỡ ngoại lệ
              </Button>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="button" disabled={isPending} onClick={handleSave}>
              {isPending ? "Đang lưu..." : "Lưu ngoại lệ"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionDialog;
