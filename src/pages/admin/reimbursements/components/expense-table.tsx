import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IncidentExpenseBadge } from "@/components/incidents/incident-badges";
import { formatIncidentDate, formatIncidentId, formatIncidentMoney } from "@/components/incidents/incident-formatters";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_EXPENSE_STATUS } from "@/types/enums/incident-expense-status.enum";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";
import { CheckCircle2, Eye, ReceiptText, WalletCards } from "lucide-react";

type Props = {
  incidents: TIncident[];
  isLoading?: boolean;
  onView: (incident: TIncident) => void;
  onReview: (incident: TIncident) => void;
  onReimburse: (incident: TIncident) => void;
  onResolve: (incident: TIncident) => void;
  title?: string;
  description?: string;
};

const ExpenseTable = ({
  incidents,
  isLoading,
  onView,
  onReview,
  onReimburse,
  onResolve,
  title = "Đề nghị hoàn chi phí",
  description = "Đối chiếu hóa đơn trước khi duyệt và tải chứng từ sau khi hoàn tiền",
}: Props) => (
  <Card className="gap-0 rounded-lg py-0">
    <CardHeader className="border-b px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="rounded-md bg-transparent">{incidents.length} hồ sơ</Badge>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <ScrollArea className="h-[590px]">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="pl-5">Sự cố / Trip</TableHead>
              <TableHead>Người đề nghị</TableHead>
              <TableHead>Loại sự cố</TableHead>
              <TableHead className="text-right">Đề nghị</TableHead>
              <TableHead className="text-right">Được duyệt</TableHead>
              <TableHead>Chứng từ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="pr-5 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}><TableCell colSpan={8} className="px-5 py-3"><Skeleton className="h-12 w-full" /></TableCell></TableRow>
            ))}
            {!isLoading && incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-52 text-center">
                  <WalletCards className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">Không có hồ sơ trong nhóm này</p>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && incidents.map((incident) => {
              const readyToResolve =
                (incident.status === INCIDENT_STATUS.CONTINUED ||
                  incident.status === INCIDENT_STATUS.TRANSLOAD_COMPLETED) &&
                (incident.expenseStatus === INCIDENT_EXPENSE_STATUS.NOT_REQUIRED ||
                  incident.expenseStatus === INCIDENT_EXPENSE_STATUS.REIMBURSED);

              return (
              <TableRow key={incident.incidentId} className="cursor-pointer" onClick={() => onView(incident)}>
                <TableCell className="pl-5">
                  <p className="font-semibold">SC-{formatIncidentId(incident.incidentId)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Trip {formatIncidentId(incident.tripId)}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{incident.reportedByUsername || "—"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatIncidentDate(incident.reportedAt)}</p>
                </TableCell>
                <TableCell>{getIncidentTypeLabel(incident.incidentType)}</TableCell>
                <TableCell className="text-right font-medium">{formatIncidentMoney(incident.driverPaidAmount)}</TableCell>
                <TableCell className="text-right font-medium">{incident.approvedAmount == null ? "—" : formatIncidentMoney(incident.approvedAmount)}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm"><ReceiptText className="h-3.5 w-3.5 text-muted-foreground" />{incident.evidences?.length ?? 0} tệp</span>
                </TableCell>
                <TableCell><IncidentExpenseBadge status={incident.expenseStatus} /></TableCell>
                <TableCell className="pr-5 text-right">
                  {readyToResolve && (
                    <Button type="button" size="sm" className="gap-1.5" onClick={(event) => { event.stopPropagation(); onResolve(incident); }}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Đóng sự cố
                    </Button>
                  )}
                  {!readyToResolve && incident.expenseStatus === INCIDENT_EXPENSE_STATUS.PENDING_APPROVAL && (
                    <Button type="button" size="sm" onClick={(event) => { event.stopPropagation(); onReview(incident); }}>Duyệt chi phí</Button>
                  )}
                  {!readyToResolve && incident.expenseStatus === INCIDENT_EXPENSE_STATUS.APPROVED && (
                    <Button type="button" size="sm" onClick={(event) => { event.stopPropagation(); onReimburse(incident); }}>Hoàn tiền</Button>
                  )}
                  {!readyToResolve &&
                    incident.expenseStatus !== INCIDENT_EXPENSE_STATUS.PENDING_APPROVAL &&
                    incident.expenseStatus !== INCIDENT_EXPENSE_STATUS.APPROVED && (
                    <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={(event) => { event.stopPropagation(); onView(incident); }}>
                      <Eye className="h-3.5 w-3.5" /> Chi tiết
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default ExpenseTable;
