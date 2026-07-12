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
  UserPasswordFormSchema,
  type TUserPasswordFormValues,
  type TUserProfile,
} from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserTextField } from "../../components/user-form-fields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TUserProfile;
};

const UserPasswordDialog = ({ open, onOpenChange, user }: Props) => {
  const { resetUserPassword } = useUser();
  const form = useForm<TUserPasswordFormValues>({
    resolver: zodResolver(UserPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [form, open]);

  const handleSubmit = async (values: TUserPasswordFormValues) => {
    try {
      await resetUserPassword.mutateAsync({
        id: user.userId,
        data: { newPassword: values.newPassword },
      });
      toast.success("Đặt lại mật khẩu thành công");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Cập nhật mật khẩu đăng nhập cho {user.email || user.username}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <UserTextField
              control={form.control}
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="@123@"
              type="password"
            />
            <UserTextField
              control={form.control}
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              placeholder="@123@"
              type="password"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={resetUserPassword.isPending}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={resetUserPassword.isPending}>
                {resetUserPassword.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Đặt lại mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserPasswordDialog;

