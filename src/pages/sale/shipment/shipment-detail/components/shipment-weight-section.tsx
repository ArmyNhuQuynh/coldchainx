import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TOrder } from "@/schemas/order.schema";
import { Weight } from "lucide-react";

type Props = {
    order: TOrder;
};

const WeightCard = ({
    label,
    value,
    isActual = false,
}: {
    label: string;
    value: string | null;
    isActual?: boolean;
}) => (
    <div className="rounded-lg border bg-background p-3.5">
        <p className="mb-1 text-[11px] uppercase text-muted-foreground">{label}</p>
        <p className={`text-lg font-bold ${isActual && value ? "text-green-600" : ""}`}>
            {value ?? <span className="text-sm font-normal italic text-muted-foreground">Chưa cập nhật</span>}
        </p>
    </div>
);

const formatNumber = (value?: number | null, suffix = "") => {
    if (value === null || value === undefined) return null;
    return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 3 })}${suffix}`;
};

const getCbmMethodLabel = (method?: string | null) => {
    switch (method) {
        case "CUSTOMER_PROVIDED_TOTAL_CBM":
            return "Khách cung cấp tổng CBM";
        case "DENSITY_FACTOR":
            return "Ước tính theo loại hàng";
        case "LEGACY_DIMENSION":
            return "Theo kích thước D x R x C";
        default:
            return null;
    }
};

const OrderWeightSection = ({ order }: Props) => {
    const dimension =
        order.lengthCm && order.widthCm && order.heightCm
            ? `${order.lengthCm} x ${order.widthCm} x ${order.heightCm} cm`
            : null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
                <Weight className="h-5 w-5" />
                Khối lượng & Kích thước
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <WeightCard
                        label="Expected Weight"
                        value={formatNumber(order.expectedWeightKg, " kg")}
                    />
                    <WeightCard
                        label="Expected CBM"
                        value={formatNumber(order.expectedCbm, " m³")}
                    />
                    <WeightCard
                        label="Tổng số kiện"
                        value={formatNumber(order.totalPackageQuantity ?? order.quantity, " kiện")}
                    />
                    <WeightCard
                        label="Kích thước"
                        value={dimension}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderWeightSection;
