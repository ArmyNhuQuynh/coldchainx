import ClaimInvestigationView from "@/components/claims/claim-investigation-view";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClaim } from "@/hooks/use-claim";
import { handleApiError } from "@/lib/error";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { CLAIM_STATUS } from "@/types/enums/claim-status.enum";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const DispatcherClaimDetailPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { getInvestigation, approveByDispatcher, rejectByDispatcher } = useClaim();
  const investigationQuery = getInvestigation(claimId);
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"approve" | "reject" | null>(null);
  const isActionable = [
    CLAIM_STATUS.OPEN,
    CLAIM_STATUS.PENDING_DISPATCHER_REVIEW,
  ].includes(investigationQuery.data?.status as typeof CLAIM_STATUS.OPEN);
  const isPending = approveByDispatcher.isPending || rejectByDispatcher.isPending;

  const handleSubmit = async () => {
    if (!claimId || !mode || isPending) return;
    if (mode === "reject" && !note.trim()) {
      toast.error("Vui lòng nhập lý do từ chối bồi thường.");
      return;
    }

    try {
      const response = mode === "approve"
        ? await approveByDispatcher.mutateAsync({ claimId, data: { note: note.trim() || undefined } })
        : await rejectByDispatcher.mutateAsync({ claimId, data: { note: note.trim() } });
      toast.success(response.message || "Cập nhật hồ sơ thành công");
      navigate(PATH_DISPATCHER_DASHBOARD.claim.root, { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-3">
        <Button type="button" variant="outline" size="icon" onClick={() => navigate(PATH_DISPATCHER_DASHBOARD.claim.root)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Giám định khiếu nại</h1>
          <p className="mt-1 text-muted-foreground">Đối chiếu hồ sơ trước khi duyệt hoặc từ chối.</p>
        </div>
      </header>

      <ClaimInvestigationView investigation={investigationQuery.data} isLoading={investigationQuery.isLoading} />

      {isActionable && (
        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Quyết định của điều phối</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hồ sơ được duyệt sẽ chuyển sang hàng chờ giải ngân của Kế toán.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant={mode === "approve" ? "default" : "outline"} onClick={() => setMode("approve")}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Duyệt bồi thường
            </Button>
            <Button type="button" variant={mode === "reject" ? "destructive" : "outline"} onClick={() => setMode("reject")}>
              <XCircle className="mr-2 h-4 w-4" /> Từ chối
            </Button>
          </div>
          {mode && (
            <div className="mt-4 space-y-3">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder={mode === "reject" ? "Nhập lý do từ chối..." : "Ghi chú chuyển Kế toán (không bắt buộc)..."}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" disabled={isPending} onClick={() => { setMode(null); setNote(""); }}>Hủy</Button>
                <Button type="button" variant={mode === "reject" ? "destructive" : "default"} disabled={isPending} onClick={handleSubmit}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DispatcherClaimDetailPage;
