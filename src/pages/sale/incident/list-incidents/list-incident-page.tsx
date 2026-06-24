import { useDiscrepancy } from "@/hooks/use-discrepancy";
import { AlertTriangle } from "lucide-react";
import IncidentSummaryCards from "./components/incident-summary-cards";
import IncidentTable from "./components/incident-table";

const ListIncidentPage = () => {
  const { getPendingDiscrepancies } = useDiscrepancy();
  const { data = [], isLoading, refetch } = getPendingDiscrepancies();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Xử lý sự cố</h1>
              <p className="text-muted-foreground mt-1">
                Theo dõi các LPN đang giữ do sai lệch QC inbound
              </p>
            </div>
          </div>
        </div>
      </div>

      <IncidentSummaryCards items={data} />

      <IncidentTable
        data={data}
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />
    </div>
  );
};

export default ListIncidentPage;
