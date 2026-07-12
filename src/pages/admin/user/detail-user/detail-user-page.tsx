import { useUser } from "@/hooks/use-user";
import { useParams } from "react-router-dom";
import UserAdminActions from "./components/user-admin-actions";
import UserDetailHeader from "./components/user-detail-header";
import UserDetailInfo from "./components/user-detail-info";

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById } = useUser();
  const { data, isLoading } = getUserById(id);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy user
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDetailHeader user={user} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserDetailInfo user={user} />
        </div>
        <UserAdminActions user={user} />
      </div>
    </div>
  );
};

export default UserDetailPage;

