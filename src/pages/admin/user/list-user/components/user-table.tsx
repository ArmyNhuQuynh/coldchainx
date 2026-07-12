import { DataTable } from "@/components/table/data-table";
import type { TUserProfile } from "@/schemas/user.schema";
import { columns } from "./user-table-columns";

type Props = {
  users: TUserProfile[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (user: TUserProfile) => void;
};

const UserTable = ({
  users,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: Props) => {
  return (
    <DataTable
      data={users}
      totalItems={totalItems}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={onRowClick}
      onSearchChange={() => {}}
      searchValues={[]}
      onSortChange={() => {}}
      sortValues={[]}
    />
  );
};

export default UserTable;

