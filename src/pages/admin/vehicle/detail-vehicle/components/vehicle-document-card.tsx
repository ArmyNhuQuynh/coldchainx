import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TVehicleDocument } from "@/schemas/vehicle.schema";
import { Calendar, FileText } from "lucide-react";

type Props = {
  documents: TVehicleDocument[];
};

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const getDocumentTypeLabel = (type: string) => {
  switch (type) {
    case "REGISTRATION":
      return "Đăng ký/đăng kiểm";
    case "INSURANCE":
      return "Bảo hiểm";
    case "CITY_PERMIT":
      return "Giấy phép vào phố";
    case "FOOD_SAFETY":
      return "An toàn thực phẩm";
    default:
      return type;
  }
};

const VehicleDocumentCard = ({ documents }: Props) => {
  if (documents.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2 text-lg font-semibold">Giấy tờ xe</CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {documents.map((document) => (
            <div key={document.docId} className="space-y-2 rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4 text-primary" />
                  {getDocumentTypeLabel(document.documentType)}
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDocumentCard;
