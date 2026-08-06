import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyText?: string;
};

const DashboardChartCard = ({
  title,
  description,
  children,
  isEmpty,
  emptyText = "Chưa có dữ liệu trong khoảng thời gian này.",
}: Props) => (
  <Card className="h-full gap-4 rounded-lg py-5 shadow-sm">
    <CardHeader className="px-5">
      <CardTitle className="text-base">{title}</CardTitle>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </CardHeader>
    <CardContent className="min-h-72 px-5">
      {isEmpty ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <BarChart3 className="mb-3 h-7 w-7 text-muted-foreground" />
          <p className="text-sm font-medium">Chưa có số liệu</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {emptyText}
          </p>
        </div>
      ) : (
        children
      )}
    </CardContent>
  </Card>
);

export default DashboardChartCard;
