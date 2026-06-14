import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TVehicle } from "@/schemas/vehicle.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleActionCell = ({ vehicle }: { vehicle: TVehicle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() =>
              navigate(PATH_ADMIN_DASHBOARD.vehicle.detail(vehicle.vehicleId))
            }
          >
            <EyeIcon className="h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigate(PATH_ADMIN_DASHBOARD.vehicle.edit(vehicle.vehicleId))
            }
          >
            <PencilIcon className="h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<TVehicle>[] = [
  {
    accessorKey: "truckPlate",
    header: ({ column }) =>
      createFormattedHeader("Biển số", column, { align: "left" }),
    cell: ({ row }) => {
      const truckPlate = row.getValue("truckPlate") as TVehicle["truckPlate"];

      return createFormattedCell(truckPlate, {
        align: "left",
        tooltip: truckPlate ?? undefined,
      });
    },
    size: 160,
  },
  {
    accessorKey: "brand",
    header: ({ column }) =>
      createFormattedHeader("Hãng xe", column, { align: "left" }),
    cell: ({ row }) => {
      const brand = row.getValue("brand") as TVehicle["brand"];

      return createFormattedCell(brand, {
        align: "left",
        tooltip: brand ?? undefined,
      });
    },
    size: 180,
  },
  {
    accessorKey: "vehicleType",
    header: ({ column }) =>
      createFormattedHeader("Loại xe", column, { align: "left" }),
    cell: ({ row }) => {
      const vehicleType = row.getValue(
        "vehicleType"
      ) as TVehicle["vehicleType"];

      return createFormattedCell(vehicleType, {
        align: "left",
        tooltip: vehicleType ?? undefined,
      });
    },
    size: 180,
  },
  {
    accessorKey: "maxWeight",
    header: ({ column }) =>
      createFormattedHeader("Tải trọng", column, { align: "center" }),
    cell: ({ row }) => {
      const maxWeight = row.getValue("maxWeight") as TVehicle["maxWeight"];

      return createFormattedCell(maxWeight, { align: "center" });
    },
    size: 140,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as TVehicle["status"];

      return createFormattedCell(status, {
        align: "center",
        tooltip: status ?? undefined,
      });
    },
    size: 160,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <VehicleActionCell vehicle={row.original} />,
    size: 100,
  },
];
