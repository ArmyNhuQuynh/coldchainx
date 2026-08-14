import { toast } from "sonner";

type HandledApiError = {
  status: number;
  message: string;
  detail: string;
};

const INVALID_PASSWORD_HASH_MESSAGE =
  "Không thể xác thực tài khoản. Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.";

const API_MESSAGE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/orders retrieved successfully/i, "Đã tải danh sách đơn hàng."],
  [/order retrieved successfully/i, "Đã tải thông tin đơn hàng."],
  [/order not found/i, "Không tìm thấy đơn hàng."],
  [/customer not found/i, "Không tìm thấy khách hàng."],
  [/vehicle not found/i, "Không tìm thấy xe."],
  [/schedule.*does not exist/i, "Không tìm thấy lịch vận chuyển."],
  [/schedule.*invalid or inactive/i, "Lịch vận chuyển hoặc tuyến đã ngừng hoạt động."],
  [/schedule is no longer accepting new orders/i, "Lịch vận chuyển đã đóng nhận đơn."],
  [/scheduleid is required/i, "Vui lòng chọn lịch vận chuyển."],
  [/at least one lpn is required/i, "Vui lòng chọn ít nhất một LPN."],
  [/some lpns do not belong to the selected schedule/i, "Có LPN không thuộc lịch vận chuyển đã chọn."],
  [/already assigned to an active trip/i, "Xe đã được gán cho một chuyến đang hoạt động."],
  [/is not active/i, "Xe hiện không ở trạng thái sẵn sàng."],
  [/total weight .* exceeds vehicle max weight/i, "Tổng khối lượng hàng vượt quá tải trọng của xe."],
  [/total cbm .* exceeds vehicle max cbm/i, "Tổng thể tích hàng vượt quá sức chứa của xe."],
  [/preview load plan successful/i, "Đã tạo mô phỏng xếp hàng."],
  [/failed to simulate/i, "Không thể tạo mô phỏng xếp hàng."],
  [/you do not have permission/i, "Bạn không có quyền thực hiện thao tác này."],
  [/unauthorized/i, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn."],
  [/internal server error/i, "Máy chủ đang gặp sự cố. Vui lòng thử lại sau."],
];

const hasVietnameseText = (message: string) =>
  /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(
    message
  ) || /\b(không|vui lòng|đã|đang|chưa|thành công|thất bại|dữ liệu|tài khoản)\b/i.test(message);

export const translateApiMessage = (
  message: unknown,
  fallback = "Yêu cầu chưa thể được xử lý."
) => {
  if (typeof message !== "string" || !message.trim()) return fallback;

  const normalized = message.trim();
  const translation = API_MESSAGE_TRANSLATIONS.find(([pattern]) =>
    pattern.test(normalized)
  );
  if (translation) return translation[1];

  if (/Ã|Ä|Æ|áº|á»|â€/.test(normalized)) return fallback;
  if (hasVietnameseText(normalized)) return normalized;

  return fallback;
};

const sanitizeApiMessage = (message: string) => {
  const isInvalidPasswordHash =
    /not a valid base-?64|string.*padding characters|non-base 64 character/i.test(
      message,
    );

  if (isInvalidPasswordHash) {
    return INVALID_PASSWORD_HASH_MESSAGE;
  }

  return translateApiMessage(message);
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
