import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIncident } from "@/hooks/use-incident";
import IncidentLoadError from "@/components/incidents/incident-load-error";
import { formatIncidentMoney } from "@/components/incidents/incident-formatters";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_EXPENSE_STATUS } from "@/types/enums/incident-expense-status.enum";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { CheckCircle2, Clock3, RefreshCw, Search, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import ExpenseDetailDialog from "./components/expense-detail-dialog";
import ExpenseReviewDialog from "./components/expense-review-dialog";
import ExpenseTable from "./components/expense-table";
import IncidentResolutionDialog from "./components/incident-resolution-dialog";
import ReimbursementDialog from "./components/reimbursement-dialog";

const ReimbursementPage = () => {
  const { getAllIncidents } = useIncident();
  const incidentsQuery = getAllIncidents();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending");
  const [detailIncident, setDetailIncident] = useState<TIncident | null>(null);
  const [reviewIncident, setReviewIncident] = useState<TIncident | null>(null);
  const [reimburseIncident, setReimburseIncident] = useState<TIncident | null>(null);
  const [resolutionIncident, setResolutionIncident] = useState<TIncident | null>(null);

  const matchingIncidents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (incidentsQuery.data ?? []).filter((incident) => {
      const matchesSearch =
        !keyword ||
        [incident.incidentId, incident.tripId, incident.reportedByUsername, incident.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      return matchesSearch;
    });
  }, [incidentsQuery.data, search]);

  const expenseIncidents = matchingIncidents.filter(
    (incident) =>
      incident.driverPaidAmount > 0 ||
      incident.expenseStatus !== INCIDENT_EXPENSE_STATUS.NOT_REQUIRED
  );
  const pending = expenseIncidents.filter((item) => item.expenseStatus === INCIDENT_EXPENSE_STATUS.PENDING_APPROVAL);
  const approved = expenseIncidents.filter((item) => item.expenseStatus === INCIDENT_EXPENSE_STATUS.APPROVED);
  const reimbursed = expenseIncidents.filter(
    (item) => item.expenseStatus === INCIDENT_EXPENSE_STATUS.REIMBURSED
  );
  const readyToResolve = matchingIncidents.filter(
    (incident) =>
      (incident.status === INCIDENT_STATUS.CONTINUED ||
        incident.status === INCIDENT_STATUS.TRANSLOAD_COMPLETED) &&
      (incident.expenseStatus === INCIDENT_EXPENSE_STATUS.NOT_REQUIRED ||
        incident.expenseStatus === INCIDENT_EXPENSE_STATUS.REIMBURSED)
  );
  const pendingAmount = pending.reduce((sum, item) => sum + item.driverPaidAmount, 0);
  const approvedAmount = approved.reduce((sum, item) => sum + Number(item.approvedAmount ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700"><WalletCards className="h-5 w-5" /></div>
          <div>
            <h1 className="text-3xl font-semibold">Giải ngân sự cố</h1>
            <p className="mt-1 text-muted-foreground">Duyệt khoản tài xế đã chi và lưu chứng từ hoàn tiền</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="gap-2" disabled={incidentsQuery.isFetching} onClick={() => incidentsQuery.refetch()}>
          <RefreshCw className={`h-4 w-4 ${incidentsQuery.isFetching ? "animate-spin" : ""}`} /> Đồng bộ
        </Button>
      </div>

      <div className="grid overflow-hidden rounded-lg border bg-background md:grid-cols-4">
        <div className="flex min-h-24 items-center justify-between p-4"><div><p className="text-sm text-muted-foreground">Chờ duyệt</p><p className="mt-1 text-2xl font-semibold">{pending.length}</p><p className="text-xs text-muted-foreground">{formatIncidentMoney(pendingAmount)}</p></div><Clock3 className="h-5 w-5 text-amber-700" /></div>
        <div className="flex min-h-24 items-center justify-between border-t p-4 md:border-l md:border-t-0"><div><p className="text-sm text-muted-foreground">Chờ hoàn tiền</p><p className="mt-1 text-2xl font-semibold">{approved.length}</p><p className="text-xs text-muted-foreground">{formatIncidentMoney(approvedAmount)}</p></div><WalletCards className="h-5 w-5 text-blue-700" /></div>
        <div className="flex min-h-24 items-center justify-between border-t p-4 md:border-l md:border-t-0"><div><p className="text-sm text-muted-foreground">Chờ đóng sự cố</p><p className="mt-1 text-2xl font-semibold">{readyToResolve.length}</p><p className="text-xs text-muted-foreground">Đã xong vận hành và chi phí</p></div><CheckCircle2 className="h-5 w-5 text-emerald-700" /></div>
        <div className="flex min-h-24 items-center justify-between border-t p-4 md:border-l md:border-t-0"><div><p className="text-sm text-muted-foreground">Đã hoàn tiền</p><p className="mt-1 text-2xl font-semibold">{reimbursed.length}</p><p className="text-xs text-muted-foreground">Có chứng từ giải ngân</p></div><WalletCards className="h-5 w-5 text-emerald-700" /></div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} className="pl-9" placeholder="Tìm theo sự cố, trip, tài xế..." onChange={(event) => setSearch(event.target.value)} />
      </div>

      {incidentsQuery.isError ? (
        <IncidentLoadError
          error={incidentsQuery.error}
          fallbackMessage="Không thể tải danh sách đề nghị hoàn chi phí."
          isRetrying={incidentsQuery.isFetching}
          onRetry={() => incidentsQuery.refetch()}
        />
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="pending">Chờ duyệt ({pending.length})</TabsTrigger>
            <TabsTrigger value="approved">Chờ hoàn tiền ({approved.length})</TabsTrigger>
            <TabsTrigger value="resolve">Chờ đóng ({readyToResolve.length})</TabsTrigger>
            <TabsTrigger value="history">Đã hoàn tiền ({reimbursed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending"><ExpenseTable incidents={pending} isLoading={incidentsQuery.isLoading} onView={setDetailIncident} onReview={setReviewIncident} onReimburse={setReimburseIncident} onResolve={setResolutionIncident} /></TabsContent>
          <TabsContent value="approved"><ExpenseTable incidents={approved} isLoading={incidentsQuery.isLoading} onView={setDetailIncident} onReview={setReviewIncident} onReimburse={setReimburseIncident} onResolve={setResolutionIncident} /></TabsContent>
          <TabsContent value="resolve"><ExpenseTable incidents={readyToResolve} isLoading={incidentsQuery.isLoading} onView={setDetailIncident} onReview={setReviewIncident} onReimburse={setReimburseIncident} onResolve={setResolutionIncident} title="Sự cố chờ đóng" description="Đã hoàn tất xử lý vận hành và nghĩa vụ hoàn chi phí" /></TabsContent>
          <TabsContent value="history"><ExpenseTable incidents={reimbursed} isLoading={incidentsQuery.isLoading} onView={setDetailIncident} onReview={setReviewIncident} onReimburse={setReimburseIncident} onResolve={setResolutionIncident} /></TabsContent>
        </Tabs>
      )}

      <ExpenseDetailDialog incident={detailIncident} onOpenChange={(open) => !open && setDetailIncident(null)} />
      <ExpenseReviewDialog incident={reviewIncident} onOpenChange={(open) => !open && setReviewIncident(null)} />
      <ReimbursementDialog incident={reimburseIncident} onOpenChange={(open) => !open && setReimburseIncident(null)} />
      <IncidentResolutionDialog incident={resolutionIncident} onOpenChange={(open) => !open && setResolutionIncident(null)} />
    </div>
  );
};

export default ReimbursementPage;
