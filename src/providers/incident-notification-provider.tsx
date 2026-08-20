import { incidentQueryKeys } from "@/hooks/use-incident";
import { notificationQueryKeys } from "@/hooks/use-notification";
import { incidentNotificationSignalR } from "@/lib/incident-notification-signalr";
import type { RootState } from "@/redux/store";
import type { TIncidentRealtimeEvent } from "@/schemas/notification.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const EVENT_MESSAGES: Record<string, string> = {
  IncidentReported: "Có Incident mới cần Dispatcher xử lý.",
  IncidentEvidenceAdded: "Incident vừa có evidence mới.",
  IncidentRiskAssessed: "Risk/status Incident vừa được cập nhật.",
  ExternalReeferDispatched: "Xe lạnh cứu hộ ngoài đã được điều.",
  IncidentCargoInboundedAtRouteWarehouse: "URGENT · Hàng đã vào kho, cần tạo lại chuyến.",
  IncidentRedispatchPlanned: "Trip redispatch đã được tạo.",
  IncidentRedispatchPickingStarted: "Kho đã bắt đầu picking trip redispatch.",
  IncidentRedispatchLpnPicked: "Đang cập nhật tiến độ picking LPN.",
  IncidentRedispatchLoadingCompleted: "Kho đã xếp hàng xong.",
  IncidentRedispatchSealed: "Trip redispatch đã kẹp seal, chờ rời kho.",
  IncidentRedispatchedToCustomer: "Trip redispatch đã rời kho giao khách.",
  IncidentExpenseApproved: "Chi phí Incident đã được duyệt.",
  IncidentExpenseReimbursed: "Chi phí Incident đã được hoàn ứng.",
  IncidentResolved: "Incident đã được đóng.",
  IncidentSlaEscalated: "Incident đã quá SLA và được escalated.",
};

const getOpenIncidentId = (pathname: string) =>
  pathname.match(/\/dispatcher\/dashboard\/incidents\/([^/]+)/)?.[1] ?? null;

const IncidentNotificationProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const role = useSelector((state: RootState) => state.user.role);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || role !== "Dispatcher") return;

    const handleEvent = (event: TIncidentRealtimeEvent) => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: incidentQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: ["monitoring"] });
      void queryClient.invalidateQueries({ queryKey: ["dispatch", "trips"] });

      const openIncidentId = getOpenIncidentId(pathnameRef.current);
      if (event.incidentId && event.incidentId === openIncidentId) {
        void queryClient.refetchQueries({
          queryKey: incidentQueryKeys.detail(event.incidentId),
          type: "active",
        });
      }

      const message = EVENT_MESSAGES[event.eventName] ?? "Incident vừa có cập nhật mới.";
      if (event.eventName === "IncidentRedispatchLpnPicked") {
        toast.info(message, {
          id: `incident-lpn-picked-${event.incidentId ?? "unknown"}`,
          duration: 2_000,
        });
      } else if (event.eventName === "IncidentCargoInboundedAtRouteWarehouse") {
        toast.warning(message, { duration: 8_000 });
      } else {
        toast.info(message, { duration: 4_000 });
      }
    };

    return incidentNotificationSignalR.subscribe(handleEvent);
  }, [isAuthenticated, queryClient, role]);

  return children;
};

export default IncidentNotificationProvider;
