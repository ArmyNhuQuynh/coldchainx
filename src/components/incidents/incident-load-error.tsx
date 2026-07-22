import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { getIncidentErrorMessage } from "./incident-formatters";

type Props = {
  error: unknown;
  fallbackMessage: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

const IncidentLoadError = ({
  error,
  fallbackMessage,
  onRetry,
  isRetrying,
}: Props) => (
  <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-rose-300 p-6 text-center">
    <AlertTriangle className="h-8 w-8 text-rose-700" />
    <p className="mt-3 font-semibold">Không tải được dữ liệu</p>
    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
      {getIncidentErrorMessage(error, fallbackMessage)}
    </p>
    <Button
      type="button"
      variant="outline"
      className="mt-4 gap-2"
      disabled={isRetrying}
      onClick={onRetry}
    >
      <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
      Thử lại
    </Button>
  </div>
);

export default IncidentLoadError;
