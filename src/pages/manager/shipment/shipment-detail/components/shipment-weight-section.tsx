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
        <CardContent className="pt-4">
            <p className="text-xs uppercase text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${isActual && value ? "text-green-600" : ""}`}>
                {value ?? <span className="text-muted-foreground text-base font-normal italic">Chưa cập nhật</span>}
            </p>
        </CardContent>
    </Card>
);

const OrderWeightSection = ({ order }: Props) => {
    return (
        <Card>
            <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center gap-2">
                <Weight className="h-5 w-5" />
                Khối lượng & Kích thước
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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