import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error";
import { RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    handleApiError(error);

    return (
        <div className="relative w-full min-h-[200px] justify-center items-center flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Có gì đó không ổn</h2>
            <p className="text-sm text-gray-500 mb-4">
                Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.
            </p>
            {/* <ImageNotFound className="w-80 h-80 mx-auto mb-4" /> */}
            <Button onClick={resetErrorBoundary}>
                <RefreshCw className="mr-2" />
                Thử lại
            </Button>
        </div>
    );
};