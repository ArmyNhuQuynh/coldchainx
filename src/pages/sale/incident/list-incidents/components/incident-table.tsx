import { DataTable } from "@/components/table/data-table";
import type {
  TDiscrepancyTableRow,
  TPendingDiscrepancy,
} from "@/schemas/discrepancy.schema";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidentColumns } from "./incident-table-columns";

type Props = {
  data: TPendingDiscrepancy[];
  isLoading: boolean;
  onRefresh: () => void;
};

const PAGE_SIZE = 10;

const toTableRow = (item: TPendingDiscrepancy): TDiscrepancyTableRow => ({
  ...item,
  id: item.lpnId,
  status: "DISCREPANCY_HOLD",
});

const matchesSearch = (item: TPendingDiscrepancy, search: string) => {
  if (!search.trim()) return true;

  const keyword = search.trim().toLowerCase();
  return [
    item.trackingCode,
    item.customerName,
    item.itemName,
    item.discrepancyReason,
    item.asnCode,
    item.lpnCode,
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(keyword));
};

const IncidentTable = ({ data, isLoading, onRefresh }: Props) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () => data.filter((item) => matchesSearch(item, search)).map(toTableRow),
    [data, search]
  );

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [currentPage, pageSize, rows]);

  const handleSearchChange = (filters: ColumnFiltersState) => {
    const nextSearch = String(
      filters.find((filter) => filter.id === "search")?.value ?? ""
    );
    setSearch(nextSearch);
    setCurrentPage(1);
  };

  return (
    <DataTable
      data={pagedRows}
      totalItems={rows.length}
      columns={incidentColumns}
      currentPage={currentPage}
      pageSize={pageSize}
      isLoading={isLoading}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      onRowClick={(row) => navigate(row.lpnId)}
      onSearchChange={handleSearchChange}
      searchValues={[
        {
          id: "search",
          value: search,
          searchPlaceholder: "Tìm tracking, khách hàng, ASN, LPN...",
        },
      ]}
      onSortChange={() => {}}
      sortValues={[]}
      onRefresh={onRefresh}
    />
  );
};

export default IncidentTable;
