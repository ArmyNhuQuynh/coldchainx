import { toast } from "sonner";

type HandledApiError = {
  status: number;
  message: string;
  detail: string;
};

const INVALID_PASSWORD_HASH_MESSAGE =
  "Không thể xác thực tài khoản. Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.";

const sanitizeApiMessage = (message: string) => {
  const isInvalidPasswordHash =
    /not a valid base-?64|string.*padding characters|non-base 64 character/i.test(
      message,
    );

  if (isInvalidPasswordHash) {
    return INVALID_PASSWORD_HASH_MESSAGE;
  }

  return message;
};

const getValidationMessage = (data: any) => {
  const directMessage = data?.message ?? data?.Message;
  if (typeof directMessage === "string" && directMessage.trim()) {
    return sanitizeApiMessage(directMessage);
  }

  const itemMessage = data?.data?.[0]?.errorMessage;
  if (typeof itemMessage === "string" && itemMessage.trim()) {
    return sanitizeApiMessage(itemMessage);
  }

  const validationMessages = Object.values(data?.errors ?? {})
    .flat()
    .filter((value): value is string => typeof value === "string");

  return validationMessages[0]
    ? sanitizeApiMessage(validationMessages[0])
    : null;
};

export const handleApiError = (error: any): HandledApiError => {
  let handledError: HandledApiError;

  if (error.response) {
    const { status, data } = error.response;

    if (status === 401) {
      handledError = {
        status,
        message: "Phiên đăng nhập đã hết hạn.",
        detail: "Vui lòng đăng nhập lại.",
      };
    } else if (status === 403) {
      handledError = {
        status,
        message: "Bạn không có quyền truy cập.",
        detail: "Bạn không có quyền thực hiện thao tác này.",
      };
    } else {
      const apiMessage =
        getValidationMessage(data) || "Một lỗi không xác định đã xảy ra.";
      handledError = {
        status,
        message:
          apiMessage === INVALID_PASSWORD_HASH_MESSAGE
            ? "Không thể đăng nhập."
            : status === 400
              ? "Dữ liệu không hợp lệ."
              : apiMessage,
        detail: apiMessage,
      };
    }
  } else if (error.request) {
    handledError = {
      status: 0,
      message: "Không nhận được phản hồi từ máy chủ.",
      detail: "Vui lòng kiểm tra kết nối và thử lại.",
    };
  } else {
    const message = sanitizeApiMessage(
      error?.message || "Một lỗi không xác định đã xảy ra.",
    );
    handledError = {
      status: 0,
      message: "Không thể thực hiện thao tác.",
      detail: message,
    };
  }

  toast.error(handledError.message, {
    duration: 5000,
    description: (
      <span className="text-xs font-medium text-red-500">
        {handledError.detail}
      </span>
    ),
    position: "top-right",
  });

  return handledError;
};
