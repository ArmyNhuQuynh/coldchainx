import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { HomeIcon, TruckIcon } from "lucide-react";
import {
  PATH_ADMIN_DASHBOARD,
  PATH_DISPATCHER_DASHBOARD,
  PATH_MANAGER_DASHBOARD,
  PATH_SALE_DASHBOARD,
} from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import { NavMain } from "./nav-main";

const adminRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Quản lý",
        url: PATH_ADMIN_DASHBOARD.root,
        icon: HomeIcon,
      },
    ],
  },
  operations: {
    mainTitle: "Vận hành",
    items: [
      {
        title: "Xe tải",
        url: PATH_ADMIN_DASHBOARD.vehicle.root,
        icon: TruckIcon,
      },
    ],
  },
};

const managerRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Quản lý",
        url: PATH_MANAGER_DASHBOARD.root,
        icon: HomeIcon,
      },
    ],
  },
  operations: {
    mainTitle: "Vận hành",
    items: [
      {
        title: "Lô hàng",
        url: PATH_MANAGER_DASHBOARD.shipment.root,
        icon: HomeIcon,
      },
      {
        title: "Thiết bị",
        url: "",
        icon: HomeIcon,
      },
      {
        title: "Tài xế",
        url: "",
        icon: HomeIcon,
      },
    ],
  },
  coordinationAndManagement: {
    mainTitle: "Điều phối & Quản lý",
    items: [
      {
        title: "Yêu cầu nhiên liệu",
        url: "",
        icon: HomeIcon,
      },
      {
        title: "Sự cố",
        url: "",
        icon: HomeIcon,
      },
    ],
  },
  customer: {
    mainTitle: "Khách hàng",
    items: [
      {
        title: "Tư vấn",
        url: "",
        icon: HomeIcon,
      },
    ],
  },
  management: {
    mainTitle: "Quản lý",
    items: [
      {
        title: "Tài khoản",
        url: "",
        icon: HomeIcon,
      },
    ],
  },
  settings: {
    mainTitle: "Cài đặt",
    items: [
      {
        title: "Cài đặt chung",
        url: "",
        icon: HomeIcon,
      },
    ],
  },
};

const saleRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Quản lý",
        url: PATH_SALE_DASHBOARD.root,
        icon: HomeIcon,
      },
    ],
  },
  operations: {
    mainTitle: "Vận hành",
    items: [
      {
        title: "Lô hàng",
        url: PATH_SALE_DASHBOARD.shipment.root,
        icon: HomeIcon,
      },
    ],
  },
};

const dispatcherRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Quản lý",
        url: PATH_DISPATCHER_DASHBOARD.root,
        icon: HomeIcon,
      },
    ],
  },
  operations: {
    mainTitle: "Vận hành",
    items: [
      {
        title: "Lô hàng",
        url: PATH_DISPATCHER_DASHBOARD.shipment.root,
        icon: HomeIcon,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useSelector((state: RootState) => state.user);
  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between my-0">
          <div
            className="cursor-pointer"
            onClick={open ? undefined : toggleSidebar}
          >
            {/* Logo */}
          </div>
          {open && (
            <div className="cursor-pointer" onClick={toggleSidebar}>
              {/* CollapseIcon */}
            </div>
          )}
        </div>
      </SidebarHeader>

      {(() => {
        switch (role) {
          case ERole.Admin:
            return (
              <SidebarContent>
                <NavMain content={adminRoutes.dashboard} />
                <NavMain content={adminRoutes.operations} />
              </SidebarContent>
            );

          case ERole.Manager:
            return (
              <SidebarContent>
                <NavMain content={managerRoutes.dashboard} />
                <NavMain content={managerRoutes.operations} />
                <NavMain content={managerRoutes.coordinationAndManagement} />
                <NavMain content={managerRoutes.customer} />
                <NavMain content={managerRoutes.management} />
                <NavMain content={managerRoutes.settings} />
              </SidebarContent>
            );

          case ERole.Sale:
            return (
              <SidebarContent>
                <NavMain content={saleRoutes.dashboard} />
                <NavMain content={saleRoutes.operations} />
              </SidebarContent>
            );

          case ERole.Dispatcher:
            return (
              <SidebarContent>
                <NavMain content={dispatcherRoutes.dashboard} />
                <NavMain content={dispatcherRoutes.operations} />
              </SidebarContent>
            );

          default:
            return null;
        }
      })()}

      <SidebarRail />
    </Sidebar>
  );
}
