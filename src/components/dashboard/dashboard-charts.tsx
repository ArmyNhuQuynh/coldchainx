import { formatCompactCurrency, formatDashboardNumber } from "./dashboard-formatters";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DashboardChartSeries = {
  key: string;
  label: string;
  color: string;
  stackId?: string;
  colorKey?: string;
};

type ChartValue = string | number;
export type DashboardChartDatum = { label: string } & Record<string, ChartValue>;

const tooltipStyle = {
  borderRadius: 8,
  borderColor: "hsl(var(--border))",
  backgroundColor: "hsl(var(--background))",
  fontSize: 12,
};

type CommonProps = {
  data: DashboardChartDatum[];
  series: DashboardChartSeries[];
  valueFormatter?: (value: number) => string;
  tooltipDetailFormatter?: (datum: DashboardChartDatum) => string | undefined;
};

export const DashboardHorizontalBarChart = ({
  data,
  series,
  valueFormatter = formatDashboardNumber,
  tooltipDetailFormatter,
}: CommonProps) => (
  <div style={{ height: Math.max(270, data.length * 48) }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value) => valueFormatter(Number(value))}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={128}
          tick={{ fontSize: 11 }}
          interval={0}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name, item) => {
            const detail = tooltipDetailFormatter?.(
              item.payload as DashboardChartDatum
            );

            return [
              `${valueFormatter(Number(value))}${detail ? ` · ${detail}` : ""}`,
              series.find((seriesItem) => seriesItem.key === name)?.label ??
                String(name),
            ];
          }}
        />
        <Legend formatter={(value) => series.find((item) => item.key === value)?.label ?? value} />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.key}
            fill={item.color}
            stackId={item.stackId}
            radius={[0, 4, 4, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const DashboardBarChart = ({
  data,
  series,
  valueFormatter = formatDashboardNumber,
  tooltipDetailFormatter,
}: CommonProps) => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => valueFormatter(Number(value))}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name, item) => {
            const detail = tooltipDetailFormatter?.(
              item.payload as DashboardChartDatum
            );
            return [
              `${valueFormatter(Number(value))}${detail ? ` · ${detail}` : ""}`,
              series.find((seriesItem) => seriesItem.key === name)?.label ??
                String(name),
            ];
          }}
        />
        <Legend formatter={(value) => series.find((item) => item.key === value)?.label ?? value} />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.key}
            fill={item.color}
            stackId={item.stackId}
            radius={[4, 4, 0, 0]}
          >
            {item.colorKey &&
              data.map((entry, index) => (
                <Cell
                  key={`${item.key}-${index}`}
                  fill={String(entry[item.colorKey!] ?? item.color)}
                />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

type DonutDatum = {
  name: string;
  value: number;
  color: string;
  amount?: number;
};

export const DashboardDonutChart = ({
  data,
  valueFormatter = formatDashboardNumber,
  amountFormatter,
  centerLabel = "Tổng cộng",
}: {
  data: DonutDatum[];
  valueFormatter?: (value: number) => string;
  amountFormatter?: (value: number) => string;
  centerLabel?: string;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      <div className="relative h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => {
                const amount = item.payload?.amount as number | undefined;
                const count = Number(value);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const countLabel = `${valueFormatter(count)} (${percentage.toLocaleString(
                  "vi-VN",
                  { maximumFractionDigits: 2 }
                )}%)`;
                return amount !== undefined && amountFormatter
                  ? [`${countLabel} · ${amountFormatter(amount)}`, "Số lượng"]
                  : [countLabel, "Số lượng"];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-x-0 top-[78px] text-center">
          <p className="text-2xl font-semibold tabular-nums">
            {formatDashboardNumber(total)}
          </p>
          <p className="text-xs text-muted-foreground">{centerLabel}</p>
        </div>
      </div>
      <ul className="mt-2 space-y-2 border-t pt-3">
        {data.map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <li
              key={item.name}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
              </span>
              <span className="tabular-nums text-muted-foreground">
                {valueFormatter(item.value)} · {percentage.toLocaleString("vi-VN", {
                  maximumFractionDigits: 1,
                })}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const DashboardLineChart = ({
  data,
  series,
  valueFormatter = formatCompactCurrency,
}: CommonProps) => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => valueFormatter(Number(value))} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name) => [
            valueFormatter(Number(value)),
            series.find((item) => item.key === name)?.label ?? String(name),
          ]}
        />
        <Legend formatter={(value) => series.find((item) => item.key === value)?.label ?? value} />
        {series.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.key}
            stroke={item.color}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);
