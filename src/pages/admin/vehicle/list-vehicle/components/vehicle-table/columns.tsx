import {
    createFormattedCell,
    createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { getVehicleStatusLabel } from "@/types/enums/vehicle-status.enum";
import { getVehicleTypeLabel } from "@/types/enums/vehicle-type.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getVehicleStatusBadge = (status: string | number | null | undefined) => {
    const statusLabel = getVehicleStatusLabel(status);

    return (
        <Badge className={statusLabel.className}>
            {status == null || status === "" ? "—" : statusLabel.label}
        </Badge>
    );
};

const ActionCell = ({ vehicle }: { vehicle: TVehicle }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-9 px-3 rounded-xl"
                            onClick={() => navigate(vehicle.vehicleId)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xem chi tiết xe</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
            </Button>
        </div>
    );
};

export const columns: ColumnDef<TVehicle>[] = [
    {
        accessorKey: "truckPlate",
        header: ({ column }) =>
            createFormattedHeader("Biển số", column, { align: "left" }),
        cell: ({ row }) => {
            const truckPlate = row.getValue("truckPlate") as string;
            return createFormattedCell(
                <span className="font-semibold text-primary">{truckPlate ?? "—"}</span>,
                { align: "left", tooltip: truckPlate }
            );
        },
        size: 140,
    },

    {
        accessorKey: "brand",
        header: ({ column }) =>
            createFormattedHeader("Đầu kéo / Model", column, { align: "left" }),
        cell: ({ row }) => {
            const brand = row.getValue("brand") as string;
            const vehicleType = row.original.vehicleType;
            return createFormattedCell(
                <div className="flex flex-col">
                    <span className="font-semibold">{brand ?? "—"}</span>
                    <span className="text-xs text-muted-foreground">
                        {vehicleType ? getVehicleTypeLabel(vehicleType) : "—"}
                    </span>
                </div>,
                { align: "left" }
            );
        },
        size: 200,
    },

    {
        accessorKey: "maxWeight",
        header: ({ column }) =>
            createFormattedHeader("Tải trọng", column, { align: "center" }),
        cell: ({ row }) => {
            const maxWeight = row.getValue("maxWeight") as number;
            return createFormattedCell(
                <span>{maxWeight ? `${maxWeight} tấn` : "—"}</span>,
                { align: "center" }
            );
        },
        size: 120,
    },

    {
        accessorKey: "maxCbm",
        header: ({ column }) =>
            createFormattedHeader("Thể tích (CBM)", column, { align: "center" }),
        cell: ({ row }) => {
            const maxCbm = row.getValue("maxCbm") as number;
            return createFormattedCell(
                <span>{maxCbm ? `${maxCbm} m³` : "—"}</span>,
                { align: "center" }
            );
        },
        size: 140,
    },

    {
        id: "tempRange",
        header: ({ column }) =>
            createFormattedHeader("Dải nhiệt", column, { align: "center" }),
        cell: ({ row }) => {
            const { minTemp, maxTemp } = row.original;
            return createFormattedCell(
                <span>{`${minTemp}°C ~ ${maxTemp}°C`}</span>,
                { align: "center" }
            );
        },
        size: 150,
    },

    {
        accessorKey: "status",
        header: ({ column }) =>
            createFormattedHeader("Trạng thái", column, { align: "center" }),
        cell: ({ row }) => {
            const status = row.getValue("status") as string | null;
            return createFormattedCell(
                getVehicleStatusBadge(status),
                { align: "center" }
            );
        },
        size: 160,
    },

    {
        id: "actions",
        header: ({ column }) =>
            createFormattedHeader("Hành động", column, { align: "center" }),
        cell: ({ row }) => <ActionCell vehicle={row.original} />,
        size: 180,
    },
];
