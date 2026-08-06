import DashboardWorkList from "@/components/dashboard/dashboard-work-list";
import {
  formatDashboardCurrency,
  formatDashboardDate,
  formatDashboardDateTime,
} from "@/components/dashboard/dashboard-formatters";
import type { TAccountantPriorityWorkItem } from "@/schemas/dashboard.schema";
import { DASHBOARD_WORK_LABELS, getDashboardLabel } from "@/types/enums/dashboard.enum";

const AccountantWorkList = ({
  items,
  onOpen,
}: {
  items: TAccountantPriorityWorkItem[];
  onOpen: (item: TAccountantPriorityWorkItem) => void;
}) => (
  <DashboardWorkList
    rows={items.map((item) => ({
      id: `${item.type}-${item.referenceId}`,
      title: getDashboardLabel(item.type, DASHBOARD_WORK_LABELS),
      referenceCode: item.referenceCode,
      description: `Tạo lúc ${formatDashboardDateTime(item.createdAt)}`,
      amount: item.amount === null || item.amount === undefined ? undefined : formatDashboardCurrency(item.amount),
      due: formatDashboardDate(item.dueDate),
      isOverdue: item.isOverdue,
      onOpen: () => onOpen(item),
    }))}
  />
);

export default AccountantWorkList;
