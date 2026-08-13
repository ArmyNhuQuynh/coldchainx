import axios from "axios";

export const formatFinanceDate = (value?: string | null, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return withTime
    ? date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : date.toLocaleDateString("vi-VN");
};

export const getFinanceErrorMessage = (
  error: unknown,
  fallback = "Không thể tải dữ liệu tài chính."
) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const getDefaultFinancialRange = () => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 29);
  const toInputDate = (date: Date) => date.toISOString().slice(0, 10);
  return { fromDate: toInputDate(fromDate), toDate: toInputDate(toDate) };
};

export const isValidDateRange = (fromDate: string, toDate: string) =>
  !fromDate || !toDate || fromDate <= toDate;

export const isValidGuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
