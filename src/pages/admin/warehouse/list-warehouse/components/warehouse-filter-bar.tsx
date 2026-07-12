import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterX, RefreshCw, Search } from "lucide-react";

type Props = {
  search: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  onRefresh: () => void;
};

const WarehouseFilterBar = ({
  search,
  isLoading,
  onSearchChange,
  onReset,
  onRefresh,
}: Props) => {
  return (
    <Card className="rounded-lg px-4 py-3">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_auto] md:items-end">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Tìm kiếm</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              placeholder="Mã kho, tên kho, địa chỉ..."
              className="pl-9"
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            disabled={isLoading}
            onClick={onRefresh}
          >
            <RefreshCw
              className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={onReset}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WarehouseFilterBar;
