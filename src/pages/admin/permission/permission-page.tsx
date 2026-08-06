import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { usePermission } from "@/hooks/use-permission";
import RolePermissionTab from "./components/role-permission-tab";
import UserPermissionTab from "./components/user-permission-tab";

const PermissionPage = () => {
  const { getRolePermissionMatrix } = usePermission();
  const matrixQuery = getRolePermissionMatrix();
  const matrix = matrixQuery.data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Quản lý phân quyền</h1>
        <p className="mt-1 text-muted-foreground">
          Thiết lập quyền mặc định theo vai trò và quyền ngoại lệ cho từng người
          dùng.
        </p>
      </div>

      {matrixQuery.isLoading ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Đang tải dữ liệu phân quyền...
        </div>
      ) : matrixQuery.isError || !matrix ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center">
          <div>
            <p className="font-semibold text-rose-700">
              Không tải được dữ liệu phân quyền
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Vui lòng kiểm tra kết nối hoặc quyền truy cập của tài khoản Admin.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void matrixQuery.refetch()}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles">Theo vai trò</TabsTrigger>
            <TabsTrigger value="users">Theo người dùng</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-0">
            <RolePermissionTab matrix={matrix} />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <UserPermissionTab matrix={matrix} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PermissionPage;
