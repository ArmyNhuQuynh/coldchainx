import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const FinanceTableLoading = ({ rows = 6 }: { rows?: number }) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton key={index} className="h-14 w-full" />
    ))}
  </div>
);

export const FinanceErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-rose-200 bg-card p-6 text-center">
    <AlertTriangle className="mb-3 h-7 w-7 text-rose-600" />
    <p className="font-medium">Không tải được dữ liệu</p>
    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{message}</p>
    <Button type="button" variant="outline" className="mt-4 gap-2" onClick={onRetry}>
      <RefreshCw className="h-4 w-4" />
      Thử lại
    </Button>
  </div>
);

export const FinanceEmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-48 items-center justify-center p-6 text-center text-sm text-muted-foreground">
    {message}
  </div>
);
