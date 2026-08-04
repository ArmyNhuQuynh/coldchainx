import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import IncidentEvidenceList from "@/components/incidents/incident-evidence-list";
import { IncidentExpenseBadge, IncidentSeverityBadge } from "@/components/incidents/incident-badges";
import { formatIncidentDate, formatIncidentId, formatIncidentMoney } from "@/components/incidents/incident-formatters";
import type { TIncident } from "@/schemas/incident.schema";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";

type Props = {
  incident: TIncident | null;
  onOpenChange: (open: boolean) => void;
};

const ExpenseDetailDialog = ({ incident, onOpenChange }: Props) => (
  <Dialog open={Boolean(incident)} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-4xl">
      <DialogHeader className="border-b px-6 py-5">
        <DialogTitle>Chi phí sự cố SC-{formatIncidentId(incident?.incidentId)}</DialogTitle>
        <DialogDescription>Trip {formatIncidentId(incident?.tripId)} · {getIncidentTypeLabel(incident?.incidentType)}</DialogDescription>
      </DialogHeader>
      {incident && (
        <ScrollArea className="max-h-[calc(90vh-96px)]">
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2"><IncidentSeverityBadge severity={incident.severity} /><IncidentExpenseBadge status={incident.expenseStatus} /></div>
            <p className="leading-6 text-muted-foreground">{incident.description}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Tài xế đề nghị</p><p className="mt-2 font-semibold">{formatIncidentMoney(incident.driverPaidAmount)}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Được duyệt</p><p className="mt-2 font-semibold">{formatIncidentMoney(incident.approvedAmount)}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Đã hoàn</p><p className="mt-2 font-semibold">{formatIncidentMoney(incident.reimbursedAmount)}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Ngày báo cáo</p><p className="mt-2 font-semibold">{formatIncidentDate(incident.reportedAt)}</p></div>
            </div>
            {incident.expenseApprovalNote && (
              <div className="space-y-2 rounded-lg border p-4 text-sm">
                <p><span className="text-muted-foreground">Ghi chú xử lý chi phí:</span> {incident.expenseApprovalNote}</p>
              </div>
            )}
            <div>
              <h3 className="mb-3 font-semibold">Hóa đơn và chứng từ</h3>
              <IncidentEvidenceList evidences={incident.evidences ?? []} />
            </div>
          </div>
        </ScrollArea>
      )}
    </DialogContent>
  </Dialog>
);

export default ExpenseDetailDialog;
