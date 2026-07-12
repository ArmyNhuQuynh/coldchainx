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
  UserStatusFormSchema,
  type TUserProfile,
  type TUserStatusFormValues,
} from "@/schemas/user.schema";
import {
  USER_STATUS_OPTIONS,
  toUserStatusRequest,
} from "@/types/enums/user-status.enum";
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

const UserStatusDialog = ({ open, onOpenChange, user }: Props) => {
  const { changeUserStatus } = useUser();
  const form = useForm<TUserStatusFormValues>({
    resolver: zodResolver(UserStatusFormSchema),
    defaultValues: { status: toUserStatusRequest(user.status) },
  });

  useEffect(() => {
    if (open) form.reset({ status: toUserStatusRequest(user.status) });
  }, [form, open, user.status]);

  const handleSubmit = async (values: TUserStatusFormValues) => {
    try {
      await changeUserStatus.mutateAsync({
        id: user.userId,
        data: { status: values.status },
      });
      toast.success("Cập nhật trạng thái thành công");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh trạng thái</DialogTitle>
          <DialogDescription>
            Kích hoạt hoặc tạm ngừng tài khoản {user.email || user.username}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <UserSelectField
              control={form.control}
              name="status"
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              options={USER_STATUS_OPTIONS}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={changeUserStatus.isPending}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={changeUserStatus.isPending}>
                {changeUserStatus.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu trạng thái
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserStatusDialog;
