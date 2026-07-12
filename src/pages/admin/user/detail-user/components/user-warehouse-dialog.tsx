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
import { useWarehouse } from "@/hooks/use-warehouse";
import {
  UserWarehouseFormSchema,
  type TUserProfile,
  type TUserWarehouseFormValues,
} from "@/schemas/user.schema";
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

const UserWarehouseDialog = ({ open, onOpenChange, user }: Props) => {
  const { changeUserWarehouse } = useUser();
  const { getWarehouses } = useWarehouse();
  const { data: warehouses = [], isLoading: isLoadingWarehouses } =
    getWarehouses();

  const form = useForm<TUserWarehouseFormValues>({
    resolver: zodResolver(UserWarehouseFormSchema),
    defaultValues: { warehouseId: user.warehouseId || "" },
  });

  const warehouseOptions = warehouses.map((warehouse) => ({
    label: warehouse.label || warehouse.warehouseName,
    value: warehouse.warehouseId,
  }));

  useEffect(() => {
    if (open) {
      form.reset({ warehouseId: user.warehouseId || "" });
    }
  }, [form, open, user.warehouseId]);

  const handleSubmit = async (values: TUserWarehouseFormValues) => {
    try {
      await changeUserWarehouse.mutateAsync({
        id: user.userId,
        data: { warehouseId: values.warehouseId },
      });
      toast.success("Cập nhật kho làm việc thành công");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const isSubmitting = changeUserWarehouse.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh kho làm việc</DialogTitle>
          <DialogDescription>
            Cập nhật kho đang phụ trách cho {user.fullName || user.username}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <UserSelectField
              control={form.control}
              name="warehouseId"
              label="Kho làm việc"
              placeholder={isLoadingWarehouses ? "Đang tải kho..." : "Chọn kho"}
              options={warehouseOptions}
              disabled={isLoadingWarehouses || isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingWarehouses}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu kho
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserWarehouseDialog;
