// routes.tsx
// import LoadingScreen from "@/components/loading-screen";
import { ErrorFallback } from "@/components/error-fallback";
import LoadingScreen from "@/components/loading-screen";
import RoleBasedGuard from "@/guards/role-based-guard";
import DashBoardLayout from "@/layouts/dashboard/dash-board-layout";
import Logout from "@/pages/auth/logout/logout";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense, type ElementType } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";
import GuestGuard from "../guards/guest-guard";
import {
  PATH_ADMIN_DASHBOARD,
  PATH_AUTH,
  PATH_DISPATCHER_DASHBOARD,
  PATH_MANAGER_DASHBOARD,
  PATH_SALE_DASHBOARD,
} from "./path";



const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
//
const LoginPage = Loadable(lazy(() => import("@/pages/auth/login")));
const ShipmentPage = Loadable(
  lazy(() => import("@/pages/manager/shipment/list-shipments/list-shipment-page"))
);
const ShipmentDetailPage = Loadable(
  lazy(() => import("@/pages/manager/shipment/shipment-detail"))
);
const SaleIncidentPage = Loadable(
  lazy(() => import("@/pages/sale/incident/list-incidents"))
);
const SaleIncidentDetailPage = Loadable(
  lazy(() => import("@/pages/sale/incident/incident-detail"))
);
const SaleCustomerCarePage = Loadable(
  lazy(() => import("@/pages/sale/customer-care"))
);
const VehiclePage = Loadable(
  lazy(() => import("@/pages/admin/vehicle/list-vehicle/list-vehicle-page"))
);
const VehicleCreatePage = Loadable(
  lazy(() => import("@/pages/admin/vehicle/create-vehicle"))
);
const VehicleDetailPage = Loadable(
  lazy(() => import("@/pages/admin/vehicle/detail-vehicle"))
);
const VehicleEditPage = Loadable(
  lazy(() => import("@/pages/admin/vehicle/edit-vehicle"))
);
const IotDevicePage = Loadable(
  lazy(() => import("@/pages/admin/iot-device/list-iot-device"))
);
const IotDeviceCreatePage = Loadable(
  lazy(() => import("@/pages/admin/iot-device/create-iot-device"))
);
const IotDeviceDetailPage = Loadable(
  lazy(() => import("@/pages/admin/iot-device/detail-iot-device"))
);
const IotDeviceEditPage = Loadable(
  lazy(() => import("@/pages/admin/iot-device/edit-iot-device"))
);
const WarehousePage = Loadable(
  lazy(() => import("@/pages/admin/warehouse/list-warehouse"))
);
const WarehouseCreatePage = Loadable(
  lazy(() => import("@/pages/admin/warehouse/create-warehouse"))
);
const WarehouseDetailPage = Loadable(
  lazy(() => import("@/pages/admin/warehouse/detail-warehouse"))
);
const WarehouseEditPage = Loadable(
  lazy(() => import("@/pages/admin/warehouse/edit-warehouse"))
);
const RoutePage = Loadable(
  lazy(() => import("@/pages/admin/route/list-route"))
);
const RouteCreatePage = Loadable(
  lazy(() => import("@/pages/admin/route/create-route"))
);
const RouteDetailPage = Loadable(
  lazy(() => import("@/pages/admin/route/detail-route"))
);
const RouteEditPage = Loadable(
  lazy(() => import("@/pages/admin/route/edit-route"))
);
const PricingPage = Loadable(
  lazy(() => import("@/pages/admin/pricing"))
);
const DriverPage = Loadable(
  lazy(() => import("@/pages/admin/driver/list-driver"))
);
const DriverDetailPage = Loadable(
  lazy(() => import("@/pages/admin/driver/detail-driver"))
);
const UserPage = Loadable(
  lazy(() => import("@/pages/admin/user/list-user"))
);
const UserDetailPage = Loadable(
  lazy(() => import("@/pages/admin/user/detail-user"))
);
const ReimbursementPage = Loadable(
  lazy(() => import("@/pages/admin/reimbursements"))
);
const DispatchPage = Loadable(
  lazy(() => import("@/pages/dispatcher/dispatch"))
);
const DispatchSchedulesPage = Loadable(
  lazy(() => import("@/pages/dispatcher/schedules"))
);
const DispatchTripsPage = Loadable(
  lazy(() => import("@/pages/dispatcher/trips"))
);
const TrackingTripsPage = Loadable(
  lazy(() => import("@/pages/dispatcher/tracking"))
);
const TrackingTripDetailPage = Loadable(
  lazy(() => import("@/pages/dispatcher/tracking/detail/tracking-detail-page"))
);
const DispatcherIncidentPage = Loadable(
  lazy(() => import("@/pages/dispatcher/incidents/list"))
);
const DispatcherIncidentDetailPage = Loadable(
  lazy(() => import("@/pages/dispatcher/incidents/detail"))
);


