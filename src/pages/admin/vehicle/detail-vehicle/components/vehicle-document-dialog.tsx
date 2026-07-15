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
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import {
  VehicleDocumentRequestSchema,
  VEHICLE_DOCUMENT_FORM_DEFAULTS,
  type TVehicleDocument,
  type TVehicleDocumentRequest,
} from "@/schemas/vehicle.schema";
import { VEHICLE_DOCUMENT_TYPE_OPTIONS } from "@/types/enums/vehicle-document-type.enum";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  document?: TVehicleDocument | null;
};

const toDateInput = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const getDefaultForm = (): TVehicleDocumentRequest => ({
  documentType: VEHICLE_DOCUMENT_FORM_DEFAULTS.documentType,
  documentNumber: "",
  issuer: null,
  issueDate: "",
  expireDate: null,
});

const VehicleDocumentDialog = ({
  open,
  onOpenChange,
  vehicleId,
  document,
}: Props) => {
  const { createVehicleDocument, updateVehicleDocument } = useVehicle();
  const [form, setForm] = useState<TVehicleDocumentRequest>(getDefaultForm);
  const isEdit = !!document;
  const isSubmitting =
    createVehicleDocument.isPending || updateVehicleDocument.isPending;

  useEffect(() => {
    if (!open) return;

    setForm(
      document
        ? {
            documentType: document.documentType,
            documentNumber: document.documentNumber,
            issuer: document.issuer ?? null,
            issueDate: toDateInput(document.issueDate),
            expireDate: toDateInput(document.expireDate) || null,
          }
        : getDefaultForm()
    );
  }, [document, open]);

  const updateField = <K extends keyof TVehicleDocumentRequest>(
    key: K,
    value: TVehicleDocumentRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const payload = {
      ...form,
      documentNumber: form.documentNumber.trim(),
      issuer: form.issuer?.trim() || null,
      expireDate: form.expireDate || null,
    };

    const parsed = VehicleDocumentRequestSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dữ liệu giấy tờ chưa hợp lệ");
      return;
    }

    try {
      if (isEdit && document) {
        await updateVehicleDocument.mutateAsync({
          docId: document.docId,
          data: parsed.data,
          vehicleId,
        });
        toast.success("Cập nhật giấy tờ xe thành công");
      } else {
        await createVehicleDocument.mutateAsync({
          vehicleId,
          data: parsed.data,
        });
        toast.success("Thêm giấy tờ xe thành công");
      }

      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa giấy tờ" : "Thêm giấy tờ xe"}
          </DialogTitle>
          <DialogDescription>
            Thông tin này được gắn trực tiếp với xe đang xem.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Loại giấy tờ</Label>
            <Select
              value={form.documentType}
              onValueChange={(value) => updateField("documentType", value)}
            >
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Số giấy tờ</Label>
            <Input
              className="h-11 rounded-xl bg-background"
              value={form.documentNumber}
              onChange={(event) => updateField("documentNumber", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nơi cấp</Label>
            <Input
              className="h-11 rounded-xl bg-background"
              value={form.issuer ?? ""}
              onChange={(event) => updateField("issuer", event.target.value || null)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày cấp</Label>
            <Input
              type="date"
              className="h-11 rounded-xl bg-background"
              value={form.issueDate}
              onChange={(event) => updateField("issueDate", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ngày hết hạn</Label>
            <Input
              type="date"
              className="h-11 rounded-xl bg-background"
              value={form.expireDate ?? ""}
              onChange={(event) => updateField("expireDate", event.target.value || null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu giấy tờ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDocumentDialog;
