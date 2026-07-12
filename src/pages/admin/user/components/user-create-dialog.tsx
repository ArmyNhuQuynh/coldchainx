import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleApiError } from "@/lib/error";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/hooks/use-user";
import { useWarehouse } from "@/hooks/use-warehouse";
import {
  USER_CREATE_FORM_DEFAULTS,
  UserCreateFormSchema,
  type TUserCreateFormValues,
} from "@/schemas/user.schema";
import { USER_ACCOUNT_TYPE } from "@/types/enums/user-account-type.enum";
import { USER_ROLE } from "@/types/enums/user-role.enum";
import { USER_STATUS_OPTIONS } from "@/types/enums/user-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UserRound, Warehouse } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserSelectField, UserTextField } from "./user-form-fields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (userId: string) => void;
};

const UserCreateDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const { createSaleUser } = useUser();
  const { createWarehouseWorkerMutation } = useAuth();
  const { getWarehouses } = useWarehouse();
  const { data: warehouses = [], isLoading: isLoadingWarehouses } =
    getWarehouses();
  const isSubmitting =
    createSaleUser.isPending || createWarehouseWorkerMutation.isPending;

  const form = useForm<TUserCreateFormValues>({
    resolver: zodResolver(UserCreateFormSchema),
    defaultValues: USER_CREATE_FORM_DEFAULTS,
  });

  const accountType = form.watch("accountType");
  const warehouseOptions = warehouses.map((warehouse) => ({
    label: warehouse.label || warehouse.warehouseName,
    value: warehouse.warehouseId,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(nextOpen);
      if (!nextOpen) form.reset(USER_CREATE_FORM_DEFAULTS);
    }
  };

  const handleSubmit = async (values: TUserCreateFormValues) => {
    try {
      if (values.accountType === USER_ACCOUNT_TYPE.SALES) {
        const email = values.email?.trim().toLowerCase() ?? "";
        const response = await createSaleUser.mutateAsync({
          fullName: values.fullName.trim(),
          email,
          password: values.password,
          phoneNumber: values.phoneNumber?.trim() || null,
          role: USER_ROLE.SALES,
          status: values.status,
        });

        toast.success("Tạo tài khoản Sale thành công");
        onCreated?.(response.data.userId);
      } else {
        const email = values.email?.trim().toLowerCase();
        const response = await createWarehouseWorkerMutation.mutateAsync({
          username: values.username!.trim(),
          password: values.password,
          fullName: values.fullName.trim(),
          email: email || null,
          phone: values.phoneNumber?.trim() || null,
          warehouseId: values.warehouseId!,
        });

        toast.success("Tạo tài khoản nhân viên kho thành công");
        if (response.data.userId) {
          onCreated?.(response.data.userId);
        }
      }

      handleOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản người dùng</DialogTitle>
          <DialogDescription>
            Chọn loại tài khoản trước khi tạo để FE gọi đúng API của BE.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <Tabs
              value={accountType}
              onValueChange={(value) =>
                form.setValue(
                  "accountType",
                  value as TUserCreateFormValues["accountType"],
                  { shouldValidate: true }
                )
              }
            >
              <TabsList className="grid w-full grid-cols-2 rounded-xl border bg-muted/30 p-1">
                <TabsTrigger
                  value={USER_ACCOUNT_TYPE.SALES}
                  className="gap-2 rounded-lg border-0 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <UserRound className="h-4 w-4" />
                  Sale
                </TabsTrigger>
                <TabsTrigger
                  value={USER_ACCOUNT_TYPE.WAREHOUSE}
                  className="gap-2 rounded-lg border-0 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Warehouse className="h-4 w-4" />
                  Warehouse
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-4 rounded-2xl border bg-card p-4 md:grid-cols-2">
              {accountType === USER_ACCOUNT_TYPE.WAREHOUSE && (
                <UserTextField
                  control={form.control}
                  name="username"
                  label="Tên đăng nhập"
                  placeholder="warehouse01"
                />
              )}
              <UserTextField
                control={form.control}
                name="fullName"
                label="Họ tên"
                placeholder="Nguyễn Văn A"
              />
              <UserTextField
                control={form.control}
                name="email"
                label={
                  accountType === USER_ACCOUNT_TYPE.WAREHOUSE
                    ? "Email (không bắt buộc)"
                    : "Email"
                }
                placeholder="user@example.com"
                type="email"
              />
              <UserTextField
                control={form.control}
                name="password"
                label="Mật khẩu"
                placeholder="@123@"
                type="password"
              />
              <UserTextField
                control={form.control}
                name="phoneNumber"
                label="Số điện thoại"
                placeholder="0909123456"
                type="tel"
              />
              {accountType === USER_ACCOUNT_TYPE.SALES && (
                <UserSelectField
                  control={form.control}
                  name="status"
                  label="Trạng thái"
                  placeholder="Chọn trạng thái"
                  options={USER_STATUS_OPTIONS}
                />
              )}
              {accountType === USER_ACCOUNT_TYPE.WAREHOUSE && (
                <UserSelectField
                  control={form.control}
                  name="warehouseId"
                  label="Kho làm việc"
                  placeholder={
                    isLoadingWarehouses ? "Đang tải kho..." : "Chọn kho"
                  }
                  options={warehouseOptions}
                  disabled={isLoadingWarehouses}
                />
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateDialog;
