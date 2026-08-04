import ClaimTable from "@/components/claims/claim-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClaim } from "@/hooks/use-claim";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import { CLAIM_STATUS } from "@/types/enums/claim-status.enum";
import { BadgeDollarSign, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DispatcherClaimListPage = () => {
  const navigate = useNavigate();
  const { getClaims } = useClaim();
  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState<string>(CLAIM_STATUS.PENDING_REVIEW);
  const [search, setSearch] = useState("");
  const claimsQuery = getClaims({ status, pageNumber, pageSize: 20 });
  const claims = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const rows = claimsQuery.data?.data ?? [];
    if (!keyword) return rows;
    return rows.filter((claim) =>
      [claim.claimCode, claim.orderTrackingCode, claim.claimType, claim.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [claimsQuery.data?.data, search]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold">Khiếu nại khách hàng</h1>
        <p className="mt-1 text-muted-foreground">
          Kiểm tra chứng cứ và quyết định chuyển hồ sơ hợp lệ sang Kế toán.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm mã hồ sơ, đơn hàng, loại khiếu nại..."
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPageNumber(1);
          }}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CLAIM_STATUS.PENDING_REVIEW}>Chờ duyệt từ giao hàng</SelectItem>
            <SelectItem value={CLAIM_STATUS.PENDING_DISPATCHER_REVIEW}>Chờ điều phối duyệt</SelectItem>
            <SelectItem value={CLAIM_STATUS.OPEN}>Hồ sơ mới</SelectItem>
            <SelectItem value={CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW}>Đã chuyển kế toán</SelectItem>
            <SelectItem value={CLAIM_STATUS.REJECTED}>Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Danh sách hồ sơ</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {claimsQuery.data?.totalRecords ?? 0} hồ sơ
        </span>
      </div>

      <ClaimTable
        claims={claims}
        isLoading={claimsQuery.isLoading}
        onOpen={(claim) => navigate(PATH_DISPATCHER_DASHBOARD.claim.detail(claim.claimId))}
      />

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pageNumber <= 1 || claimsQuery.isFetching}
          onClick={() => setPageNumber((page) => page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-24 text-center text-sm">
          Trang {claimsQuery.data?.currentPage ?? pageNumber} / {claimsQuery.data?.totalPages ?? 1}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pageNumber >= (claimsQuery.data?.totalPages ?? 1) || claimsQuery.isFetching}
          onClick={() => setPageNumber((page) => page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DispatcherClaimListPage;
