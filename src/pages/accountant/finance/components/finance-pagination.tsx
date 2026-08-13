import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FinancePagination = ({
  page,
  totalPages,
  totalRecords,
  isLoading,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalRecords: number;
  isLoading?: boolean;
  onChange: (page: number) => void;
}) => {
  const safeTotalPages = Math.max(totalPages, 1);
  return (
    <div className="flex flex-col gap-3 border-t bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">
        {totalRecords.toLocaleString("vi-VN")} bản ghi
      </span>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1 || isLoading}
          onClick={() => onChange(page - 1)}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-24 text-center text-sm">
          Trang {page}/{safeTotalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= safeTotalPages || isLoading}
          onClick={() => onChange(page + 1)}
          aria-label="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FinancePagination;
