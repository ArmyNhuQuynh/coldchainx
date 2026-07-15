import { DataTable } from "@/components/table/data-table";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { columns } from "./iot-device-table/columns";

type Props = {
  devices: TIotDevice[];
  isLoading?: boolean;
};

const IotDeviceTable = ({ devices, isLoading = false }: Props) => {
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
      onSearchChange={() => {}}
      searchValues={[]}
      onSortChange={() => {}}
      sortValues={[]}
    />
  );
};

export default IotDeviceTable;
