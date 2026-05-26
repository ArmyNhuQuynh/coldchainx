import type { RootState } from "@/redux/store";
import { PATH_ADMIN_DASHBOARD, PATH_MANAGER_DASHBOARD } from "@/routes/path";
// import type { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type GuestGuardProps = {
    children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
    const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

    if (isAuthenticated) {
        switch (role) {
            case 'Admin':
                return <Navigate to={PATH_ADMIN_DASHBOARD.general.app} />;
            case 'Manager':
                return <Navigate to={PATH_MANAGER_DASHBOARD.general.app} />;
            default:
                return <Navigate to='/404' />;
        }
    }

    return <>{children}</>;
}