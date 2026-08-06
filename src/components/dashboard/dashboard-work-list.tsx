import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, ClipboardCheck } from "lucide-react";

export type DashboardWorkRow = {
  id: string;
  title: string;
  referenceCode?: string;
  description?: string;
  detail?: string;
  due?: string;
  amount?: string;
  isOverdue: boolean;
  onOpen?: () => void;
};

type Props = {
  rows: DashboardWorkRow[];
  emptyText?: string;
};

const DashboardWorkList = ({
  rows,
  emptyText = "Không có công việc cần xử lý.",
}: Props) => {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <ClipboardCheck className="mb-3 h-7 w-7 text-emerald-600" />
        <p className="text-sm font-medium">Mọi việc đang ổn</p>
        <p className="mt-1 text-xs text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/55">
          <TableRow>
            <TableHead>Công việc</TableHead>
            <TableHead>Mã tham chiếu</TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Thời hạn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.title}</TableCell>
              <TableCell>{row.referenceCode || "-"}</TableCell>
              <TableCell className="max-w-sm">
                <p className="line-clamp-2 text-sm">{row.description || "-"}</p>
                {row.amount && (
                  <p className="mt-1 text-xs font-medium text-primary">{row.amount}</p>
                )}
              </TableCell>
              <TableCell>
                <p className="text-sm">{row.due || "-"}</p>
                {row.detail && (
                  <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    row.isOverdue
                      ? "border-rose-300 text-rose-700"
                      : "border-emerald-300 text-emerald-700"
                  }
                >
                  {row.isOverdue ? "Quá hạn" : "Trong hạn"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {row.onOpen ? (
                  <Button type="button" variant="outline" size="sm" onClick={row.onOpen}>
                    Xem
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Chỉ xem</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardWorkList;
