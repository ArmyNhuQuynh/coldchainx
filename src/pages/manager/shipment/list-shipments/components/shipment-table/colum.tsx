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
import { PATH_MANAGER_DASHBOARD } from "@/routes/path";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type TShipment = {
    id: string;
    shipmentCode: string;
    customerName: string;
    route: string;
    cargoType: string;
    vehicleNumber?: string;
    driverName?: string;
    depositStatus: "PAID" | "UNPAID";
    pickupTime: string;
    status:
    | "PENDING"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "LATE"
    | "INCIDENT";
};

const getStatusBadge = (status: TShipment["status"]) => {
    switch (status) {
        case "IN_TRANSIT":
            return (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                    Đang vận chuyển
                </Badge>
            );

        case "DELIVERED":
            return (
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    Đã giao
                </Badge>
            );

        case "LATE":
            return (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                    Trễ hạn
                </Badge>
            );

        case "INCIDENT":
            return (
                <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                    Sự cố
                </Badge>
            );

        default:
            return (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                    Chờ xử lý
                </Badge>
            );
    }
};

const getDepositBadge = (
    depositStatus: TShipment["depositStatus"]
) => {
    if (depositStatus === "PAID") {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                Đã cọc
            </Badge>
        );
    }

    return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
            Chưa cọc
        </Badge>
    );
};

const ActionCell = ({ shipment }: { shipment: TShipment }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-9 px-3 rounded-xl"
                            onClick={() =>
                                navigate(
                                    PATH_MANAGER_DASHBOARD.shipment.edit(
                                        shipment.id
                                    )
                                )
                            }
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        Xem chi tiết lô hàng
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button
                variant="ghost"
                size="icon"
            >
                <MoreHorizontal className="h-5 w-5" />
            </Button>
        </div>
    );
};

export const columns: ColumnDef<TShipment>[] = [
    {
        accessorKey: "shipmentCode",
        header: ({ column }) =>
            createFormattedHeader(
                "Mã lô hàng",
                column,
                { align: "left" }
            ),

        cell: ({ row }) => {
            const shipmentCode = row.getValue(
                "shipmentCode"
            ) as string;

            return createFormattedCell(
                <span className="font-semibold text-primary">
                    {shipmentCode}
                </span>,
                {
                    align: "left",
                    tooltip: shipmentCode,
                }
            );
        },

        size: 150,
    },

    {
        accessorKey: "customerName",
        header: ({ column }) =>
            createFormattedHeader(
                "Khách hàng",
                column,
                { align: "left" }
            ),

        cell: ({ row }) => {
            const customerName = row.getValue(
                "customerName"
            ) as string;

            return createFormattedCell(
                <span className="font-semibold">
                    {customerName}
                </span>,
                {
                    align: "left",
                    tooltip: customerName,
                }
            );
        },

        size: 180,
    },

    {
        accessorKey: "route",
        header: ({ column }) =>
            createFormattedHeader(
                "Tuyến đường",
                column,
                { align: "left" }
            ),

        cell: ({ row }) => {
            const route = row.getValue(
                "route"
            ) as string;

            return createFormattedCell(route, {
                align: "left",
                tooltip: route,
            });
        },

        size: 220,
    },

    {
        accessorKey: "cargoType",
        header: ({ column }) =>
            createFormattedHeader(
                "Loại hàng",
                column,
                { align: "left" }
            ),

        cell: ({ row }) => {
            const cargoType = row.getValue(
                "cargoType"
            ) as string;

            return createFormattedCell(
                cargoType,
                {
                    align: "left",
                }
            );
        },

        size: 120,
    },

    {
        id: "vehicleDriver",
        header: ({ column }) =>
            createFormattedHeader(
                "Xe / Tài xế",
                column,
                { align: "left" }
            ),

        cell: ({ row }) => {
            const shipment = row.original;

            return createFormattedCell(
                <div className="flex flex-col">
                    <span className="font-medium">
                        {shipment.vehicleNumber || "—"}
                    </span>

                    <span className="text-sm text-muted-foreground">
                        {shipment.driverName || "—"}
                    </span>
                </div>,
                {
                    align: "left",
                }
            );
        },

        size: 180,
    },

    {
        accessorKey: "depositStatus",
        header: ({ column }) =>
            createFormattedHeader(
                "Cọc",
                column,
                { align: "center" }
            ),

        cell: ({ row }) => {
            const depositStatus = row.getValue(
                "depositStatus"
            ) as TShipment["depositStatus"];

            return createFormattedCell(
                getDepositBadge(depositStatus),
                {
                    align: "center",
                }
            );
        },

        size: 120,
    },

    {
        accessorKey: "pickupTime",
        header: ({ column }) =>
            createFormattedHeader(
                "Lấy hàng",
                column,
                { align: "center" }
            ),

        cell: ({ row }) => {
            const pickupTime = row.getValue(
                "pickupTime"
            ) as string;

            return createFormattedCell(
                pickupTime,
                {
                    align: "center",
                }
            );
        },

        size: 130,
    },

    {
        accessorKey: "status",
        header: ({ column }) =>
            createFormattedHeader(
                "Trạng thái",
                column,
                { align: "center" }
            ),

        cell: ({ row }) => {
            const status = row.getValue(
                "status"
            ) as TShipment["status"];

            return createFormattedCell(
                getStatusBadge(status),
                {
                    align: "center",
                }
            );
        },

        size: 180,
    },

    {
        id: "actions",
        header: ({ column }) =>
            createFormattedHeader(
                "Hành động",
                column,
                { align: "center" }
            ),

        cell: ({ row }) => (
            <ActionCell
                shipment={row.original}
            />
        ),

        size: 180,
    },
];