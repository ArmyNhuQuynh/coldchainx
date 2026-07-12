import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  USER_FILTER_ALL,
  USER_SORT_OPTIONS,
} from "@/schemas/user.schema";
import { USER_ROLE_OPTIONS } from "@/types/enums/user-role.enum";
import { USER_STATUS_OPTIONS } from "@/types/enums/user-status.enum";
import { FilterX, RefreshCw, Search } from "lucide-react";

type Props = {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  order: "asc" | "desc";
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onOrderChange: (value: "asc" | "desc") => void;
  onReset: () => void;
  onRefresh: () => void;
};

const roleOptions = [
  { label: "Tất cả role", value: USER_FILTER_ALL },
  ...USER_ROLE_OPTIONS,
];

const statusOptions = [
  { label: "Tất cả trạng thái", value: USER_FILTER_ALL },
  ...USER_STATUS_OPTIONS,
];

const UserFilterBar = ({
  search,
  role,
  status,
  sortBy,
  order,
  isLoading,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortByChange,
  onOrderChange,
  onReset,
  onRefresh,
}: Props) => {
  return (
    <Card className="rounded-lg px-4 py-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_190px_170px_130px_auto] lg:items-end">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Tìm kiếm</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              placeholder="Tên, email, username..."
              className="pl-9"
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Role</p>
          <Select value={role} onValueChange={onRoleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Sắp xếp</p>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_SORT_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Thứ tự</p>
          <Select
            value={order}
            onValueChange={(value) => onOrderChange(value as "asc" | "desc")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mới trước</SelectItem>
              <SelectItem value="asc">Cũ trước</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            disabled={isLoading}
            onClick={onRefresh}
          >
            <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={onReset}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserFilterBar;
