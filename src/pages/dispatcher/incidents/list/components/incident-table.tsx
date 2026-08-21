import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { AlertTriangle, Truck } from "lucide-react";
import {
  IncidentSeverityBadge,
  IncidentStatusBadge,
} from "@/components/incidents/incident-badges";
import { formatIncidentDate } from "@/components/incidents/incident-formatters";
import { getIncidentTypeLabel } from "@/types/enums/incident-type.enum";

type Props = {
  incidents: TIncident[];
  isLoading?: boolean;
  onSelect: (incident: TIncident) => void;
};

const IncidentTable = ({
  incidents,
  isLoading,
  onSelect,
}: Props) => (
  <Card className="min-w-0 gap-0 overflow-hidden rounded-lg py-0">
    <CardHeader className="border-b px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Sự cố vận chuyển</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Ưu tiên containment, rescue planning, redispatch gấp và SLA quá hạn
          </p>
        </div>
        <Badge variant="outline" className="rounded-md bg-transparent">
          {incidents.length} sự cố
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="min-w-0 p-0">
      <ScrollArea className="h-[610px] w-full min-w-0 max-w-full">
        <Table className="w-max min-w-full">
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="pl-5">Báo cáo</TableHead>
              <TableHead>Loại sự cố</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Yêu cầu cứu hộ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>SLA / Báo lúc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="px-5 py-3">
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-56 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">Không có sự cố phù hợp</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc tải lại dữ liệu
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              incidents.map((incident) => (
                  <TableRow
                    key={incident.incidentId}
                    className="cursor-pointer"
                    title="Bấm để xem chi tiết sự cố"
                    onClick={() => onSelect(incident)}
                  >
                    <TableCell className="pl-5">
                      <p className="font-semibold">
                        {incident.reportedByUsername || "Người báo cáo chưa rõ"}
                      </p>
                      <p className="mt-1 max-w-44 truncate text-xs text-muted-foreground">
                        {incident.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {getIncidentTypeLabel(incident.incidentType)}
                      </p>
                      <p className="mt-1 max-w-52 truncate text-xs text-muted-foreground">
                        {incident.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <IncidentSeverityBadge severity={incident.severity} />
                    </TableCell>
                    <TableCell>
                      {incident.requiresRescue ? (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-rose-700">
                          <Truck className="h-4 w-4" /> Có
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Không
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IncidentStatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {formatIncidentDate(incident.slaDueAt)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatIncidentDate(incident.reportedAt)}
                      </p>
                    </TableCell>
                  </TableRow>
              ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
  </Card>
);

export default IncidentTable;
