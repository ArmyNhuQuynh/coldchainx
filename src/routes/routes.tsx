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
          element: <Navigate to={PATH_DISPATCHER_DASHBOARD.shipment.root} replace />,
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
    // Add the 404 route
    {
      path: "/404",
      element: <Page404 />,
    },
    // Catch all unmatched routes
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
