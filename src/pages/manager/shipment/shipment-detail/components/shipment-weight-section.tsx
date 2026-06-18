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
    <Card>
        <CardContent className="p-3.5">
            <p className="mb-1 text-[11px] uppercase text-muted-foreground">{label}</p>
            <p className={`text-lg font-bold ${isActual && value ? "text-green-600" : ""}`}>
                {value ?? <span className="text-sm font-normal italic text-muted-foreground">Chưa cập nhật</span>}
            </p>
        </CardContent>
    </Card>
);

const OrderWeightSection = ({ order }: Props) => {
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
                        value={order.expectedWeightKg ? `${order.expectedWeightKg} kg` : null}
                    />
                    <WeightCard
                        label="Actual Weight"
                        value={order.actualWeightKg ? `${order.actualWeightKg} kg` : null}
                        isActual
                    />
                    <WeightCard
                        label="Expected CBM"
                        value={order.expectedCbm ? `${order.expectedCbm} m³` : null}
                    />
                    <WeightCard
                        label="Actual CBM"
                        value={order.actualCbm ? `${order.actualCbm} m³` : null}
                        isActual
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderWeightSection;
