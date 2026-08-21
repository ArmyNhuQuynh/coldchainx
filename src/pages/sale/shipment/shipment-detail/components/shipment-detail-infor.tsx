import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import { getOrderCategoryLabel } from "@/types/enums/order-category.enum";
import type { TOrder } from "@/schemas/order.schema";
import { Badge } from "@/components/ui/badge";
import {
    Hash,
    Tag,
    User,
    Calendar,
    Package,
    PackageCheck,
    Layers,
    Thermometer,
    DollarSign,
    CalendarClock,
    Route,
    Phone,
} from "lucide-react";
import { format } from "date-fns";

type Props = {
    order: TOrder;
};

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-center justify-between gap-3 border-b py-1.5 last:border-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Icon className="h-4 w-4" />
            {label}
        </div>
        <div className="min-w-0 break-words text-right text-xs font-medium sm:text-sm">{value}</div>
    </div>
);

const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "—";

    return `${value.toLocaleString("vi-VN")}đ`;
};

const formatPackageLineLabel = (
    line: NonNullable<TOrder["packageLines"]>[number]
) => {
    if (line.label?.trim()) return line.label;
    if (line.capacityKg) return `Thùng ${line.capacityKg.toLocaleString("vi-VN")} kg`;
    return "Loại thùng";
};

const OrderDetailInfo = ({ order }: Props) => {
    const { label: statusLabel, className: statusClass } = getOrderStatusLabel(order.status);
    const { label: categoryLabel } = getOrderCategoryLabel(order.category);
    const quotations = order.quotations ?? [];
    const packageLines = order.packageLines ?? [];
    const packageSummary =
        packageLines.length > 0
            ? packageLines
                .map((line) => `${formatPackageLineLabel(line)}: ${line.quantity} cái`)
                .join(", ")
            : order.packingType;

    return (
        <Card>
            <CardHeader className="p-4 pb-2 text-base font-semibold">
                Thông tin chi tiết lô hàng
                <Badge className={`${statusClass} ml-2 hover:opacity-90`}>{statusLabel}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    {/* Cột trái - Định danh */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Định danh đơn hàng
                        </p>
                        <InfoRow icon={Tag} label="Mã order" value={
                            <span className="text-primary font-semibold">{order.trackingCode}</span>
                        } />
                        <InfoRow
                            icon={User}
                            label="Người gửi"
                            value={order.customerContactName || order.customerName || "—"}
                        />
                        <InfoRow icon={Calendar} label="Created At" value={
                            order.createdAt
                                ? format(new Date(order.createdAt), "HH:mm:ss dd/MM/yyyy")
                                : "—"
                        } />

                        <p className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
                            Thông tin hàng hóa
                        </p>
                        <InfoRow icon={Package} label="Tên Hàng" value={order.itemName} />
                        <InfoRow icon={Layers} label="Loại hàng hóa" value={categoryLabel} />
                        <InfoRow icon={Hash} label="Tổng số kiện" value={order.totalPackageQuantity ?? order.quantity} />
                        <InfoRow icon={Package} label="Loại đóng gói" value={order.packingType} />
                        <InfoRow icon={Thermometer} label="Nhiệt độ" value={`${order.tempCondition}°C`} />
                        <InfoRow icon={DollarSign} label="Giá trị hàng hóa" value={
                            formatCurrency(order.cargoValue)
                        } />
                    </div>

                    {/* Cột phải - Điểm giao hàng */}
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Lịch vận chuyển
                        </p>
                        <InfoRow
                            icon={CalendarClock}
                            label="Tên lịch"
                            value={order.schedule?.scheduleName ?? "—"}
                        />
                        <InfoRow
                            icon={Route}
                            label="Tuyến"
                            value={order.route
                                ? `${order.route.routeCode} · ${order.route.originCity} → ${order.route.destCity}`
                                : "—"}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Khởi hành"
                            value={order.schedule
                                ? `${format(new Date(order.schedule.departureDate), "dd/MM/yyyy")} ${order.schedule.departureTime.slice(0, 5)}`
                                : "—"}
                        />
                        <InfoRow
                            icon={CalendarClock}
                            label="Cut-off"
                            value={order.schedule?.cutOffTime.slice(0, 5) ?? "—"}
                        />

                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                            Điểm giao hàng
                        </p>
                        <InfoRow icon={User} label="Người nhận" value={order.receiverName ?? "—"} />
                        <InfoRow icon={Phone} label="SĐT người nhận" value={order.receiverPhone ?? "—"} />
                        <InfoRow icon={Tag} label="Address" value={order.destination?.address ?? "—"} />
                    </div>
                </div>

                {packageLines.length > 0 && (
                    <div className="mt-4 rounded-lg border bg-muted/20 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                            Chi tiết loại thùng
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {packageLines.map((line, index) => (
                                <div
                                    key={line.orderPackageLineId ?? `${line.label}-${index}`}
                                    className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm"
                                >
                                    <span className="min-w-0 truncate font-medium">
                                        {formatPackageLineLabel(line)}
                                    </span>
                                    <span className="shrink-0 text-muted-foreground">
                                        {line.quantity} cái
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderDetailInfo;
