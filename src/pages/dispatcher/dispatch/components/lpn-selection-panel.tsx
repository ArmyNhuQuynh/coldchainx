import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TDispatchReadyLpn } from "@/schemas/dispatch.schema";
import {
  Box,
  CalendarDays,
  MapPin,
  PackageCheck,
  Route,
  Scale,
  Snowflake,
} from "lucide-react";
import {
  formatDate,
  formatNumber,
  getLpnDispatchDateKey,
  getLpnDispatchDateValue,
  getLpnWarehouseName,
  getTemperatureGroup,
  getTemperatureGroupLabel,
} from "./dispatch-helpers";

type Props = {
  lpns: TDispatchReadyLpn[];
  selectedIds: string[];
  selectedDateKey?: string;
  isLoading?: boolean;
  onToggle: (lpn: TDispatchReadyLpn) => void;
};

const LpnSelectionPanel = ({
  lpns,
  selectedIds,
  selectedDateKey,
  isLoading,
  onToggle,
}: Props) => {
  return (
    <Card className="min-h-[620px] gap-0 rounded-lg py-0">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageCheck className="h-5 w-5 text-emerald-700" />
              LPN đã ở trong kho
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedIds.length}/{lpns.length} LPN đang được chọn
            </p>
          </div>
          <Badge variant="outline">{lpns.length} kết quả</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[560px]">
          <div className="space-y-3 p-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}

            {!isLoading && lpns.length === 0 && (
              <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <Box className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">Không có LPN phù hợp</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thử đổi bộ lọc hoặc tải lại dữ liệu
                </p>
              </div>
            )}

            {!isLoading &&
              lpns.map((lpn) => {
                const checked = selectedIds.includes(lpn.lpnId);
                const dateKey = getLpnDispatchDateKey(lpn);
                const blockedByDate =
                  !!selectedDateKey &&
                  !!dateKey &&
                  selectedDateKey !== dateKey &&
                  !checked;
                const tempGroup = getTemperatureGroup(lpn.tempCondition);

                return (
                  <Button
                    key={lpn.lpnId}
                    type="button"
                    variant="outline"
                    disabled={blockedByDate}
                    onClick={() => onToggle(lpn)}
                    className={cn(
                      "h-auto w-full justify-start rounded-lg border p-0 text-left shadow-none",
                      checked
                        ? "border-emerald-600 bg-emerald-50/70 text-foreground"
                        : "bg-background hover:bg-muted/50",
                      blockedByDate && "opacity-50"
                    )}
                  >
                    <div className="flex w-full gap-3 p-4">
                      <div className="pt-1">
                        <Checkbox checked={checked} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{lpn.lpnCode}</span>
                          {lpn.trackingCode && (
                            <Badge variant="outline">{lpn.trackingCode}</Badge>
                          )}
                          {lpn.routeCode && (
                            <Badge variant="outline" className="bg-violet-50 text-violet-800">
                              {lpn.routeCode}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={cn(
                              tempGroup === "FROZEN" && "bg-sky-100 text-sky-800",
                              tempGroup === "CHILLED" && "bg-cyan-100 text-cyan-800",
                              tempGroup === "AMBIENT" && "bg-stone-100 text-stone-800"
                            )}
                          >
                            {getTemperatureGroupLabel(tempGroup)}
                          </Badge>
                        </div>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {lpn.itemName || "Không có tên hàng"}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {getLpnWarehouseName(lpn)}
                          </span>
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Route className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {lpn.destinationAddress || "Chưa có điểm trả hàng"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(getLpnDispatchDateValue(lpn))}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Scale className="h-3.5 w-3.5" />
                            {formatNumber(lpn.actualWeightKg)} kg · {formatNumber(lpn.actualCbm)} m³
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Snowflake className="h-3.5 w-3.5" />
                            {lpn.tempCondition || "—"}
                          </span>
                        </div>

                        {lpn.label && (
                          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                            {lpn.label}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LpnSelectionPanel;
