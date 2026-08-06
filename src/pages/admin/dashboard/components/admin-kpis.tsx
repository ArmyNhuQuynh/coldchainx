import DashboardKpiGrid, {
  type DashboardKpiItem,
} from "@/components/dashboard/dashboard-kpi-grid";
import type { TAdminKpis } from "@/schemas/dashboard.schema";
import {
  Activity,
  AlertTriangle,
  Ban,
  CarFront,
  CircleGauge,
  ClockAlert,
  FileClock,
  FileWarning,
  RadioTower,
  ShieldAlert,
  Truck,
  UserCheck,
  UserRoundX,
  Users,
  Wrench,
} from "lucide-react";

const KpiSection = ({ title, items }: { title: string; items: DashboardKpiItem[] }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-semibold uppercase text-muted-foreground">{title}</h2>
    <DashboardKpiGrid items={items} />
  </section>
);

type Props = {
  kpis: TAdminKpis;
  onOpenVehicles: () => void;
  onOpenDrivers: () => void;
  onOpenIot: () => void;
  onOpenUsers: () => void;
};

const AdminKpis = ({
  kpis,
  onOpenVehicles,
  onOpenDrivers,
  onOpenIot,
  onOpenUsers,
}: Props) => (
  <div className="space-y-6">
    <KpiSection
      title="Vận hành"
      items={[
        { key: "active-trips", title: "Chuyến đang hoạt động", value: kpis.activeTrips, icon: Activity, tone: "success" },
        { key: "late-trips", title: "Chuyến trễ", value: kpis.lateTrips, icon: ClockAlert, tone: kpis.lateTrips > 0 ? "danger" : "default" },
        { key: "temperature-alerts", title: "Chuyến cảnh báo nhiệt độ", value: kpis.tripsWithTemperatureAlerts, icon: AlertTriangle, tone: kpis.tripsWithTemperatureAlerts > 0 ? "warning" : "default" },
      ]}
    />
    <KpiSection
      title="Đội xe và tài xế"
      items={[
        { key: "vehicles", title: "Tổng xe", value: kpis.totalVehicles, icon: Truck, onClick: onOpenVehicles },
        { key: "vehicles-on-trip", title: "Xe đang chạy", value: kpis.vehiclesOnTrip, icon: CarFront, onClick: onOpenVehicles },
        { key: "maintenance", title: "Xe bảo trì", value: kpis.vehiclesUnderMaintenance, icon: Wrench, tone: kpis.vehiclesUnderMaintenance > 0 ? "warning" : "default", onClick: onOpenVehicles },
        { key: "available-drivers", title: "Tài xế khả dụng", value: kpis.availableDrivers, icon: UserCheck, tone: "info", onClick: onOpenDrivers },
        { key: "drivers-on-trip", title: "Tài xế đang chạy", value: kpis.driversOnTrip, icon: Users, onClick: onOpenDrivers },
        { key: "drivers-relaxing", title: "Tài xế nghỉ bắt buộc", value: kpis.driversRelaxing, icon: UserRoundX, onClick: onOpenDrivers },
      ]}
    />
    <KpiSection
      title="Thiết bị IoT"
      items={[
        { key: "iot-online", title: "IoT online", value: kpis.onlineIotDevices, icon: RadioTower, tone: "success", onClick: onOpenIot },
        { key: "iot-offline", title: "IoT offline", value: kpis.offlineIotDevices, icon: Ban, tone: kpis.offlineIotDevices > 0 ? "danger" : "default", onClick: onOpenIot },
        { key: "iot-unassigned", title: "IoT chưa gán xe", value: kpis.unassignedIotDevices, icon: CircleGauge, tone: kpis.unassignedIotDevices > 0 ? "warning" : "default", onClick: onOpenIot },
      ]}
    />
    <KpiSection
      title="Giấy tờ và rủi ro"
      items={[
        { key: "documents-expiring", title: "Giấy tờ sắp hết hạn", value: kpis.expiringDocuments, description: `Xe ${kpis.expiringVehicleDocuments} · Tài xế ${kpis.expiringDriverDocuments}`, icon: FileClock, tone: kpis.expiringDocuments > 0 ? "warning" : "default" },
        { key: "documents-expired", title: "Giấy tờ đã hết hạn", value: kpis.expiredDocuments, description: `Xe ${kpis.expiredVehicleDocuments} · Tài xế ${kpis.expiredDriverDocuments}`, icon: FileWarning, tone: kpis.expiredDocuments > 0 ? "danger" : "default" },
        { key: "incidents", title: "Incident đang mở", value: kpis.openIncidents, icon: ShieldAlert, tone: kpis.openIncidents > 0 ? "warning" : "default" },
        { key: "claims", title: "Claim đang mở", value: kpis.openClaims, description: `${kpis.overdueClaims} claim quá SLA`, icon: AlertTriangle, tone: kpis.overdueClaims > 0 ? "danger" : "default" },
        { key: "active-users", title: "User hoạt động", value: kpis.activeUsers, icon: UserCheck, onClick: onOpenUsers },
        { key: "inactive-users", title: "User không hoạt động", value: kpis.inactiveUsers, icon: UserRoundX, onClick: onOpenUsers },
      ]}
    />
  </div>
);

export default AdminKpis;
