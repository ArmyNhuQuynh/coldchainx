import DashboardKpiGrid from "@/components/dashboard/dashboard-kpi-grid";
import type { TDispatcherKpis } from "@/schemas/dashboard.schema";
import {
  CalendarCheck,
  ClipboardClock,
  PackageCheck,
  RefreshCcw,
  ShieldAlert,
  Truck,
  Warehouse,
} from "lucide-react";

type Props = {
  kpis: TDispatcherKpis;
  onOpenDispatch: () => void;
  onOpenTrips: () => void;
  onOpenTracking: () => void;
  onOpenClaims: () => void;
};

const DispatcherKpis = ({
  kpis,
  onOpenDispatch,
  onOpenTrips,
  onOpenTracking,
  onOpenClaims,
}: Props) => (
  <DashboardKpiGrid
    columns="five"
    items={[
      {
        key: "planned-trips",
        title: "Chuyến đã lên kế hoạch",
        value: kpis.plannedTrips,
        icon: CalendarCheck,
        onClick: onOpenTrips,
      },
      {
        key: "picking-trips",
        title: "Chuyến đang lấy hàng",
        value: kpis.pickingTrips,
        icon: Warehouse,
        onClick: onOpenTrips,
      },
      {
        key: "ready-to-seal",
        title: "Chuyến đã bốc hàng",
        value: kpis.readyToSealTrips,
        description: "Kho tiếp tục kẹp chì và cho xe xuất phát",
        icon: PackageCheck,
        onClick: onOpenTrips,
      },
      {
        key: "in-transit",
        title: "Chuyến đang vận chuyển",
        value: kpis.inTransitTrips,
        icon: Truck,
        tone: "success",
        onClick: onOpenTracking,
      },
      {
        key: "late-risk",
        title: "Chuyến trễ hoặc có nguy cơ",
        value: kpis.lateOrRiskTrips,
        icon: ShieldAlert,
        tone: kpis.lateOrRiskTrips > 0 ? "danger" : "default",
        onClick: onOpenTracking,
      },
      {
        key: "redelivery",
        title: "Hàng chờ tái giao",
        value: kpis.redeliveryLpns,
        icon: RefreshCcw,
        tone: kpis.redeliveryLpns > 0 ? "warning" : "default",
        onClick: onOpenDispatch,
      },
      {
        key: "claims",
        title: "Claim chờ Dispatcher",
        value: kpis.pendingDispatcherClaims,
        icon: ClipboardClock,
        tone: kpis.pendingDispatcherClaims > 0 ? "warning" : "default",
        onClick: onOpenClaims,
      },
    ]}
  />
);

export default DispatcherKpis;
