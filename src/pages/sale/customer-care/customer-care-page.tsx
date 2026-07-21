import { useChat, useChatSignalR } from "@/hooks/use-chat";
import { useCustomer } from "@/hooks/use-customer";
import type { RootState } from "@/redux/store";
import type { TChatMessage } from "@/schemas/chat.schema";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ChatComposer from "./components/chat-composer";
import CustomerChatHeader from "./components/customer-chat-header";
import CustomerListPanel from "./components/customer-list-panel";
import MessengerChatThread, {
  type CustomerCareTimelineItem,
} from "./components/messenger-chat-thread";
import {
  isCustomerCareOrderActive,
  toCustomerCareCustomer,
  toCustomerCareOrder,
  type CustomerCareOrder,
} from "./components/customer-care-utils";

const CUSTOMER_LIST_PAGE_SIZE = 100;
const CUSTOMER_ORDER_PAGE_SIZE = 100;
const MESSAGE_PAGE_SIZE = 30;

const CustomerCarePage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { getCustomerOrders } = useCustomer();
  const {
    getCustomerConversations,
    getCustomerMessages,
    getParticipants,
    sendMessage,
    markMessagesAsRead,
  } = useChat();

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const deferredSearch = useDeferredValue(search.trim());
  const lastReadMarkerRef = useRef<string>();

  const customersQuery = getCustomerConversations({
    pageNumber: 1,
    pageSize: CUSTOMER_LIST_PAGE_SIZE,
    search: deferredSearch || undefined,
  });
  const customers = useMemo(
    () =>
      (customersQuery.data?.data.data ?? []).map(toCustomerCareCustomer),
    [customersQuery.data]
  );

  useEffect(() => {
    if (customers.length === 0) {
      setSelectedCustomerId(undefined);
      setSelectedOrderId(undefined);
      return;
    }

    if (
      !selectedCustomerId ||
      !customers.some((customer) => customer.customerId === selectedCustomerId)
    ) {
      setSelectedCustomerId(customers[0].customerId);
      setSelectedOrderId(undefined);
    }
  }, [customers, selectedCustomerId]);

  const selectedCustomer = customers.find(
    (customer) => customer.customerId === selectedCustomerId
  );
  const customerOrdersQuery = getCustomerOrders(selectedCustomerId, {
    pageNumber: 1,
    pageSize: CUSTOMER_ORDER_PAGE_SIZE,
  });

  const selectedOrders = useMemo<CustomerCareOrder[]>(() => {
    const apiOrders = customerOrdersQuery.data?.data.data ?? [];
    if (!selectedCustomer) return [];

    return apiOrders
      .filter((order) => isCustomerCareOrderActive(order.status))
      .map((order) =>
        toCustomerCareOrder(order, {
          customerId: selectedCustomer.customerId,
          customerName: selectedCustomer.customerName,
        })
      );
  }, [customerOrdersQuery.data, selectedCustomer]);

  const customerMessagesQuery = getCustomerMessages(
    selectedCustomerId,
    MESSAGE_PAGE_SIZE
  );
  const participantQuery = getParticipants(selectedOrderId);

  const messages = useMemo(() => {
    const byId = new Map<string, TChatMessage>();

    customerMessagesQuery.data?.pages.forEach((page) => {
      page.data.data.forEach((message) => byId.set(message.id, message));
    });

    return Array.from(byId.values()).sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  }, [customerMessagesQuery.data]);

  const timelineItems = useMemo<CustomerCareTimelineItem[]>(() => {
    const ordersById = new Map(
      selectedOrders.map((order) => [order.orderId, order])
    );

    return messages.flatMap((message) => {
      const order = ordersById.get(message.orderId);
      return order ? [{ order, message }] : [];
    });
  }, [messages, selectedOrders]);

  useEffect(() => {
    if (selectedOrders.length === 0) {
      setSelectedOrderId(undefined);
      return;
    }

    if (selectedOrderId && selectedOrders.some((order) => order.orderId === selectedOrderId)) {
      return;
    }

    const latestMessageOrderId = timelineItems[timelineItems.length - 1]?.order.orderId;
    const preferredOrderId = latestMessageOrderId ?? selectedCustomer?.lastMessageOrderId;
    setSelectedOrderId(
      preferredOrderId && selectedOrders.some((order) => order.orderId === preferredOrderId)
        ? preferredOrderId
        : undefined
    );
  }, [selectedCustomer, selectedOrderId, selectedOrders, timelineItems]);

  const handleRealtimeMessage = useCallback(
    (message: TChatMessage) => {
      if (
        message.customerId === selectedCustomerId &&
        message.senderId !== user?.userId &&
        selectedOrders.some((order) => order.orderId === message.orderId)
      ) {
        setSelectedOrderId(message.orderId);
      }
    },
    [selectedCustomerId, selectedOrders, user?.userId]
  );
  useChatSignalR(handleRealtimeMessage);

  const selectedOrder = selectedOrders.find(
    (order) => order.orderId === selectedOrderId
  );
  const latestSelectedMessageId = useMemo(() => {
    for (let index = timelineItems.length - 1; index >= 0; index -= 1) {
      if (timelineItems[index].order.orderId === selectedOrderId) {
        return timelineItems[index].message.id;
      }
    }
    return undefined;
  }, [selectedOrderId, timelineItems]);

  useEffect(() => {
    if (!selectedOrderId) return;

    const marker = `${selectedOrderId}:${latestSelectedMessageId ?? "empty"}`;
    if (lastReadMarkerRef.current === marker) return;

    lastReadMarkerRef.current = marker;
    markMessagesAsRead.mutate(selectedOrderId);
  }, [latestSelectedMessageId, selectedOrderId]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOrderId(undefined);
  };

  const handleSendMessage = async (messageContent: string) => {
    const receiverId = participantQuery.data?.data.customerUserId;

    if (!selectedOrderId || !receiverId) return;

    try {
      await sendMessage.mutateAsync({
        orderId: selectedOrderId,
        data: {
          receiverId,
          messageContent,
        },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.message ||
        "Không gửi được tin nhắn";
      toast.error(message);
      throw error;
    }
  };

  const disabledReason = !selectedOrder
    ? "Chọn order để trả lời."
    : participantQuery.isLoading
      ? "Đang kiểm tra tài khoản khách hàng."
      : !participantQuery.data?.data.customerUserId
        ? "BE chưa tìm thấy tài khoản khách hàng theo email."
        : undefined;

  return (
    <div className="-m-4 overflow-hidden rounded-xl border bg-background md:-m-6">
      <div className="grid h-[calc(100vh-4rem)] min-h-[640px] xl:grid-cols-[360px_minmax(0,1fr)]">
        <CustomerListPanel
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          search={search}
          isLoading={customersQuery.isLoading}
          onSearchChange={setSearch}
          onSelectCustomer={handleSelectCustomer}
        />

        <section className="flex min-h-0 flex-col">
          <CustomerChatHeader
            customer={selectedCustomer}
            orders={selectedOrders}
            participant={participantQuery.data?.data}
          />

          {selectedCustomer && (
            <>
              <MessengerChatThread
                conversationKey={selectedCustomer.customerId}
                items={timelineItems}
                selectedOrderId={selectedOrderId}
                hasSelectedOrder={!!selectedOrder}
                isLoading={customerMessagesQuery.isLoading}
                isLoadingOlder={customerMessagesQuery.isFetchingNextPage}
                hasOlderMessages={customerMessagesQuery.hasNextPage}
                currentUserId={user?.userId}
                onSelectOrder={setSelectedOrderId}
                onLoadOlder={() => customerMessagesQuery.fetchNextPage()}
              />

              <ChatComposer
                orders={selectedOrders}
                selectedOrder={selectedOrder}
                canSend={!!participantQuery.data?.data.customerUserId}
                isSending={sendMessage.isPending}
                disabledReason={disabledReason}
                onSelectOrder={setSelectedOrderId}
                onSend={handleSendMessage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerCarePage;
