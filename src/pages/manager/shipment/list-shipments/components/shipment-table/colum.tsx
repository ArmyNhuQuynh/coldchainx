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
import { getOrderCategoryLabel } from "@/types/enums/order-category.enum";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import type { TOrder } from "@/schemas/order.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const ActionCell = ({ order }: { order: TOrder }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-9 px-3 rounded-xl"
                            onClick={() => navigate(order.orderId)}
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

export const columns: ColumnDef<TOrder>[] = [
    {
        accessorKey: "trackingCode",
        header: ({ column }) =>
            createFormattedHeader("Mã lô hàng", column, { align: "left" }),

        cell: ({ row }) => {
            const trackingCode = row.getValue("trackingCode") as string;

            return createFormattedCell(
                <span className="font-semibold text-primary">
                    {trackingCode}
                </span>,
                { align: "left", tooltip: trackingCode }
            );
        },

        size: 200,
    },

    {
        accessorKey: "customerName",
        header: ({ column }) =>
            createFormattedHeader("Khách hàng", column, { align: "left" }),

        cell: ({ row }) => {
            const customerName = row.getValue("customerName") as string;

            return createFormattedCell(
                <span className="font-semibold">{customerName}</span>,
                { align: "left", tooltip: customerName }
            );
        },

        size: 180,
    },

    {
        id: "destination",
        header: ({ column }) =>
            createFormattedHeader("Tuyến đường", column, { align: "left" }),

        cell: ({ row }) => {
            const address = row.original.destination?.address ?? "—";

            return createFormattedCell(address, {
                align: "left",
                tooltip: address,
            });
        },

        size: 220,
    },

    {
        accessorKey: "category",
        header: ({ column }) =>
            createFormattedHeader("Loại hàng", column, { align: "left" }),

        cell: ({ row }) => {
            const category = row.getValue("category") as TOrder["category"];
            const { label, className } = getOrderCategoryLabel(category);

            return createFormattedCell(
                <Badge className={`${className} hover:opacity-90`}>
                    {label}
                </Badge>,
                { align: "left" }
            );
        },

        size: 200,
    },

    {
        accessorKey: "createdAt",
        header: ({ column }) =>
            createFormattedHeader("Lấy hàng", column, { align: "center" }),

        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string | null;
            const formatted = createdAt
                ? format(new Date(createdAt), "dd/MM HH:mm")
                : "—";

            return createFormattedCell(formatted, { align: "center" });
        },

        size: 130,
    },

    {
        accessorKey: "status",
        header: ({ column }) =>
            createFormattedHeader("Trạng thái", column, { align: "center" }),

        cell: ({ row }) => {
            const status = row.getValue("status") as TOrder["status"];
            const { label, className } = getOrderStatusLabel(status);

            return createFormattedCell(
                <Badge className={`${className} hover:opacity-90`}>
                    {label}
                </Badge>,
                { align: "center" }
            );
        },

        size: 180,
    },

    {
        id: "actions",
        header: ({ column }) =>
            createFormattedHeader("Hành động", column, { align: "center" }),

        cell: ({ row }) => <ActionCell order={row.original} />,

        size: 180,
    },
];
