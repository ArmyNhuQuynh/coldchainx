import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import type { TVehicleDocument } from "@/schemas/vehicle.schema";
import { getVehicleDocumentTypeLabel } from "@/types/enums/vehicle-document-type.enum";
import { Calendar, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import VehicleDocumentDialog from "./vehicle-document-dialog";

type Props = {
  vehicleId: string;
  documents: TVehicleDocument[];
};

const formatDate = (value: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const VehicleDocumentCard = ({ vehicleId, documents }: Props) => {
  const { getVehicleDocuments, deleteVehicleDocument } = useVehicle();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<TVehicleDocument | null>(null);
  const { data } = getVehicleDocuments(vehicleId);
  const vehicleDocuments = data?.data ?? documents ?? [];

  const openCreateDialog = () => {
    setEditingDocument(null);
    setDialogOpen(true);
  };

  const openEditDialog = (document: TVehicleDocument) => {
    setEditingDocument(document);
    setDialogOpen(true);
  };

  const handleDelete = async (document: TVehicleDocument) => {
    if (!window.confirm("Xóa giấy tờ xe này?")) return;

    try {
      await deleteVehicleDocument.mutateAsync({
        docId: document.docId,
        vehicleId,
      });
      toast.success("Đã xóa giấy tờ xe");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <div>
          <p className="text-lg font-semibold">Giấy tờ xe</p>
          <p className="text-sm text-muted-foreground">
            Quản lý đăng kiểm, bảo hiểm và giấy phép vận hành của xe.
          </p>
        </div>
        <Button className="rounded-xl" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giấy tờ
        </Button>
      </CardHeader>
      <CardContent>
        {vehicleDocuments.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            Chưa có giấy tờ xe.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {vehicleDocuments.map((document) => (
              <div key={document.docId} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4 text-primary" />
                    {getVehicleDocumentTypeLabel(document.documentType)}
                  </div>
                  {document.status && (
                    <Badge variant="outline">{document.status}</Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{document.documentNumber}</p>
                {document.issuer && (
                  <p className="text-sm text-muted-foreground">
                    Nơi cấp: {document.issuer}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Cấp: {formatDate(document.issueDate)}
                  </span>
                  <span>Hết hạn: {formatDate(document.expireDate)}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => openEditDialog(document)}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-destructive hover:text-destructive"
                    disabled={deleteVehicleDocument.isPending}
                    onClick={() => handleDelete(document)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <VehicleDocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicleId={vehicleId}
        document={editingDocument}
      />
    </Card>
  );
};

export default VehicleDocumentCard;
