import { chatApi } from "@/apis/chat.api";
import { createChatHubConnection } from "@/lib/chat-signalr";
import type { TChatMessage, TSendChatMessage } from "@/schemas/chat.schema";
import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

type ChatMessageQuery = {
  pageNumber?: number;
  pageSize?: number;
};

type ChatMessageQueryOptions = {
  refetchInterval?: number | false;
};

export const chatQueryKeys = {
  root: ["chat"] as const,
  messagesRoot: (orderId: string) =>
    [...chatQueryKeys.root, "messages", orderId] as const,
  messages: (orderId: string, params: ChatMessageQuery = {}) =>
    [...chatQueryKeys.messagesRoot(orderId), params] as const,
  participants: (orderId: string) =>
    [...chatQueryKeys.root, "participants", orderId] as const,
  unreadCount: (orderId: string) =>
    [...chatQueryKeys.root, "unread-count", orderId] as const,
};

export const useChatSignalR = (orderIds: string[]) => {
  const queryClient = useQueryClient();
  const orderKey = useMemo(() => orderIds.join("|"), [orderIds]);

  useEffect(() => {
    if (!orderKey) return;

    const activeOrderIds = orderKey.split("|").filter(Boolean);
    const connection = createChatHubConnection();

    connection.on("ReceiveMessage", (message: TChatMessage) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messagesRoot(message.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.unreadCount(message.orderId),
      });
    });

    const startConnection = async () => {
      try {
        await connection.start();
        await Promise.all(
          activeOrderIds.map((orderId) =>
            connection.invoke("JoinOrder", orderId).catch(() => undefined)
          )
        );
      } catch (error) {
        console.error("Unable to start chat SignalR connection", error);
      }
    };

    void startConnection();

    return () => {
      connection.off("ReceiveMessage");
      void Promise.all(
        activeOrderIds.map((orderId) =>
          connection.invoke("LeaveOrder", orderId).catch(() => undefined)
        )
      ).finally(() => {
        void connection.stop();
      });
    };
  }, [orderKey, queryClient]);
};

export const useChat = () => {
  const queryClient = useQueryClient();

  const getMessages = (
    orderId: string | undefined,
    params: ChatMessageQuery = {},
    options: ChatMessageQueryOptions = {}
  ) =>
    useQuery({
      queryKey: chatQueryKeys.messages(orderId ?? "", params),
      queryFn: () => chatApi.getMessages(orderId!, params),
      enabled: !!orderId,
      placeholderData: keepPreviousData,
      refetchInterval: options.refetchInterval,
    });

  const getMessagesForOrders = (
    orderIds: string[],
    params: ChatMessageQuery = { pageNumber: 1, pageSize: 100 },
    options: ChatMessageQueryOptions = {}
  ) =>
    useQueries({
      queries: orderIds.map((orderId) => ({
        queryKey: chatQueryKeys.messages(orderId, params),
        queryFn: () => chatApi.getMessages(orderId, params),
        enabled: !!orderId,
        placeholderData: keepPreviousData,
        refetchInterval: options.refetchInterval,
      })),
    });

  const getParticipants = (orderId: string | undefined) =>
    useQuery({
      queryKey: chatQueryKeys.participants(orderId ?? ""),
      queryFn: () => chatApi.getParticipants(orderId!),
      enabled: !!orderId,
    });

  const getUnreadCountsForOrders = (orderIds: string[]) =>
    useQueries({
      queries: orderIds.map((orderId) => ({
        queryKey: chatQueryKeys.unreadCount(orderId),
        queryFn: () => chatApi.getUnreadCount(orderId),
        enabled: !!orderId,
      })),
    });

  const sendMessage = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: TSendChatMessage;
    }) => chatApi.sendMessage(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messagesRoot(orderId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.unreadCount(orderId),
      });
    },
  });

  const markMessagesAsRead = useMutation({
    mutationFn: (orderId: string) => chatApi.markMessagesAsRead(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messagesRoot(orderId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.unreadCount(orderId),
      });
    },
  });

  return {
    getMessages,
    getMessagesForOrders,
    getParticipants,
    getUnreadCountsForOrders,
    sendMessage,
    markMessagesAsRead,
  };
};
