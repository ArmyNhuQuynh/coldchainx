import { notificationApi } from "@/apis/notification.api";
import type { TNotificationListParams } from "@/schemas/notification.schema";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationQueryKeys = {
  root: ["notifications"] as const,
  list: (params: TNotificationListParams) => ["notifications", "list", params] as const,
  unread: ["notifications", "unread-count"] as const,
};

export const useNotification = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.root });

  const getNotifications = (
    params: TNotificationListParams = {},
    enabled = true
  ) =>
    useQuery({
      queryKey: notificationQueryKeys.list(params),
      queryFn: () => notificationApi.getNotifications(params),
      enabled,
      placeholderData: keepPreviousData,
    });

  const getUnreadCount = (enabled = true) =>
    useQuery({
      queryKey: notificationQueryKeys.unread,
      queryFn: notificationApi.getUnreadCount,
      enabled,
      refetchInterval: enabled ? 60_000 : false,
    });

  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: invalidate,
  });

  return { getNotifications, getUnreadCount, markRead, markAllRead };
};
