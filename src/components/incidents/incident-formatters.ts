const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const MONEY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatIncidentDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DATE_TIME_FORMATTER.format(date);
};

export const formatIncidentMoney = (value?: number | null) =>
  MONEY_FORMATTER.format(Number(value ?? 0));

export const formatIncidentId = (value?: string | null) =>
  value ? value.slice(0, 8).toUpperCase() : "—";

type IncidentApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      Message?: string;
      error?: string;
      Error?: string;
      errors?: Record<string, string[]> | string[];
      Errors?: Record<string, string[]> | string[];
    };
  };
};

export const getIncidentErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as IncidentApiError;
  const validationErrors =
    apiError.response?.data?.errors ?? apiError.response?.data?.Errors;
  const firstValidationError = Array.isArray(validationErrors)
    ? validationErrors.find((item) => typeof item === "string")
    : Object.values(validationErrors ?? {})
        .flat()
        .find((item) => typeof item === "string");
  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.Message ||
    apiError.response?.data?.error ||
    apiError.response?.data?.Error ||
    firstValidationError ||
    apiError.message ||
    fallback
  );
};

const RESOLVE_INCIDENT_ERROR_MESSAGES: Record<string, string> = {
  "Vehicle/reefer breakdown can only be resolved after the new warehouse trip is sealed and dispatched to customers.":
    "Chỉ được đóng Incident sau khi chuyến mới đã kẹp seal và xuất phát giao khách.",
  "Driver expense must be approved and reimbursed before resolving the incident.":
    "Chưa thể đóng Incident vì khoản Driver ứng trước chưa được hoàn trả.",
  "Incident is already resolved.": "Incident đã được đóng.",
  "Resolution note is required.": "Vui lòng nhập ghi chú đóng Incident.",
};

export const getResolveIncidentErrorMessage = (error: unknown) => {
  const apiError = error as IncidentApiError;
  if (apiError.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
  }
  if (apiError.response?.status === 403) {
    return "Bạn không có quyền đóng Incident.";
  }

  const backendMessage = getIncidentErrorMessage(
    error,
    "Không thể đóng Incident.",
  );
  return RESOLVE_INCIDENT_ERROR_MESSAGES[backendMessage] ?? backendMessage;
};
