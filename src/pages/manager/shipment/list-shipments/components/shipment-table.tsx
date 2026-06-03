import { DataTable } from "@/components/table/data-table";

import { handleApiError } from "@/lib/error";
import { useQueryParams } from "@/hooks/use-query-params";
import { columns, type TShipment } from "./shipment-table/colum";

type Props = {};

const mockShipments: TShipment[] = [
  {
    id: "1",
    shipmentCode: "SH-2024-1001",
    customerName: "Vinamilk",
    route: "TP.HCM → Hà Nội",
    cargoType: "Sữa",
    vehicleNumber: "51C-12345",
    driverName: "Trần Văn B",
    depositStatus: "PAID",
    pickupTime: "05/06 07:37",
    status: "IN_TRANSIT",
  },

  {
    id: "2",
    shipmentCode: "SH-2024-1002",
    customerName: "VinFast Logistics",
    route: "Hải Phòng → Đà Nẵng",
    cargoType: "Đông lạnh",
    vehicleNumber: "29H-77821",
    driverName: "Lê Thị C",
    depositStatus: "UNPAID",
    pickupTime: "05/06 08:37",
    status: "DELIVERED",
  },

  {
    id: "3",
    shipmentCode: "SH-2024-1003",
    customerName: "Bộ Y Tế",
    route: "Hà Nội → Cần Thơ",
    cargoType: "Vắc xin",
    vehicleNumber: "30A-44521",
    driverName: "Phạm Văn D",
    depositStatus: "PAID",
    pickupTime: "05/06 09:37",
    status: "LATE",
  },

  {
    id: "4",
    shipmentCode: "SH-2024-1004",
    customerName: "Masan Group",
    route: "Bình Dương → Nha Trang",
    cargoType: "Hải sản",
    vehicleNumber: "",
    driverName: "",
    depositStatus: "PAID",
    pickupTime: "05/06 10:37",
    status: "PENDING",
  },

  {
    id: "5",
    shipmentCode: "SH-2024-1005",
    customerName: "C.P Việt Nam",
    route: "Đồng Nai → Quảng Ninh",
    cargoType: "Thịt",
    vehicleNumber: "51F-99102",
    driverName: "Hoàng Văn E",
    depositStatus: "PAID",
    pickupTime: "05/06 11:37",
    status: "INCIDENT",
  },
];

const ShipmentTable = (_: Props) => {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    filter,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams({
    defaultFilter: [
      {
        id: "shipmentCode",
        value: "",
      },

      {
        id: "customerName",
        value: "",
      },
    ],
  });

  try {
    // MOCK FILTER
    const shipmentCodeFilter =
      (filter.find(
        (f) => f.id === "shipmentCode"
      )?.value as string) || "";

    const customerNameFilter =
      (filter.find(
        (f) => f.id === "customerName"
      )?.value as string) || "";

    let filteredData = mockShipments.filter(
      (shipment) => {
        const matchShipmentCode =
          shipment.shipmentCode
            .toLowerCase()
            .includes(
              shipmentCodeFilter.toLowerCase()
            );

        const matchCustomer =
          shipment.customerName
            .toLowerCase()
            .includes(
              customerNameFilter.toLowerCase()
            );

        return (
          matchShipmentCode &&
          matchCustomer
        );
      }
    );

    // MOCK SORT
    if (sortBy) {
      filteredData = [...filteredData].sort(
        (a, b) => {
          const aValue =
            a[
              sortBy as keyof TShipment
            ]?.toString() || "";

          const bValue =
            b[
              sortBy as keyof TShipment
            ]?.toString() || "";

          return isAsc
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      );
    }

    // MOCK PAGINATION
    const total = filteredData.length;

    const start =
      currentPage * pageSize;

    const paginatedData =
      filteredData.slice(
        start,
        start + pageSize
      );

    const searchValues = filter.map(
      (f) => ({
        ...f,

        searchPlaceholder:
          f.id === "shipmentCode"
            ? "Tìm kiếm theo mã lô hàng"
            : f.id === "customerName"
            ? "Tìm kiếm theo khách hàng"
            : "",
      })
    );

    const sortValue = {
      id: sortBy,
      desc: !isAsc,
    };

    return (
      <DataTable
        data={paginatedData}
        totalItems={total}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={false}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setFilter}
        searchValues={searchValues}
        onSortChange={(newSort) => {
          setSort(
            newSort[0].id,
            !newSort[0].desc
          );
        }}
        sortValues={[sortValue]}
      />
    );
  } catch (error) {
    handleApiError(error);

    return null;
  }
};

export default ShipmentTable;