import ShipmentTable from "./components/shipment-table";

type Props = {};

const ShipmentPage = (_: Props) => {
  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Quản lý lô hàng
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Duyệt, báo giá, điều phối và theo dõi
            toàn bộ lô hàng
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="min-w-0">
        <ShipmentTable />
      </div>
    </div>
  );
};

export default ShipmentPage;
