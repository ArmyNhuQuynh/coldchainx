import DashboardWorkList from "@/components/dashboard/dashboard-work-list";
import { formatDashboardDateTime } from "@/components/dashboard/dashboard-formatters";
import type { TDashboardWorkItem } from "@/schemas/dashboard.schema";
import { DASHBOARD_WORK_LABELS, getDashboardLabel } from "@/types/enums/dashboard.enum";

type Props = {
  items: TDashboardWorkItem[];
  onOpen: (item: TDashboardWorkItem) => void;
};

const DispatcherWorkList = ({ items, onOpen }: Props) => (
  <DashboardWorkList
    rows={items.map((item) => ({
      id: `${item.type}-${item.referenceId}`,
      title: getDashboardLabel(item.type, DASHBOARD_WORK_LABELS),
      referenceCode: item.referenceCode || item.code || undefined,
      description: item.message,
      due: formatDashboardDateTime(item.slaDeadline),
      isOverdue: item.isOverdue,
      onOpen: () => onOpen(item),
    }))}
  />
);

export default DispatcherWorkList;
