import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import
{
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";


import
{
  type ColumnDef,
  type ColumnFilter,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import
{
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { DateTimePicker } from "../ui/date-time-picker";
import { format } from "date-fns";



interface SearchStateProps extends ColumnFilter
{
  searchPlaceholder?: string;
  isSelect?: boolean;
  options?: { label: string; value: string }[];
  isStartDate?: boolean;
  isEndDate?: boolean;
}

interface DataTableProps<TData, TValue>
{
  isShort?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: ( page: number ) => void;
  onPageSizeChange: ( size: number ) => void;
  onRowClick?: ( row: TData ) => void;
  isLoading?: boolean;
  isPagingProp?: boolean;
  pageSizeOptions?: number[];
  // Search props
  searchValues?: SearchStateProps[];
  onSearchChange?: ( value: ColumnFiltersState ) => void;
  // Sort props
  sortValues?: SortingState;
  onSortChange?: ( value: SortingState ) => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  title?: string;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (
    newSelection: Record<string, boolean>,
    oldSelection: Record<string, boolean>
  ) => void;
  meta?: TableMeta<TData>;
}

// Skeleton component for loading state
function TableSkeleton<TData, TValue> ( {
  columns,
  pageSize,
}: {
  columns: ColumnDef<TData, TValue>[];
  pageSize: number;
} )
{
  // Create an array of skeleton rows based on the current page size
  const skeletonRows = Array.from( { length: pageSize }, ( _, index ) => index );

  return (
    <Table className="relative">
      <TableHeader>
        <TableRow>
          { columns.map( ( _, index ) => (
            <TableHead key={ index }>
              {/* Skeleton for header text with varying widths to look more natural */ }
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ) ) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { skeletonRows.map( ( rowIndex ) => (
          <TableRow key={ rowIndex }>
            { columns.map( ( _, colIndex ) => (
              <TableCell key={ colIndex }>
                {/* Skeleton for cell content with varying widths */ }
                <Skeleton
                  className={ `h-4 ${
                    // Vary the width to make it look more realistic
                    colIndex % 3 === 0
                      ? "w-24"
                      : colIndex % 3 === 1
                        ? "w-32"
                        : "w-16"
                    }` }
                />
              </TableCell>
            ) ) }
          </TableRow>
        ) ) }
      </TableBody>
    </Table>
  );
}

export function DataTable<TData, TValue> ( {
  isShort = false,
  columns,
  data,
  totalItems,
  onRowClick,
  pageSizeOptions = [ 5, 10, 20, 30, 40, 50, 100, 200, 500 ],
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isPagingProp = true,
  isLoading = false,
  // Search props
  searchValues = [],
  onSearchChange,
  // Sort props
  sortValues = [],
  onSortChange,
  showRefresh = true,
  onRefresh,
  showSettings = true,
  onSettings,
  rowSelection,
  onRowSelectionChange,
  meta,
}: DataTableProps<TData, TValue> )
{
  const [ rowSelectionState, setRowSelectionState ] = useState( {} );

  const [ inputValues, setInputValues ] = useState<Record<string, string>>( () =>
    Object.fromEntries( searchValues.map( ( f ) => [ f.id, String( f.value ?? "" ) ] ) )
  );

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize,
  };

  const searchState = searchValues;

  const sortingState = sortValues;

  const pageCount = Math.ceil( totalItems / pageSize );

  const handlePaginationChange = (
    updater: PaginationState | ( ( old: PaginationState ) => PaginationState )
  ) =>
  {
    const next =
      typeof updater === "function" ? updater( paginationState ) : updater;
    onPageChange( next.pageIndex + 1 );
    onPageSizeChange( next.pageSize );
  };

  const handleColumnFiltersChange = (
    updater:
      | ColumnFiltersState
      | ( ( old: ColumnFiltersState ) => ColumnFiltersState )
  ) =>
  {
    const next = typeof updater === "function" ? updater( searchState ) : updater;
    if ( onSearchChange )
    {
      onSearchChange( next );
    }
  };

  const handleSortingChange = (
    updater: SortingState | ( ( old: SortingState ) => SortingState )
  ) =>
  {
    const next = typeof updater === "function" ? updater( [] ) : updater;
    if ( onSortChange )
    {
      onSortChange( next );
    }
  };

  const handleRowSelectionChange = (
    updater:
      | Record<string, boolean>
      | ( ( old: Record<string, boolean> ) => Record<string, boolean> )
  ) =>
  {
    const oldSelection = rowSelection; // Lưu state cũ
    const newSelection =
      typeof updater === "function" ? updater( rowSelection! ) : updater;

    if ( onRowSelectionChange )
    {
      // Trả về cả new và old state
      onRowSelectionChange( newSelection, oldSelection! );
    }
  };

  const table = useReactTable( {
    getRowId: ( row ) => ( row as any ).id,
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
      columnFilters: searchState,
      sorting: sortingState,
      rowSelection: rowSelection ?? rowSelectionState,
    },
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange:
      ( onRowSelectionChange && handleRowSelectionChange ) ||
      setRowSelectionState,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    meta,
  } );

  return (
    <div className="space-y-4 ">
      {/* Enhanced Header Section */ }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
        <div className="flex flex-1 items-end gap-4">
          {/* More Search Input */ }
          { onSearchChange &&
            searchValues.map( ( search ) =>
            {
              const currentValue = inputValues[ search.id ] ?? "";
              if ( search.isStartDate || search.isEndDate )
              {
                // Find the current start and end date values from the search state
                const startDateValue = searchValues.find( s => s.isStartDate )?.value;
                const endDateValue = searchValues.find( s => s.isEndDate )?.value;

                // Determine the constraints based on the *other* date
                // If this is the EndDate picker, its `fromDate` is the current StartDate
                const fromDate = search.isEndDate && startDateValue ? new Date( startDateValue as string ) : undefined;

                // If this is the StartDate picker, its `toDate` is the current EndDate
                const toDate = search.isStartDate && endDateValue ? new Date( endDateValue as string ) : undefined;
                return (
                  <div className="flex flex-col gap-1" key={ search.id }>
                    <div className="text-sm font-medium text-muted-foreground">
                      { search.searchPlaceholder }
                    </div>
                    <DateTimePicker
                      date={
                        search.value ? new Date( search.value as string ) : undefined
                      }
                      setDate={ ( date ) =>
                      {
                        const newFilters: ColumnFiltersState = searchValues.map(
                          ( s ) => ( {
                            id: s.id,
                            value:
                              s.id === search.id
                                // v-- 2. THIS IS THE LINE TO CHANGE
                                ? date ? format( date, "yyyy-MM-dd'T'HH:mm:ss" ) : null
                                : s.value,
                          } )
                        );
                        onSearchChange?.( newFilters );
                      } }
                      placeholder={ search.searchPlaceholder }
                      disabled={ isLoading }
                      fromDate={ fromDate }
                      toDate={ toDate }
                    />
                  </div>
                );
              }

              if ( !search.isSelect )
              {
                return (
                  <div
                    key={ search.id }
                    className="relative flex-1 max-w-sm bg-sidebar rounded-lg"
                  >
                    <Input
                      placeholder={ search.searchPlaceholder || "Tìm kiếm..." }
                      value={ currentValue }
                      onChange={ ( e ) =>
                        setInputValues( ( prev ) => ( {
                          ...prev,
                          [ search.id ]: e.target.value,
                        } ) )
                      }
                      onKeyDown={ ( e ) =>
                      {
                        if ( e.key === "Enter" )
                        {
                          const newFilters: ColumnFiltersState = searchValues.map(
                            ( s ) => ( {
                              id: s.id,
                              value: inputValues[ s.id ] ?? "",
                            } )
                          );
                          onSearchChange?.( newFilters );
                        }
                      } }
                      className="py-5 rounded-lg text-base placeholder:text-base"
                      disabled={ isLoading }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-r-lg"
                      onClick={ () =>
                      {
                        const newFilters: ColumnFiltersState = searchValues.map(
                          ( s ) => ( {
                            id: s.id,
                            value: inputValues[ s.id ] ?? "",
                          } )
                        );
                        onSearchChange?.( newFilters );
                      } }
                      disabled={ isLoading }
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                );
              }
              return (
                <div className="flex flex-col gap-1" key={ search.id }>
                  <div className="text-sm font-medium text-muted-foreground">
                    { search.searchPlaceholder || "Tìm kiếm" }
                  </div>
                  <div className="bg-sidebar rounded-lg">
                    <Select
                      value={ search.value as string }
                      onValueChange={ ( value ) =>
                      {
                        const newFilters: ColumnFiltersState = searchValues.map(
                          ( s ) => ( {
                            id: s.id,
                            value: s.id === search.id ? value : s.value,
                          } )
                        );
                        console.log( "onSearchChange", newFilters );
                        onSearchChange?.( newFilters );
                      } }
                      disabled={ isLoading }
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={ search.searchPlaceholder } />
                      </SelectTrigger>
                      <SelectContent>
                        { search.options?.map( ( option ) => (
                          <SelectItem key={ option.value } value={ option.value }>
                            { option.label }
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            } ) }
        </div>

        {/* Action Buttons */ }
        <div className="flex items-center gap-2">
          { showRefresh && onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={ onRefresh }
              disabled={ isLoading }
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) }
          { showSettings && onSettings && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={ onSettings }
              disabled={ isLoading }
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          ) }
        </div>
      </div>


      {/* Table Container with improved styling */ }
      <div className="rounded-2xl border bg-card">
        <ScrollArea
          // orientation="horizontal"
          className={ cn(
            isShort
              ? "h-[calc(30vh)] md:h-[calc(30dvh)]"
              : "h-[calc(80vh-280px)] md:h-[calc(90dvh-250px)]",
            "rounded-tr-2xl rounded-tl-2xl"
          ) }
        >
          {/* Conditionally render skeleton or actual table based on loading state */ }
          { isLoading ? (
            <TableSkeleton columns={ columns } pageSize={ pageSize } />
          ) : (
            <Table className="relative">
              <TableHeader className="rounded-lg sticky z-10 top-0 bg-table-header">
                { table.getHeaderGroups().map( ( headerGroup ) => (
                  <TableRow
                    key={ headerGroup.id }
                    className="rounded-lg transition-colors hover:bg-table-header"
                  >
                    { headerGroup.headers.map( ( header ) => (
                      <TableHead
                        key={ header.id }
                        className="h-12 px-4 text-left align-middle font-medium text-foreground"
                      >
                        { header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) }
                      </TableHead>
                    ) ) }
                  </TableRow>
                ) ) }
              </TableHeader>
              <TableBody>
                { table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map( ( row, _ ) => (
                    <TableRow
                      key={ row.id }
                      data-state={ row.getIsSelected() && "selected" }
                      onClick={ () => onRowClick && onRowClick( row.original ) }
                      className={ cn(
                        "bg-sidebar transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                        onRowClick ? "cursor-pointer" : ""
                      ) }
                    >
                      { row.getVisibleCells().map( ( cell ) => (
                        <TableCell
                          key={ cell.id }
                          className="px-4 py-3 align-middle"
                        >
                          { flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ) }
                        </TableCell>
                      ) ) }
                    </TableRow>
                  ) )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={ columns.length }
                      className="h-24 text-center text-muted-foreground"
                    >
                      { searchValues.length > 0
                        ? "Không tìm thấy kết quả phù hợp."
                        : "Chưa có dữ liệu." }
                    </TableCell>
                  </TableRow>
                ) }
              </TableBody>
            </Table>
          ) }
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Enhanced Pagination Section */ }
        { isPagingProp && (
          <div className="flex flex-col items-center justify-end gap-4 border-t px-4 py-4 sm:flex-row">
            {/* Page Size Selector */ }
            <div className="flex flex-col items-center gap-6 justify-end sm:flex-row">
              <div className="flex items-center gap-2">
                <p className="whitespace-nowrap text-sm font-medium">
                  Số hàng mỗi trang:
                </p>
                <Select
                  value={ `${ paginationState.pageSize }` }
                  onValueChange={ ( value ) =>
                  {
                    table.setPageSize( Number( value ) );
                  } }
                  disabled={ isLoading }
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={ paginationState.pageSize } />
                  </SelectTrigger>
                  <SelectContent side="top">
                    { pageSizeOptions.map( ( pageSize ) => (
                      <SelectItem key={ pageSize } value={ `${ pageSize }` }>
                        { pageSize }
                      </SelectItem>
                    ) ) }
                  </SelectContent>
                </Select>
              </div>

              {/* Page Info */ }
              <div className="flex-1 text-sm text-muted-foreground">
                { isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : totalItems > 0 ? (
                  <>
                    Hiển thị{ " " }
                    <span className="font-medium">
                      { paginationState.pageIndex + 1 }
                    </span>{ " " }
                    trên{ " " }
                    <span className="font-medium">{ table.getPageCount() }</span>
                  </>
                ) : (
                  "Không có dữ liệu"
                ) }
              </div>

              {/* Navigation Buttons */ }
              <div className="flex items-center gap-2">
                {/* Previous Arrow */ }
                <Button
                  type="button"
                  aria-label="Trang trước"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={ () => onPageChange( currentPage - 1 ) }
                  disabled={ currentPage === 1 || isLoading }
                >
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </Button>

                {/* Page Numbers */ }
                { ( () =>
                {
                  const totalPages = table.getPageCount();
                  const current = currentPage;
                  const pages = [];

                  // Calculate which pages to show
                  // This logic creates a smart pagination that shows relevant page numbers
                  let startPage = Math.max( 1, current - 2 );
                  let endPage = Math.min( totalPages, current + 2 );

                  // Adjust range to always show 5 pages when possible
                  if ( endPage - startPage < 4 )
                  {
                    if ( startPage === 1 )
                    {
                      endPage = Math.min( totalPages, startPage + 4 );
                    } else if ( endPage === totalPages )
                    {
                      startPage = Math.max( 1, endPage - 4 );
                    }
                  }

                  // Always show first page if not in range
                  if ( startPage > 1 )
                  {
                    pages.push(
                      <Button
                        type="button"
                        key={ 1 }
                        variant={ 1 === current ? "default" : "outline" }
                        className="h-6 w-6 p-0"
                        onClick={ () => onPageChange( 1 ) }
                        disabled={ isLoading }
                      >
                        1
                      </Button>
                    );

                    // Add ellipsis if there's a gap
                    if ( startPage > 2 )
                    {
                      pages.push(
                        <span
                          key="ellipsis-start"
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }
                  }

                  // Add the main range of pages
                  for ( let i = startPage; i <= endPage; i++ )
                  {
                    pages.push(
                      <Button
                        type="button"
                        key={ i }
                        variant={ i === current ? "default" : "outline" }
                        className="h-6 w-6 p-0"
                        onClick={ () => onPageChange( i ) }
                        disabled={ isLoading }
                      >
                        { i }
                      </Button>
                    );
                  }

                  // Always show last page if not in range
                  if ( endPage < totalPages )
                  {
                    // Add ellipsis if there's a gap
                    if ( endPage < totalPages - 1 )
                    {
                      pages.push(
                        <span
                          key="ellipsis-end"
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    pages.push(
                      <Button
                        type="button"
                        key={ totalPages }
                        variant={ totalPages === current ? "default" : "outline" }
                        className="h-6 w-6 p-0"
                        onClick={ () => onPageChange( totalPages ) }
                        disabled={ isLoading }
                      >
                        { totalPages }
                      </Button>
                    );
                  }

                  return pages;
                } )() }

                {/* Next Arrow */ }
                <Button
                  type="button"
                  aria-label="Trang sau"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={ () => onPageChange( currentPage + 1 ) }
                  disabled={ currentPage >= table.getPageCount() || isLoading }
                >
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}
