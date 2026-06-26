import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Search } from "lucide-react";
import { ALL_TRIP_STATUS, getTripStatusLabel } from "./trip-helpers";

type Props = {
  search: string;
  status: string;
  statusCounts?: Record<string, number>;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
};

const statusTabs = [
  ALL_TRIP_STATUS,
  "PLANNED",
  "PICKING",
  "LOADING_COMPLETED",
];

const TripFilterBar = ({
  search,
  status,
  statusCounts,
  isLoading,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: Props) => {
  return (
    <Card className="rounded-lg px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm trip, xe, tài xế..."
            className="pl-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
          Tải lại
        </Button>
      </div>

      <Tabs value={status} onValueChange={onStatusChange} className="mt-4">
        <TabsList className="flex w-full gap-2 overflow-x-auto border-b-0">
          {statusTabs.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="h-9 shrink-0 rounded-md border px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:border-b-primary"
            >
              <span>
                {item === ALL_TRIP_STATUS ? "Tất cả" : getTripStatusLabel(item)}
              </span>
              <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {statusCounts?.[item] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Card>
  );
};

export default TripFilterBar;
