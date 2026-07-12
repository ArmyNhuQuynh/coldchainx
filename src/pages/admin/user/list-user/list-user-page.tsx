import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import {
  USER_FILTER_ALL,
  type TUserListParams,
} from "@/schemas/user.schema";
import { USER_STATUS, normalizeUserStatus } from "@/types/enums/user-status.enum";
import { ShieldCheck, UserCog, UserPlus, Users, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCreateDialog from "../components/user-create-dialog";
import UserFilterBar from "./components/user-filter-bar";
import UserTable from "./components/user-table";

const defaultFilters = {
  page: 1,
  pageSize: 20,
  search: "",
  role: USER_FILTER_ALL,
  status: USER_FILTER_ALL,
  sortBy: "createdat",
  order: "desc" as const,
};

const ListUserPage = () => {
  const { getUsers } = useUser();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const params: TUserListParams = useMemo(
    () => ({
      page: filters.page,
      pageSize: filters.pageSize,
      search: filters.search.trim() || undefined,
      role: filters.role === USER_FILTER_ALL ? undefined : filters.role,
      status:
        filters.status === USER_FILTER_ALL
          ? undefined
          : (filters.status as TUserListParams["status"]),
      sortBy: filters.sortBy,
      order: filters.order,
    }),
    [filters]
  );

  const { data, isFetching, refetch } = getUsers(params);
  const response = data?.data;
  const users = response?.items ?? [];
  const totalItems = response?.totalItems ?? 0;

  const stats = [
    {
      title: "Tổng user",
      value: totalItems,
      icon: Users,
      color: "text-foreground",
    },
    {
      title: "Trang hiện tại",
      value: users.length,
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "Đang hoạt động",
      value: users.filter(
        (user) => normalizeUserStatus(user.status) === USER_STATUS.ACTIVE
      ).length,
      icon: ShieldCheck,
      color: "text-green-500",
    },
    {
      title: "Nhân viên kho",
      value: users.filter((user) => user.role === "WarehouseOperator").length,
      icon: Warehouse,
      color: "text-emerald-500",
    },
  ];

  const updateFilters = (updates: Partial<typeof defaultFilters>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const handleCreated = (userId: string) => {
    if (userId) {
      navigate(PATH_ADMIN_DASHBOARD.user.detail(userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý User</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý tài khoản nội bộ, role, trạng thái và mật khẩu đăng nhập
          </p>
        </div>
        <Button className="rounded-xl" onClick={() => setCreateOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm User
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl px-4 py-6 flex flex-col items-center justify-center"
          >
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-5 w-5" />
              <p className="text-sm">{item.title}</p>
            </div>
            <h2 className={`text-4xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </Card>
        ))}
      </div>

      <UserFilterBar
        search={filters.search}
        role={filters.role}
        status={filters.status}
        sortBy={filters.sortBy}
        order={filters.order}
        isLoading={isFetching}
        onSearchChange={(search) => updateFilters({ search, page: 1 })}
        onRoleChange={(role) => updateFilters({ role, page: 1 })}
        onStatusChange={(status) => updateFilters({ status, page: 1 })}
        onSortByChange={(sortBy) => updateFilters({ sortBy, page: 1 })}
        onOrderChange={(order) => updateFilters({ order, page: 1 })}
        onReset={() => setFilters(defaultFilters)}
        onRefresh={() => refetch()}
      />

      <UserTable
        users={users}
        totalItems={totalItems}
        currentPage={response?.page ?? filters.page}
        pageSize={response?.pageSize ?? filters.pageSize}
        isLoading={isFetching}
        onPageChange={(page) => updateFilters({ page })}
        onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
        onRowClick={(user) => navigate(PATH_ADMIN_DASHBOARD.user.detail(user.userId))}
      />

      <UserCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default ListUserPage;