// const GeneralAppPage = Loadable(lazy(() => import("@/pages/general-app")));
// const GeneralEcommercePage = Loadable(
//   lazy( () => import( "@/pages/general-ecommerce" ) )
// );


//System admin
const Page404 = Loadable(lazy(() => import("@/pages/page-404")));


export const AppRoutes = () =>
  useRoutes([
    {
      path: "/",
      element: <Navigate to={PATH_AUTH.login} replace />,
    },
    {
      path: PATH_AUTH.root,
      children: [
        {
          element: <Navigate to={PATH_AUTH.login} replace />,
          index: true,
        },
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    // System Admin Dashboard routes
    {
      path: PATH_ADMIN_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="Admin">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_ADMIN_DASHBOARD.vehicle.root} replace />,
          index: true,
        },
        {
          path: "app",
          // element: <GeneralAppPage />,
        },
        {
          path: "vehicle",
          element: <VehiclePage />,
        },
        {
          path: "vehicle/new",
          element: <VehicleCreatePage />,
        },
        {
          path: "vehicle/:id",
          element: <VehicleDetailPage />,
        },
        {
          path: "vehicle/:id/edit",
          element: <VehicleEditPage />,
        },
        {
          path: "iot-device",
          element: <IotDevicePage />,
        },
        {
          path: "iot-device/new",
          element: <IotDeviceCreatePage />,
        },
        {
          path: "iot-device/:id",
          element: <IotDeviceDetailPage />,
        },
        {
          path: "iot-device/:id/edit",
          element: <IotDeviceEditPage />,
        },
        {
          path: "warehouse",
          element: <WarehousePage />,
        },
        {
          path: "warehouse/new",
          element: <WarehouseCreatePage />,
        },
        {
          path: "warehouse/:id",
          element: <WarehouseDetailPage />,
        },
        {
          path: "warehouse/:id/edit",
          element: <WarehouseEditPage />,
        },
        {
          path: "route",
          element: <RoutePage />,
        },
        {
          path: "route/new",
          element: <RouteCreatePage />,
        },
        {
          path: "route/:id",
          element: <RouteDetailPage />,
        },
        {
          path: "route/:id/edit",
          element: <RouteEditPage />,
        },
        {
          path: "pricing",
          element: <PricingPage />,
        },
        {
          path: "driver",
          element: <DriverPage />,
        },
        {
          path: "driver/:id",
          element: <DriverDetailPage />,
        },
        {
          path: "user",
          element: <UserPage />,
        },
        {
          path: "user/:id",
          element: <UserDetailPage />,
        },
        {
          path: "reimbursements",
          element: <ReimbursementPage />,
        },
      ],
    },
    {
      path: PATH_MANAGER_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="Manager">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_MANAGER_DASHBOARD.shipment.root} replace />,
          index: true,
        },
        {
          path: "shipment",
          element: <ShipmentPage />,
        },
        {
          path: "shipment/:id",
          element: <ShipmentDetailPage />,
        },

      ],
    },
    {
      path: PATH_SALE_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="Sale">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_SALE_DASHBOARD.shipment.root} replace />,
          index: true,
        },
        {
          path: "shipment",
          element: <ShipmentPage />,
        },
        {
          path: "shipment/:id",
          element: <ShipmentDetailPage />,
        },
        {
          path: "incident",
          element: <SaleIncidentPage />,
        },
        {
          path: "incident/:id",
          element: <SaleIncidentDetailPage />,
        },
        {
          path: "customer-care",
          element: <SaleCustomerCarePage />,
        },
      ],
    },
    {
      path: PATH_DISPATCHER_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="Dispatcher">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_DISPATCHER_DASHBOARD.dispatch.root} replace />,
          index: true,
        },
        {
          path: "dispatch",
          element: <DispatchPage />,
        },
        {
          path: "schedules",
          element: <DispatchSchedulesPage />,
        },
        {
          path: "trips",
          element: <DispatchTripsPage />,
        },
        {
          path: "tracking",
          element: <TrackingTripsPage />,
        },
        {
          path: "tracking/:tripId",
          element: <TrackingTripDetailPage />,
        },
        {
          path: "incidents",
          element: <DispatcherIncidentPage />,
        },
        {
          path: "incidents/:incidentId",
          element: <DispatcherIncidentDetailPage />,
        },
        {
          path: "shipment",
          element: <ShipmentPage />,
        },
        {
          path: "shipment/:id",
          element: <ShipmentDetailPage />,
        },
      ],
    },
    // Add the 404 route
    {
      path: "/404",
      element: <Page404 />,
    },
    // Catch all unmatched routes
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
