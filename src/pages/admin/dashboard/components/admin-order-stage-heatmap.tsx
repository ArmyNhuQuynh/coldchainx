import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TStatusPeriodItem } from "@/schemas/dashboard.schema";
import { getDashboardLabel } from "@/types/enums/dashboard.enum";
import {
  ADMIN_ORDER_STAGES,
  formatAdminPeriod,
  getOrderStageKey,
} from "./admin-chart-utils";

type Props = {
  items: TStatusPeriodItem[];
  groupBy: "WEEK" | "MONTH";
};

const toRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const AdminOrderStageHeatmap = ({ items, groupBy }: Props) => {
  const periods = items.map((item) => ({
    ...item,
    label: formatAdminPeriod(item.period, groupBy),
  }));
  const rows = ADMIN_ORDER_STAGES.map((stage) => {
    const cells = periods.map((period) => {
      const details = period.statusDistribution
        .filter((item) => getOrderStageKey(item.status) === stage.key)
        .filter((item) => item.count > 0);

      return {
        count: details.reduce((total, item) => total + item.count, 0),
        details,
      };
    });

    return {
      ...stage,
      cells,
      total: cells.reduce((total, cell) => total + cell.count, 0),
    };
  }).filter((row) => row.total > 0);
  const maxCellValue = Math.max(
    1,
    ...rows.flatMap((row) => row.cells.map((cell) => cell.count))
  );
  const grandTotal = periods.reduce((total, period) => total + period.total, 0);
  const minTableWidth = Math.max(760, 248 + periods.length * 112);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary/20" />
        Màu đậm hơn biểu thị nhiều đơn hơn
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table
          className="w-full border-collapse text-sm"
          style={{ minWidth: minTableWidth }}
        >
          <thead>
            <tr className="border-b bg-muted/35">
              <th className="sticky left-0 z-10 w-52 bg-muted px-4 py-3 text-left font-semibold">
                Giai đoạn
              </th>
              {periods.map((period) => (
                <th
                  key={period.period}
                  className="min-w-28 px-3 py-3 text-center font-semibold"
                >
                  {period.label}
                </th>
              ))}
              <th className="min-w-24 border-l px-3 py-3 text-center font-semibold">
                Tổng
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b last:border-b-0">
                <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: row.color }}
                    />
                    {row.label}
                  </span>
                </th>
                {row.cells.map((cell, index) => {
                  const intensity = cell.count / maxCellValue;
                  const backgroundAlpha =
                    cell.count === 0 ? 0.025 : 0.12 + intensity * 0.62;
                  const cellContent = (
                    <div
                      className="flex h-14 items-center justify-center rounded-sm font-semibold outline-none transition-all duration-200 hover:ring-2 hover:ring-ring/30 focus-visible:ring-2 focus-visible:ring-ring"
                      style={{
                        backgroundColor: toRgba(row.color, backgroundAlpha),
                        color: intensity >= 0.6 ? "#ffffff" : row.color,
                      }}
                      tabIndex={cell.count > 0 ? 0 : -1}
                    >
                      {cell.count.toLocaleString("vi-VN")}
                    </div>
                  );

                  return (
                    <td key={periods[index].period} className="p-1.5 text-center">
                      {cell.count > 0 ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
                          <TooltipContent
                            sideOffset={6}
                            className="max-w-72 border bg-popover px-3 py-2 text-popover-foreground shadow-lg"
                          >
                            <p className="font-semibold">
                              {row.label} · {periods[index].label}
                            </p>
                            <div className="mt-1.5 space-y-1">
                              {cell.details.map((detail) => (
                                <div
                                  key={detail.status}
                                  className="flex min-w-48 items-center justify-between gap-5"
                                >
                                  <span>{getDashboardLabel(detail.status)}</span>
                                  <span className="font-semibold">
                                    {detail.count.toLocaleString("vi-VN")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
                <td className="border-l bg-muted/15 px-3 py-3 text-center font-bold">
                  {row.total.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/35 font-semibold">
              <th className="sticky left-0 z-10 bg-muted px-4 py-3 text-left">
                Tổng đơn
              </th>
              {periods.map((period) => (
                <td key={period.period} className="px-3 py-3 text-center">
                  {period.total.toLocaleString("vi-VN")}
                </td>
              ))}
              <td className="border-l px-3 py-3 text-center font-bold">
                {grandTotal.toLocaleString("vi-VN")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderStageHeatmap;
