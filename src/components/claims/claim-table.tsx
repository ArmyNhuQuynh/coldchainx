import ClaimStatusBadge from "@/components/claims/claim-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TClaim } from "@/schemas/claim.schema";

type Props = {
  claims: TClaim[];
  isLoading?: boolean;
  onOpen: (claim: TClaim) => void;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("vi-VN");
};

const ClaimTable = ({ claims, isLoading, onOpen }: Props) => (
  <div className="overflow-hidden rounded-lg border bg-card">
    <Table>
      <TableHeader className="bg-background">
        <TableRow>
          <TableHead className="pl-5">Hồ sơ</TableHead>
          <TableHead>Đơn hàng</TableHead>
          <TableHead>Loại khiếu nại</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell colSpan={5} className="px-5 py-3">
                <Skeleton className="h-12 w-full" />
              </TableCell>
            </TableRow>
          ))}
        {!isLoading && claims.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
              Không có hồ sơ phù hợp.
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          claims.map((claim) => (
            <TableRow
              key={claim.claimId}
              className="cursor-pointer"
              onClick={() => onOpen(claim)}
            >
              <TableCell className="pl-5">
                <p className="font-semibold">{claim.claimCode}</p>
                <p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">
                  {claim.description}
                </p>
              </TableCell>
              <TableCell>{claim.orderTrackingCode || "—"}</TableCell>
              <TableCell>{claim.claimType || "—"}</TableCell>
              <TableCell>{formatDateTime(claim.createdAt)}</TableCell>
              <TableCell>
                <ClaimStatusBadge status={claim.status} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </div>
);

export default ClaimTable;
