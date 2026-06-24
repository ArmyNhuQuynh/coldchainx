import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resolveFileUrl } from "@/lib/file-url";
import type { TDiscrepancyDetail } from "@/schemas/discrepancy.schema";
import { Download, FileWarning, ImageIcon } from "lucide-react";

type Props = {
  detail: TDiscrepancyDetail;
  pdfUrl?: string;
};

const splitEvidenceImages = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const DiscrepancyReceiptCard = ({ detail, pdfUrl }: Props) => {
  const receipt = detail.receiptInfo;
  const evidenceImages = splitEvidenceImages(detail.evidenceImageUrl);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
        <FileWarning className="h-5 w-5" />
        Biên bản sai lệch
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Mã biên bản</p>
            <p className="mt-1 text-sm font-semibold">
              {receipt?.receiptCode ?? "—"}
            </p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Kho nhận hàng</p>
            <p className="mt-1 text-sm font-semibold">
              {receipt?.warehouseName ?? "—"}
            </p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Nhân viên QC</p>
            <p className="mt-1 text-sm font-semibold">
              {receipt?.receiverName ?? "—"}
            </p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">LPN</p>
            <p className="mt-1 text-sm font-semibold">{detail.lpnCode}</p>
          </div>
        </div>

        <p className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {detail.discrepancyReason ?? "Sai lệch QC chưa có ghi chú."}
        </p>

        <div className="flex flex-wrap gap-2">
          {pdfUrl && (
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Tải biên bản PDF
              </a>
            </Button>
          )}
          {receipt?.pdfUrl && (
            <Button variant="ghost" asChild>
              <a
                href={resolveFileUrl(receipt.pdfUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <FileWarning className="mr-2 h-4 w-4" />
                Mở bản lưu
              </a>
            </Button>
          )}
        </div>

        {evidenceImages.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="h-4 w-4" />
              Ảnh QC
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {evidenceImages.map((imageUrl) => (
                <a
                  key={imageUrl}
                  href={resolveFileUrl(imageUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-md border bg-muted"
                >
                  <img
                    src={resolveFileUrl(imageUrl)}
                    alt="QC evidence"
                    className="aspect-square w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscrepancyReceiptCard;
