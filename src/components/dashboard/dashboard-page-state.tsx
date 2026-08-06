import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const DashboardLoadingState = () => (
  <div className="space-y-5">
    <Skeleton className="h-24 w-full" />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  </div>
);

export const DashboardErrorState = ({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50/35 text-center">
    <AlertTriangle className="mb-3 h-8 w-8 text-rose-600" />
    <p className="font-medium">Không tải được dashboard</p>
    <p className="mt-1 max-w-lg text-sm text-muted-foreground">
      {message || "Vui lòng thử tải lại dữ liệu."}
    </p>
    <Button type="button" variant="outline" className="mt-4 gap-2" onClick={onRetry}>
      <RefreshCw className="h-4 w-4" />
      Thử lại
    </Button>
  </div>
);
