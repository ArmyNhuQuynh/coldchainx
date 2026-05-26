import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


// const adminRoutes = {
//   dashboard: {
//     mainTitle: "Dashboard",
//     items: [
//       {
//         title: "Nhật ký hệ thống",
//         url: PATH_ADMIN_DASHBOARD..root,
//         icon: HomeIcon,
//       },
//     ],
//   },
//   brand: {
//     mainTitle: "Quản lý thương hiệu",
//     items: [
//       {
//         title: "Danh sách thương hiệu",
//         url: PATH_ADMIN_DASHBOARD.brand.root,
//         icon: HomeIcon,
//       },
//     ],
//   },
//   systemManagement: {
//     mainTitle: "Quản lý hệ thống",
//     items: [
//       {
//         title: "Phương thức thanh toán",
//         url: PATH_ADMIN_DASHBOARD.systemPaymentMethod.root,
//         icon: GeneralAppIcon,
//       },
//     ],
//   },
// };


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
            {/* <img
              className={cn(open ? "size-15" : "size-8", "duration-300")}
              src={brandData?.data.data.pictureUrl || storeLogoImage || "https://s3-hcm5-r1.longvan.net/19429498-dimpos/0a8eae54-e987-4205-9fb8-c0e3b5266f9f.jpg"}
              alt="Ảnh đại diện"
            /> */}
          </div>
          {open && (
            <div className="cursor-pointer" onClick={toggleSidebar}>
              {/* <CollapseIcon className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" /> */}
            </div>
          )}
        </div>
      </SidebarHeader>
      {(() => {
        switch (role) {
          // case "SystemAdmin":
          //   return (
          //     <SidebarContent>
          //       <NavMain content={adminRoutes.dashboard} />
          //       <NavMain content={adminRoutes.brand} />
          //       <NavMain content={adminRoutes.systemManagement} />
          //     </SidebarContent>
          //   );
          default:
            return null;
        }
      })()}
      <SidebarRail />
    </Sidebar>
  );
}
