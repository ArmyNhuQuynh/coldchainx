import { DataTable } from "@/components/table/data-table";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { columns } from "./iot-device-table/columns";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import { useNavigate } from "react-router-dom";

type Props = {
  devices: TIotDevice[];
  isLoading?: boolean;
};

const IotDeviceTable = ({ devices, isLoading = false }: Props) => {
  const navigate = useNavigate();
  const pageSize = Math.max(devices.length, 1);

  return (
    <DataTable
      data={devices}
      totalItems={devices.length}
      columns={columns}
      currentPage={1}
      pageSize={pageSize}
      isLoading={isLoading}
      isPagingProp={false}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
      onRowClick={(device) =>
        navigate(PATH_ADMIN_DASHBOARD.iotDevice.detail(device.deviceId))
      }
      onSearchChange={() => {}}
      searchValues={[]}
      onSortChange={() => {}}
      sortValues={[]}
    />
  );
};

export default IotDeviceTable;
