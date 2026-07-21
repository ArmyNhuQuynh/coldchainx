import { chatApi } from "@/apis/chat.api";
import { createChatHubConnection } from "@/lib/chat-signalr";
import type { TChatMessage, TSendChatMessage } from "@/schemas/chat.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import {
  keepPreviousData,
  type InfiniteData,
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type ChatMessageQuery = {
  pageNumber?: number;
  pageSize?: number;
};

type ChatCustomerQuery = ChatMessageQuery & {
  search?: string;
};

type CustomerMessagePage = BaseResponse<PaginationResponse<TChatMessage>>;
type CustomerMessageCache = InfiniteData<CustomerMessagePage, number>;

export const chatQueryKeys = {
  root: ["chat"] as const,
  participants: (orderId: string) =>
    [...chatQueryKeys.root, "participants", orderId] as const,
  customerConversationsRoot: () =>
    [...chatQueryKeys.root, "customer-conversations"] as const,
  customerConversations: (params: ChatCustomerQuery) =>
    [...chatQueryKeys.customerConversationsRoot(), params] as const,
  customerMessagesRoot: (customerId: string) =>
    [...chatQueryKeys.root, "customer-messages", customerId] as const,
  customerMessages: (customerId: string, pageSize: number) =>
    [...chatQueryKeys.customerMessagesRoot(customerId), { pageSize }] as const,
};

const upsertCustomerMessage = (
  queryClient: QueryClient,
  message: TChatMessage
) => {
  if (!message.customerId) return;

  queryClient.setQueriesData<CustomerMessageCache>(
    { queryKey: chatQueryKeys.customerMessagesRoot(message.customerId) },
    (current) => {
      if (!current?.pages.length) return current;

      const alreadyExists = current.pages.some((page) =>
        page.data.data.some((item) => item.id === message.id)
      );
      if (alreadyExists) return current;

      const [firstPage, ...remainingPages] = current.pages;
      const totalRecords = firstPage.data.totalRecords + 1;
      const updatedFirstPage: CustomerMessagePage = {
        ...firstPage,
        data: {
          ...firstPage.data,
          totalRecords,
          totalPages: Math.ceil(totalRecords / firstPage.data.pageSize),
          data: [message, ...firstPage.data.data],
        },
      };

      return {
        ...current,
        pages: [updatedFirstPage, ...remainingPages],
      };
    }
  );
};

export const useChatSignalR = (
  onMessage?: (message: TChatMessage) => void
) => {
  const queryClient = useQueryClient();
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const connection = createChatHubConnection();
    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    connection.on("ReceiveMessage", (message: TChatMessage) => {
      upsertCustomerMessage(queryClient, message);
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.customerConversationsRoot(),
      });
      onMessageRef.current?.(message);
    });

    const startConnection = async () => {
      if (disposed) return;

      try {
        await connection.start();
      } catch (error) {
        console.error("Unable to start chat SignalR connection", error);
        retryTimer = setTimeout(() => {
          void startConnection();
        }, 5_000);
      }
    };

    connection.onclose(() => {
      if (!disposed) void startConnection();
    });

    void startConnection();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      connection.off("ReceiveMessage");
      void connection.stop();
    };
  }, [queryClient]);
};

export const useChat = () => {
  const queryClient = useQueryClient();

  const getCustomerConversations = (params: ChatCustomerQuery = {}) =>
    useQuery({
      queryKey: chatQueryKeys.customerConversations(params),
      queryFn: () => chatApi.getCustomerConversations(params),
      placeholderData: keepPreviousData,
    });

  const getCustomerMessages = (
    customerId: string | undefined,
    pageSize = 30
  ) =>
    useInfiniteQuery({
      queryKey: chatQueryKeys.customerMessages(customerId ?? "", pageSize),
      queryFn: ({ pageParam }) =>
        chatApi.getCustomerMessages(customerId!, {
          pageNumber: pageParam,
          pageSize,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.data.currentPage < lastPage.data.totalPages
          ? lastPage.data.currentPage + 1
          : undefined,
      enabled: !!customerId,
    });

  const getParticipants = (orderId: string | undefined) =>
    useQuery({
      queryKey: chatQueryKeys.participants(orderId ?? ""),
      queryFn: () => chatApi.getParticipants(orderId!),
      enabled: !!orderId,
    });

  const sendMessage = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: TSendChatMessage;
    }) => chatApi.sendMessage(orderId, data),
    onSuccess: (response) => {
      if (response.data) upsertCustomerMessage(queryClient, response.data);
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.customerConversationsRoot(),
      });
    },
  });

  const markMessagesAsRead = useMutation({
    mutationFn: (orderId: string) => chatApi.markMessagesAsRead(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.customerConversationsRoot(),
      });
    },
  });

  return {
    getCustomerConversations,
    getCustomerMessages,
    getParticipants,
    sendMessage,
    markMessagesAsRead,
  };
};
