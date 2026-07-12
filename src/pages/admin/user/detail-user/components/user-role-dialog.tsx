import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { handleApiError } from "@/lib/error";
import { useUser } from "@/hooks/use-user";
import {
  UserRoleFormSchema,
  type TUserProfile,
  type TUserRoleFormValues,
} from "@/schemas/user.schema";
import {
  USER_ROLE,
  USER_ROLE_OPTIONS,
  normalizeUserRole,
} from "@/types/enums/user-role.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserSelectField } from "../../components/user-form-fields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TUserProfile;
};

const normalizeRoleValue = (role?: string | null) =>
  normalizeUserRole(role) || USER_ROLE.SALES;

const UserRoleDialog = ({ open, onOpenChange, user }: Props) => {
  const { changeUserRole } = useUser();
  const form = useForm<TUserRoleFormValues>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: { role: normalizeRoleValue(user.role) },
  });

  useEffect(() => {
    if (open) form.reset({ role: normalizeRoleValue(user.role) });
  }, [form, open, user.role]);

  const handleSubmit = async (values: TUserRoleFormValues) => {
    try {
      await changeUserRole.mutateAsync({
        id: user.userId,
        data: { role: values.role },
      });
      toast.success("Cập nhật role thành công");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh role</DialogTitle>
          <DialogDescription>
            Thay đổi quyền truy cập cho tài khoản {user.email || user.username}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <UserSelectField
              control={form.control}
              name="role"
              label="Role"
              placeholder="Chọn role"
              options={USER_ROLE_OPTIONS}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={changeUserRole.isPending}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={changeUserRole.isPending}>
                {changeUserRole.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu role
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
