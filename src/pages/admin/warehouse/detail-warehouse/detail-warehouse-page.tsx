import { useWarehouse } from "@/hooks/use-warehouse";
import { useParams } from "react-router-dom";
import WarehouseDetailHeader from "./components/warehouse-detail-header";
import WarehouseDetailInfo from "./components/warehouse-detail-info";
import WarehouseStatusCard from "./components/warehouse-status-card";

const DetailWarehousePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getWarehouseById } = useWarehouse();
  const { data, isLoading } = getWarehouseById(id);

  const warehouse = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Không tìm thấy kho
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WarehouseDetailHeader warehouse={warehouse} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WarehouseDetailInfo warehouse={warehouse} />
        </div>
        <div>
          <WarehouseStatusCard warehouse={warehouse} />
        </div>
      </div>
    </div>
  );
};

export default DetailWarehousePage;
