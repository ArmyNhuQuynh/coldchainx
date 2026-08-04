import ClaimInvestigationView from "@/components/claims/claim-investigation-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClaim } from "@/hooks/use-claim";
import { handleApiError } from "@/lib/error";
import { PATH_ACCOUNTANT_DASHBOARD } from "@/routes/path";
import { PayoutClaimFormSchema, type TPayoutClaimFormValues } from "@/schemas/claim.schema";
import { CLAIM_STATUS } from "@/types/enums/claim-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AccountantClaimDetailPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { getInvestigation, payoutByAccountant } = useClaim();
  const investigationQuery = getInvestigation(claimId);
  const form = useForm<TPayoutClaimFormValues>({
    resolver: zodResolver(PayoutClaimFormSchema),
    defaultValues: { refundAmount: 0, paymentMethod: "BANK_TRANSFER", payoutTransactionCode: "", bankTransferImageUrl: "", note: "" },
  });
  const canPayout = investigationQuery.data?.status === CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW;

  const handleSubmit = async (values: TPayoutClaimFormValues) => {
    if (!claimId) return;
    try {
      const response = await payoutByAccountant.mutateAsync({
        claimId,
        data: {
          refundAmount: values.refundAmount,
          paymentMethod: values.paymentMethod,
          payoutTransactionCode: values.payoutTransactionCode || undefined,
          bankTransferImageUrl: values.bankTransferImageUrl || undefined,
          note: values.note || undefined,
        },
      });
      toast.success(response.message || "Đã giải ngân bồi thường");
      navigate(PATH_ACCOUNTANT_DASHBOARD.claim.root, { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-3">
        <Button type="button" variant="outline" size="icon" onClick={() => navigate(PATH_ACCOUNTANT_DASHBOARD.claim.root)}><ArrowLeft className="h-4 w-4" /></Button>
        <div><h1 className="text-3xl font-semibold">Chi bồi thường</h1><p className="mt-1 text-muted-foreground">Kiểm tra hồ sơ và ghi nhận giao dịch hoàn tiền cho khách hàng.</p></div>
      </header>

      <ClaimInvestigationView investigation={investigationQuery.data} isLoading={investigationQuery.isLoading} />

      {canPayout && (
        <form className="rounded-lg border bg-card p-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <h2 className="text-lg font-semibold">Thông tin giải ngân</h2>
          <p className="mt-1 text-sm text-muted-foreground">Mã giao dịch có thể để trống để BE tự sinh.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="refundAmount">Số tiền hoàn</Label><Input id="refundAmount" type="number" min="1" step="1000" {...form.register("refundAmount", { valueAsNumber: true })} /><p className="text-xs text-destructive">{form.formState.errors.refundAmount?.message}</p></div>
            <div className="space-y-2"><Label>Phương thức</Label><Controller control={form.control} name="paymentMethod" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem><SelectItem value="CASH_REFUND">Hoàn tiền mặt</SelectItem></SelectContent></Select>} /></div>
            <div className="space-y-2"><Label htmlFor="transactionCode">Mã giao dịch</Label><Input id="transactionCode" placeholder="VD: FT260805001" {...form.register("payoutTransactionCode")} /></div>
            <div className="space-y-2"><Label htmlFor="receiptUrl">Đường dẫn chứng từ</Label><Input id="receiptUrl" placeholder="https://..." {...form.register("bankTransferImageUrl")} /><p className="text-xs text-muted-foreground">BE hiện nhận URL, chưa có API tải ảnh dành cho Kế toán.</p><p className="text-xs text-destructive">{form.formState.errors.bankTransferImageUrl?.message}</p></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="note">Ghi chú</Label><Textarea id="note" rows={4} placeholder="Nội dung chuyển tiền..." {...form.register("note")} /></div>
          </div>
          <div className="mt-5 flex justify-end"><Button type="submit" disabled={payoutByAccountant.isPending}>{payoutByAccountant.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Xác nhận giải ngân</Button></div>
        </form>
      )}
    </div>
  );
};

export default AccountantClaimDetailPage;
