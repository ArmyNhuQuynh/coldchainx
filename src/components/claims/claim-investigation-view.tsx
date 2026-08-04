import ClaimStatusBadge from "@/components/claims/claim-status-badge";
import FilePreview from "@/components/file-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TClaimInvestigation } from "@/schemas/claim.schema";

type Props = {
  investigation?: TClaimInvestigation;
  isLoading?: boolean;
};

const ClaimInvestigationView = ({ investigation, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton className="h-[460px] w-full" />;
  }

  if (!investigation) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        Không thể tải dữ liệu giám định.
      </div>
    );
  }

  const analysis = investigation.iotTemperatureAnalysis;

  return (
    <div className="space-y-5">
      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{investigation.claimCode}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Đơn {investigation.trackingCode || "—"} · {investigation.customerCompanyName || "—"}
              </p>
            </div>
            <ClaimStatusBadge status={investigation.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Loại khiếu nại</p>
            <p className="mt-1 font-medium">{investigation.claimType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trách nhiệm</p>
            <p className="mt-1 font-medium">{investigation.faultOwner || "Chưa xác định"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">Mô tả</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{investigation.description}</p>
          </div>
          {investigation.resolutionNote && (
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground">Ghi chú xử lý</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{investigation.resolutionNote}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Chứng cứ đính kèm</h2>
            <p className="text-sm text-muted-foreground">Ảnh và tài liệu do các bên gửi lên hồ sơ.</p>
          </div>
          <span className="text-sm text-muted-foreground">
            {investigation.evidencePhotos?.length ?? 0} tệp
          </span>
        </div>
        {investigation.evidencePhotos?.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {investigation.evidencePhotos.map((evidence) => (
              <FilePreview
                key={evidence.evidenceId}
                fileUrl={evidence.imageUrl}
                alt={evidence.evidenceType}
                className="h-40 w-full"
                openLabel="Mở chứng cứ"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Hồ sơ chưa có chứng cứ đính kèm.
          </div>
        )}
      </section>

      {analysis && (
        <section className="rounded-lg border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Phân tích nhiệt độ từ BE</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dữ liệu tham khảo do endpoint giám định hiện tại trả về.
              </p>
            </div>
            <ClaimStatusBadge status={analysis.status} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div><p className="text-xs text-muted-foreground">Thiết bị</p><p className="mt-1 font-medium">{analysis.sensorDeviceId || "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Dải chuẩn</p><p className="mt-1 font-medium">{analysis.standardRange || "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Đỉnh nhiệt</p><p className="mt-1 font-medium">{analysis.peakTemperatureRecorded || "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Thời lượng vi phạm</p><p className="mt-1 font-medium">{analysis.violationDurationMinutes ?? 0} phút</p></div>
          </div>
          {analysis.details && <p className="mt-5 text-sm">{analysis.details}</p>}
        </section>
      )}
    </div>
  );
};

export default ClaimInvestigationView;
