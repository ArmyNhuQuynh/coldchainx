import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { AlertTriangle, Eye, MapPin, Truck } from "lucide-react";
import {
  IncidentExpenseBadge,
  IncidentSeverityBadge,
  IncidentStatusBadge,
} from "@/components/incidents/incident-badges";
import {
  formatIncidentDate,
  formatIncidentId,
} from "@/components/incidents/incident-formatters";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";

type Props = {
  incidents: TIncident[];
  isLoading?: boolean;
  onSelect: (incident: TIncident) => void;
};

const IncidentTable = ({ incidents, isLoading, onSelect }: Props) => (
  <Card className="gap-0 rounded-lg py-0">
    <CardHeader className="border-b px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Sự cố vận chuyển</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Ưu tiên theo thời điểm tài xế báo cáo mới nhất
          </p>
        </div>
        <Badge variant="outline" className="rounded-md bg-transparent">
          {incidents.length} sự cố
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <ScrollArea className="h-[610px]">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="pl-5">Sự cố / Trip</TableHead>
              <TableHead>Loại sự cố</TableHead>
              <TableHead>Mức độ</TableHead>
              <TableHead>Yêu cầu cứu hộ</TableHead>
              <TableHead>Chi phí</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời điểm báo</TableHead>
              <TableHead className="pr-5 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={8} className="px-5 py-3">
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ))}

            {!isLoading && incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-56 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">Không có sự cố phù hợp</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc tải lại dữ liệu
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && incidents.map((incident) => (
              <TableRow
                key={incident.incidentId}
                className="cursor-pointer"
                onClick={() => onSelect(incident)}
              >
                <TableCell className="pl-5">
                  <p className="font-semibold">SC-{formatIncidentId(incident.incidentId)}</p>
                  <p className="mt-1 max-w-44 truncate text-xs text-muted-foreground">
                    Trip {formatIncidentId(incident.tripId)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{getIncidentTypeLabel(incident.incidentType)}</p>
                  <p className="mt-1 max-w-52 truncate text-xs text-muted-foreground">
                    {incident.description}
                  </p>
                </TableCell>
                <TableCell><IncidentSeverityBadge severity={incident.severity} /></TableCell>
                <TableCell>
                  {incident.requiresRescue ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-rose-700">
                      <Truck className="h-4 w-4" /> Có
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Không</span>
                  )}
                </TableCell>
                <TableCell><IncidentExpenseBadge status={incident.expenseStatus} /></TableCell>
                <TableCell><IncidentStatusBadge status={incident.status} /></TableCell>
                <TableCell>
                  <p>{formatIncidentDate(incident.reportedAt)}</p>
                  <p className="mt-1 max-w-40 truncate text-xs text-muted-foreground">
                    {incident.reportedByUsername}
                  </p>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Button
                    type="button"
                    variant={incident.status === INCIDENT_STATUS.REPORTED ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(incident);
                    }}
                  >
                    {incident.currentLatitude != null ? (
                      <MapPin className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {incident.status === INCIDENT_STATUS.RESOLVED ? "Chi tiết" : "Xử lý"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default IncidentTable;
