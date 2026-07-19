import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TDispatchReadyLpn } from "@/schemas/dispatch.schema";
import { DISPATCH_TEMPERATURE_GROUP } from "@/types/enums/dispatch.enum";
import type { CSSProperties } from "react";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PackageCheck,
  Route,
  Scale,
  Snowflake,
  UserRound,
} from "lucide-react";
import {
  formatNumber,
  getLpnWarehouseName,
  getTemperatureGroup,
  getTemperatureGroupLabel,
} from "./dispatch-helpers";

type Props = {
  lpns: TDispatchReadyLpn[];
  selectedIds: string[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  hasSchedule: boolean;
  isLoading?: boolean;
  isChecking?: boolean;
  panelHeight?: number | null;
  onToggle: (lpn: TDispatchReadyLpn) => void;
  onPageChange: (page: number) => void;
};

const LpnSelectionPanel = ({
  lpns,
  selectedIds,
  totalRecords,
  currentPage,
  totalPages,
  hasSchedule,
  isLoading,
  isChecking,
  panelHeight,
  onToggle,
  onPageChange,
}: Props) => {
  const panelStyle = panelHeight
    ? ({
        "--dispatch-lpn-panel-height": `${panelHeight}px`,
      } as CSSProperties)
    : undefined;

  return (
    <Card
      style={panelStyle}
      className="flex min-h-[620px] flex-col gap-0 overflow-hidden rounded-lg py-0 xl:h-[var(--dispatch-lpn-panel-height)] xl:min-h-0"
    >
      <CardHeader className="border-b px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageCheck className="h-5 w-5 text-emerald-700" />
              LPN đã ở trong kho
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedIds.length} LPN đang được chọn
            </p>
          </div>
          <Badge variant="outline">
            {isChecking ? "Đang kiểm tra..." : `${totalRecords} LPN phù hợp`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <ScrollArea className="min-h-[520px] flex-1 xl:min-h-0">
          <div className="space-y-2.5 p-3">
            {isLoading && lpns.length === 0 &&
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full" />
              ))}

            {!isLoading && lpns.length === 0 && (
              <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <Box className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">
                  {hasSchedule ? "Không có LPN phù hợp" : "Chọn lịch vận chuyển"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasSchedule
                    ? "Không còn LPN nào có thể ghép với tập đang chọn"
                    : "Danh sách LPN sẽ được tải theo lịch đã chọn"}
                </p>
              </div>
            )}

            {!isLoading &&
              lpns.map((lpn) => {
                const checked = selectedIds.includes(lpn.lpnId);
                const tempGroup = getTemperatureGroup(lpn.tempCondition);
                const disabled = !checked && Boolean(isChecking);

                return (
                  <Button
                    key={lpn.lpnId}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => onToggle(lpn)}
                    className={cn(
                      "h-auto w-full justify-start overflow-hidden rounded-lg border p-0 text-left whitespace-normal shadow-none",
                      checked
                        ? "border-emerald-600 bg-emerald-50/70 text-foreground"
                        : "bg-background hover:bg-muted/50"
                    )}
                  >
                    <div className="flex min-w-0 w-full gap-3 p-3.5">
                      <div className="shrink-0 pt-1">
                        <Checkbox checked={checked} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="max-w-full truncate font-semibold sm:max-w-[240px]">
                            {lpn.lpnCode}
                          </span>
                          {lpn.trackingCode && (
                            <Badge
                              variant="outline"
                              className="max-w-[180px] truncate"
                              title={lpn.trackingCode}
                            >
                              {lpn.trackingCode}
                            </Badge>
                          )}
                          {checked && (
                            <Badge className="bg-emerald-700 text-white">Đã chọn</Badge>
                          )}
                          {lpn.routeName && (
                            <Badge
                              variant="outline"
                              className="max-w-[160px] truncate bg-violet-50 text-violet-800"
                              title={lpn.routeName}
                            >
                              {lpn.routeName}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={cn(
                              tempGroup === DISPATCH_TEMPERATURE_GROUP.FROZEN &&
                                "bg-sky-100 text-sky-800",
                              tempGroup === DISPATCH_TEMPERATURE_GROUP.CHILLED &&
                                "bg-cyan-100 text-cyan-800",
                              tempGroup === DISPATCH_TEMPERATURE_GROUP.AMBIENT &&
                                "bg-stone-100 text-stone-800"
                            )}
                          >
                            {getTemperatureGroupLabel(tempGroup)}
                          </Badge>
                        </div>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {lpn.itemName || "Không có tên hàng"}
                        </p>

                        <div className="mt-3 grid min-w-0 gap-x-5 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{getLpnWarehouseName(lpn)}</span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Route className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {lpn.destinationAddress || "Chưa có điểm trả hàng"}
                            </span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1.5">
                            <UserRound className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {lpn.customerName || "Chưa có khách hàng"}
                            </span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Scale className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {formatNumber(lpn.actualWeightKg)} kg ·{" "}
                              {formatNumber(lpn.actualCbm)} m³
                            </span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Snowflake className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{lpn.tempCondition || "—"}</span>
                          </span>
                        </div>

                        {lpn.label && (
                          <p
                            className="mt-2 line-clamp-2 whitespace-normal break-words text-xs leading-relaxed text-muted-foreground"
                            title={lpn.label}
                          >
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

        {hasSchedule && totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Trang {currentPage}/{totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage <= 1 || isChecking}
                onClick={() => onPageChange(currentPage - 1)}
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages || isChecking}
                onClick={() => onPageChange(currentPage + 1)}
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LpnSelectionPanel;
