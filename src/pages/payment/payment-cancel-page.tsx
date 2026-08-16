import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const formatCurrency = (value: string | null) => {
  if (!value) return null;
  const num = Number(value);
  if (isNaN(num) || num <= 0) return null;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("orderCode");
  const rawAmount = searchParams.get("amount");
  const status = searchParams.get("status") || "CANCELLED";
  const formattedAmount = formatCurrency(rawAmount);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <main
      className="relative min-h-[100svh] flex flex-col items-center justify-center p-4 bg-[#0b3c73] bg-cover bg-[38%_center] bg-no-repeat md:bg-center"
      style={{
        backgroundImage: "url('/images/coldchain-login-background.png')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#061d38]/80 backdrop-blur-sm" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="mb-6">
          <span className="inline-block text-xs font-bold tracking-wider text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full">
            ColdChainX Logistics
          </span>
        </div>

        {/* Cancel/Warning Icon */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/50">
          <AlertCircle className="h-12 w-12 stroke-[2.5]" />
        </div>

        {/* Title & Message */}
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Thanh toán chưa hoàn tất
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Giao dịch đã bị hủy hoặc chưa được hoàn thành. Vui lòng quay lại ứng
          dụng <strong className="text-slate-800">ColdChainX</strong> để thử
          lại hoặc chọn phương thức thanh toán khác.
        </p>

        {/* Summary Box (Optional metadata if present in URL) */}
        {(orderCode || formattedAmount) && (
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/70 p-4 text-left space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chi tiết yêu cầu
            </div>
            {orderCode && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Mã giao dịch:</span>
                <span className="font-mono font-bold text-slate-800">
                  #{orderCode}
                </span>
              </div>
            )}
            {formattedAmount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Số tiền:</span>
                <span className="font-semibold text-slate-700 text-base">
                  {formattedAmount}
                </span>
              </div>
            )}
            {status && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Trạng thái cổng:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                  {status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Instruction Note */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-normal">
          💡 Bạn có thể đóng tab này và quay lại ứng dụng{" "}
          <span className="font-semibold text-slate-900">ColdChainX</span> để
          thử lại.
        </div>

        {/* Action Button */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b3c73] hover:bg-[#082c55] text-white font-medium py-3 px-4 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <Home className="h-4 w-4" />
            Về trang chủ ColdChainX
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-6 text-center text-xs text-white/70">
        © 2026 ColdChainX Management System. All rights reserved.
      </footer>
    </main>
  );
};

export default PaymentCancelPage;
