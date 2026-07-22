import { Button } from "@/components/ui/button";
import IncidentLoadError from "@/components/incidents/incident-load-error";
import { useIncident } from "@/hooks/use-incident";
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncidentFilterBar from "./components/incident-filter-bar";
import IncidentSummaryStrip from "./components/incident-summary-strip";
import IncidentTable from "./components/incident-table";

const matchesSearch = (incident: TIncident, search: string) => {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return true;

  return [
    incident.incidentId,
    incident.tripId,
    incident.tripCode,
    incident.incidentType,
    incident.description,
    incident.reportedByUsername,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(keyword);
};

const IncidentListPage = () => {
  const navigate = useNavigate();
  const { getAllIncidents } = useIncident();
  const incidentsQuery = getAllIncidents();
  const incidents = incidentsQuery.data ?? [];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("UNRESOLVED");
  const [severity, setSeverity] = useState("ALL");
  const [rescue, setRescue] = useState("ALL");

  const filteredIncidents = useMemo(
    () =>
      incidents.filter((incident) => {
        const matchesStatus =
          status === "ALL" ||
          (status === "UNRESOLVED"
            ? incident.status !== INCIDENT_STATUS.RESOLVED
            : incident.status === status);
        const matchesSeverity = severity === "ALL" || incident.severity === severity;
        const matchesRescue =
          rescue === "ALL" ||
          (rescue === "REQUIRED" ? incident.requiresRescue : !incident.requiresRescue);

        return matchesSearch(incident, search) && matchesStatus && matchesSeverity && matchesRescue;
      }),
    [incidents, rescue, search, severity, status]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-rose-200 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Xử lý sự cố</h1>
            <p className="mt-1 text-muted-foreground">
              Tiếp nhận sự cố đang diễn ra, điều xe cứu hộ và xác nhận sang hàng
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={incidentsQuery.isFetching}
          onClick={() => incidentsQuery.refetch()}
        >
          <RefreshCw className={`h-4 w-4 ${incidentsQuery.isFetching ? "animate-spin" : ""}`} />
          Đồng bộ sự cố
        </Button>
      </div>

      <IncidentSummaryStrip incidents={incidents} />
      <IncidentFilterBar
        search={search}
        status={status}
        severity={severity}
        rescue={rescue}
        isRefreshing={incidentsQuery.isFetching}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSeverityChange={setSeverity}
        onRescueChange={setRescue}
        onRefresh={() => incidentsQuery.refetch()}
      />
      {incidentsQuery.isError ? (
        <IncidentLoadError
          error={incidentsQuery.error}
          fallbackMessage="Không thể tải danh sách sự cố vận chuyển."
          isRetrying={incidentsQuery.isFetching}
          onRetry={() => incidentsQuery.refetch()}
        />
      ) : (
        <IncidentTable
          incidents={filteredIncidents}
          isLoading={incidentsQuery.isLoading}
          onSelect={(incident) =>
            navigate(PATH_DISPATCHER_DASHBOARD.incident.detail(incident.incidentId))
          }
        />
      )}
    </div>
  );
};

export default IncidentListPage;
