import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isFetching?: boolean;
  onRefresh: () => void;
};

const DashboardFilterBar = ({ children, isFetching, onRefresh }: Props) => (
  <Card className="gap-4 rounded-lg p-4 shadow-sm">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
