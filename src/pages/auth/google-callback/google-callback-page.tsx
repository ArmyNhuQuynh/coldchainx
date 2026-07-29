import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { logout, setUser } from "@/redux/User/user-slice";
import {
  PATH_ADMIN_DASHBOARD,
  PATH_AUTH,
  PATH_DISPATCHER_DASHBOARD,
  PATH_MANAGER_DASHBOARD,
  PATH_SALE_DASHBOARD,
} from "@/routes/path";
import type { TAuthResponse } from "@/schemas/auth.schema";
import type { TRole } from "@/schemas/role.schema";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const resolveManagementRole = (role?: string | null): TRole | null => {
  switch (role?.trim().toLowerCase()) {
    case "admin":
    case "systemadmin":
      return "Admin";
    case "manager":
    case "systemmanager":
      return "Manager";
    case "sale":
    case "sales":
      return "Sale";
    case "dispatcher":
      return "Dispatcher";
    default:
      return null;
  }
};

const getDashboardPath = (role: TRole) => {
  switch (role) {
    case "Admin":
      return PATH_ADMIN_DASHBOARD.vehicle.root;
    case "Manager":
      return PATH_MANAGER_DASHBOARD.shipment.root;
    case "Sale":
      return PATH_SALE_DASHBOARD.shipment.root;
    case "Dispatcher":
      return PATH_DISPATCHER_DASHBOARD.dispatch.root;
  }
};

const GoogleCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exchangeGoogleLoginCodeMutation } = useAuth();
  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (exchangeStarted.current) return;
    exchangeStarted.current = true;

    const code = searchParams.get("code");
    if (!code) {
      dispatch(logout());
      toast.error("Không thể đăng nhập bằng Google.", {
        description: "Mã xác thực không tồn tại hoặc đã hết hạn.",
      });
      navigate(PATH_AUTH.login, { replace: true });
      return;
    }

    const exchangeCode = async () => {
      try {
        const response =
          await exchangeGoogleLoginCodeMutation.mutateAsync(code);
        const googleAuth = response.data;
        const role = resolveManagementRole(googleAuth.user.role);

        if (!role) {
          dispatch(logout());
          toast.error("Tài khoản không có quyền truy cập web quản lý.", {
            description:
              "Web chỉ dành cho Admin, Manager, Sale và Dispatcher.",
          });
          navigate(PATH_AUTH.login, { replace: true });
          return;
        }

        const authData: TAuthResponse = {
          userId: googleAuth.user.userId,
          username: googleAuth.user.username,
          fullName: googleAuth.user.fullName,
          email: googleAuth.user.email,
          role,
          accessToken: googleAuth.token,
          refreshToken: googleAuth.refreshToken,
          accessTokenExpiresAt: googleAuth.expiresAt,
        };

        dispatch(setUser(authData));
        navigate(getDashboardPath(role), { replace: true });
      } catch (error) {
        dispatch(logout());
        handleApiError(error);
        navigate(PATH_AUTH.login, { replace: true });
      }
    };

    void exchangeCode();
  }, [
    dispatch,
    exchangeGoogleLoginCodeMutation,
    navigate,
    searchParams,
  ]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-5 text-xl font-semibold">
          Đang xác thực tài khoản Google
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
