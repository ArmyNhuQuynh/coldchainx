import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TTripHistoryRow = {
  tripId: string;
  status?: string | null;
  resource: string;
  plannedStartTime?: string | null;
  endTime?: string | null;
  detail: string;
};

type TripHistoryTableProps = {
  rows: TTripHistoryRow[];
  resourceHeader: string;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage: string;
  onPageChange: (page: number) => void;
};

const TRIP_STATUS_LABELS: Record<string, string> = {
  PLANNED: "Đã lên kế hoạch",
  PICKING: "Đang lấy hàng",
  LOADING: "Đang bốc hàng",
  LOADING_COMPLETED: "Đã bốc xong",
  SEALED: "Đã kẹp chì",
  DISPATCHED: "Đã xuất phát",
  IN_TRANSIT: "Đang vận chuyển",
  DELAYED: "Đang trễ",
  INCIDENT: "Đang có sự cố",
  COMPLETED: "Hoàn thành",
  RECONCILED: "Đã đối soát",
  CANCELLED: "Đã hủy",
};

const getStatusClassName = (status?: string | null) => {
  const normalized = status?.trim().toUpperCase();

  if (normalized === "COMPLETED" || normalized === "RECONCILED") {
    return "border-emerald-300 text-emerald-700";
  }
  if (normalized === "CANCELLED") {
    return "border-rose-300 text-rose-700";
  }
  if (normalized === "DELAYED" || normalized === "INCIDENT") {
    return "border-amber-300 text-amber-700";
  }
  return "border-sky-300 text-sky-700";
};

const getStatusLabel = (status?: string | null) => {
  if (!status) return "Chưa cập nhật";
  const normalized = status.trim().toUpperCase();
  return TRIP_STATUS_LABELS[normalized] ?? status;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const TripHistoryTable = ({
  rows,
  resourceHeader,
  totalItems,
  currentPage,
  pageSize,
  isLoading = false,
  isError = false,
  emptyMessage,
  onPageChange,
}: TripHistoryTableProps) => {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const firstItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);

  return (
    <Card className="overflow-hidden rounded-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Lịch sử chuyến</CardTitle>
        <p className="text-sm text-muted-foreground">
          Các chuyến đã hoàn thành, mới nhất hiển thị trước.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Chuyến</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>{resourceHeader}</TableHead>
                <TableHead>Khởi hành dự kiến</TableHead>
                <TableHead>Kết thúc</TableHead>
                <TableHead>Thông tin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && isError && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-rose-700"
                  >
                    Không tải được lịch sử chuyến.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                rows.map((row) => (
                  <TableRow key={row.tripId}>
                    <TableCell className="font-semibold">
                      Chuyến giao hàng
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "whitespace-nowrap",
                          getStatusClassName(row.status)
                        )}
                      >
                        {getStatusLabel(row.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.resource}
                    </TableCell>
                    <TableCell>{formatDateTime(row.plannedStartTime)}</TableCell>
                    <TableCell>{formatDateTime(row.endTime)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.detail}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
          <span className="text-sm text-muted-foreground">
            {firstItem}-{lastItem} trong {totalItems} chuyến
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Trang {safePage}/{totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Trang trước"
              disabled={safePage <= 1 || isLoading}
              onClick={() => onPageChange(safePage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Trang sau"
              disabled={safePage >= totalPages || isLoading}
              onClick={() => onPageChange(safePage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripHistoryTable;
