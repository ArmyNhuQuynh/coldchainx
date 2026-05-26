// routes.tsx
// import LoadingScreen from "@/components/loading-screen";
import LoadingScreen from "#/components/loading-screen";
import { ErrorFallback } from "@/components/error-fallback";
import AuthGuard from "@/guards/auth-guard";
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
  PATH_MANAGER_DASHBOARD,
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

// const GeneralAppPage = Loadable(lazy(() => import("@/pages/general-app")));
// const GeneralEcommercePage = Loadable(
//   lazy( () => import( "@/pages/general-ecommerce" ) )
// );


//System admin
const Page404 = Loadable(lazy(() => import("@/pages/page-404")));


export const AppRoutes = () =>
  useRoutes([
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
        <RoleBasedGuard role="SystemAdmin">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_ADMIN_DASHBOARD.general.app} replace />,
          index: true,
        },
        {
          path: "app",
          // element: <GeneralAppPage />,
        },
      ],
    },
    // Store Admin Dashboard routes
    {
      path: "/",
      element: (
        <AuthGuard>
          <DashBoardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_MANAGER_DASHBOARD.root} replace />,
          index: true,
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
