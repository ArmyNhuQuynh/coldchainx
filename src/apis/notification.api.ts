import { apiRequest } from "@/lib/http";
import type {
  TNotification,
  TNotificationListParams,
  TNotificationPage,
} from "@/schemas/notification.schema";
import type { BaseResponse } from "@/types/response.type";

const NOTIFICATIONS_URL = "/notifications";

const parseRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const normalizeNotification = (raw: Record<string, any>): TNotification => ({
  notificationId: raw.notificationId ?? raw.notiId ?? raw.id ?? "",
  userId: raw.userId ?? null,
  senderId: raw.senderId ?? null,
  templateId: raw.templateId ?? null,
  title: raw.title ?? "Thông báo",
  body: raw.body ?? raw.message ?? raw.content ?? "",
  type: raw.type ?? raw.templateId ?? null,
  referenceId: raw.referenceId ?? null,
  data:
    parseRecord(raw.dataJson) ??
    parseRecord(raw.data) ??
    parseRecord(raw.params) ??
    parseRecord(raw.payload),
  isRead: Boolean(raw.isRead ?? raw.readAt),
  readAt: raw.readAt ?? null,
  createdAt: raw.createdAt ?? null,
  sentAt: raw.sentAt ?? null,
  deliveryStatus: raw.deliveryStatus ?? null,
});

const getNotifications = async (
  params: TNotificationListParams = {}
): Promise<TNotificationPage> => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<Record<string, any> | Record<string, any>[]>
  >(NOTIFICATIONS_URL, {
    params: { pageNumber: 1, pageSize: 20, ...params },
  });
  const page = response.data.data;
  const items = Array.isArray(page)
    ? page
    : page?.data ?? page?.items ?? page?.Data ?? page?.Items ?? [];
  return {
    totalRecords: Array.isArray(page)
      ? items.length
      : Number(page?.totalRecords ?? page?.TotalRecords ?? items.length),
    totalPages: Array.isArray(page)
      ? 1
      : Number(page?.totalPages ?? page?.TotalPages ?? 1),
    currentPage: Array.isArray(page)
      ? 1
      : Number(page?.currentPage ?? page?.CurrentPage ?? 1),
    pageSize: Array.isArray(page)
      ? items.length
      : Number(page?.pageSize ?? page?.PageSize ?? params.pageSize ?? 20),
    data: items.map((item: Record<string, any>) => normalizeNotification(item)),
  };
};

const getUnreadCount = async () => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<{ unreadCount?: number; UnreadCount?: number }>
  >(`${NOTIFICATIONS_URL}/unread-count`);
  return Number(
    response.data.data?.unreadCount ?? response.data.data?.UnreadCount ?? 0
  );
};

const markRead = async (notificationId: string) => {
  const response = await apiRequest.baseApi.put<BaseResponse<boolean>>(
    `${NOTIFICATIONS_URL}/${notificationId}/read`
  );
  return response.data.data;
};

const markAllRead = async () => {
  const response = await apiRequest.baseApi.put<BaseResponse<boolean>>(
    `${NOTIFICATIONS_URL}/read-all`
  );
  return response.data.data;
};

export const notificationApi = {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
};
