import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isFetching?: boolean;
  onRefresh: () => void;
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4 | 5;
};

const DashboardFilterBar = ({
  children,
  isFetching,
  onRefresh,
  title,
  description,
  columns = 4,
}: Props) => (
  <Card className="gap-4 rounded-lg border p-4 shadow-sm">
    {(title || description) && (
      <div className="border-b pb-3">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div
        className={cn(
          "grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2",
          columns === 2 && "lg:grid-cols-2",
          columns === 3 && "lg:grid-cols-3",
          columns === 4 && "lg:grid-cols-4",
          columns === 5 && "xl:grid-cols-5"
        )}
      >
        {children}
      </div>
      <Button
        type="button"
        variant="outline"
        className="gap-2 lg:self-end"
        disabled={isFetching}
        onClick={onRefresh}
      >
        <RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Làm mới
      </Button>
    </div>
  </Card>
);

export default DashboardFilterBar;
