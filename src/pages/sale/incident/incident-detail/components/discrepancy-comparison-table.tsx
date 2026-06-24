import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TDiscrepancyDetail } from "@/schemas/discrepancy.schema";
import { Scale } from "lucide-react";

type Props = {
  detail: TDiscrepancyDetail;
};

const formatNumber = (value?: number | null, digits = 2) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: digits,
  }).format(value);
};

const calculateDiffPercent = (expected: number, actual: number) => {
  if (expected <= 0) return actual > 0 ? 100 : 0;
  return Math.abs(actual - expected) / expected * 100;
};

const diffClassName = (percent: number) =>
  percent > 5 ? "text-rose-700" : "text-emerald-700";

const DiscrepancyComparisonTable = ({ detail }: Props) => {
  const rows = [
    {
      label: "Cân nặng",
      unit: "kg",
      expected: detail.expectedWeightKg,
      actual: detail.actualWeightKg,
      digits: 2,
    },
    {
      label: "Thể tích quy đổi",
      unit: "m³",
      expected: detail.expectedCbm,
      actual: detail.actualCbm,
      digits: 4,
    },
  ].map((item) => {
    const delta = item.actual - item.expected;
    const diffPercent = calculateDiffPercent(item.expected, item.actual);

    return {
      ...item,
      delta,
      diffPercent,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
        <Scale className="h-5 w-5" />
        Bảng so sánh sai lệch
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Chỉ số</TableHead>
                <TableHead className="text-right">Theo order</TableHead>
                <TableHead className="text-right">QC thực tế</TableHead>
                <TableHead className="text-right">Chênh lệch</TableHead>
                <TableHead className="text-right">Diff %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-semibold">{row.label}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.expected, row.digits)} {row.unit}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatNumber(row.actual, row.digits)} {row.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.delta >= 0 ? "+" : ""}
                    {formatNumber(row.delta, row.digits)} {row.unit}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${diffClassName(
                      row.diffPercent
                    )}`}
                  >
                    {formatNumber(row.diffPercent, 2)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-semibold">Nhiệt độ</TableCell>
                <TableCell className="text-right">
                  {formatNumber(detail.requiredTemperature, 2)}°C
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatNumber(detail.recordedTemperature, 2)}°C
                </TableCell>
                <TableCell className="text-right" colSpan={2}>
                  {detail.requiredTemperature != null &&
                  detail.recordedTemperature != null
                    ? `${formatNumber(
                        detail.recordedTemperature - detail.requiredTemperature,
                        2
                      )}°C`
                    : "—"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscrepancyComparisonTable;
