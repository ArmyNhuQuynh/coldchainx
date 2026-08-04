import ClaimTable from "@/components/claims/claim-table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClaim } from "@/hooks/use-claim";
import { PATH_ACCOUNTANT_DASHBOARD } from "@/routes/path";
import { CLAIM_STATUS } from "@/types/enums/claim-status.enum";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountantClaimListPage = () => {
  const navigate = useNavigate();
  const { getClaims } = useClaim();
  const [status, setStatus] = useState<string>(CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW);
  const [search, setSearch] = useState("");
  const claimsQuery = getClaims({ status, pageNumber: 1, pageSize: 100 });
  const claims = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const rows = claimsQuery.data?.data ?? [];
    if (!keyword) return rows;
    return rows.filter((claim) =>
      [claim.claimCode, claim.orderTrackingCode, claim.claimType]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [claimsQuery.data?.data, search]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold">Bồi thường khách hàng</h1>
        <p className="mt-1 text-muted-foreground">Giải ngân các hồ sơ đã được Điều phối xác nhận hợp lệ.</p>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã hồ sơ hoặc mã đơn hàng..." className="pl-9" />
        </div>
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value={CLAIM_STATUS.PENDING_ACCOUNTANT_REVIEW}>Chờ giải ngân</TabsTrigger>
            <TabsTrigger value={CLAIM_STATUS.RESOLVED_PAID}>Đã giải ngân</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Danh sách hồ sơ</h2><span className="text-sm text-muted-foreground">{claimsQuery.data?.totalRecords ?? 0} hồ sơ</span></div>
      <ClaimTable claims={claims} isLoading={claimsQuery.isLoading} onOpen={(claim) => navigate(PATH_ACCOUNTANT_DASHBOARD.claim.detail(claim.claimId))} />
    </div>
  );
};

export default AccountantClaimListPage;
