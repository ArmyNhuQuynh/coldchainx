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
import { handleApiError } from "@/lib/error";
import envConfig from "@/schemas/config.schema";
import { useDriver } from "@/hooks/use-driver";
import { API_SUFFIX } from "@/apis/util.api";
import { Download, FileUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ImportType = "drivers" | "driver-licenses";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ImportType;
};

const importCopy: Record<
  ImportType,
  {
    title: string;
    description: string;
    templateName: string;
    success: string;
  }
> = {
  drivers: {
    title: "Import tài xế",
    description:
      "Tải lên file theo mẫu của BE để tạo hoặc cập nhật nhiều hồ sơ tài xế.",
    templateName: "drivers",
    success: "Import tài xế hoàn tất",
  },
  "driver-licenses": {
    title: "Import GPLX",
    description:
      "Tải lên file theo mẫu của BE để cập nhật bằng lái theo CCCD tài xế.",
    templateName: "driver-licenses",
    success: "Import GPLX hoàn tất",
  },
};

const DriverImportDialog = ({ open, onOpenChange, type }: Props) => {
  const { importDrivers, importDriverLicenses } = useDriver();
  const [file, setFile] = useState<File | null>(null);
  const copy = importCopy[type];
  const isSubmitting =
    type === "drivers" ? importDrivers.isPending : importDriverLicenses.isPending;
  const templateUrl = `${envConfig.VITE_API_BASE_URL}${API_SUFFIX.IMPORT_TEMPLATES_API}/${copy.templateName}`;

  const handleSubmit = async () => {
    if (!file || isSubmitting) return;

    try {
      const response =
        type === "drivers"
          ? await importDrivers.mutateAsync(file)
          : await importDriverLicenses.mutateAsync(file);

      const result = response.data;
      toast.success(
        `${copy.success}: thêm ${result.inserted}, cập nhật ${result.updated}, bỏ qua ${result.skipped}`
      );

      if (result.errors?.length) {
        toast.warning(`Có ${result.errors.length} dòng cần kiểm tra lại`);
      }

      setFile(null);
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <a
            href={templateUrl}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Tải file mẫu
          </a>

          <div className="rounded-2xl border bg-muted/30 p-4">
            <label className="mb-2 block text-sm font-medium">
              File import
            </label>
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="h-11 rounded-xl bg-background"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file && (
              <p className="mt-2 text-sm text-muted-foreground">
                Đã chọn: <span className="font-medium">{file.name}</span>
              </p>
            )}
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
            disabled={!file || isSubmitting}
            onClick={handleSubmit}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang import..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DriverImportDialog;
