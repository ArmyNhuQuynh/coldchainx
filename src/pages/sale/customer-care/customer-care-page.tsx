import { useChat, useChatSignalR } from "@/hooks/use-chat";
import { useCustomer } from "@/hooks/use-customer";
import { useOrder } from "@/hooks/use-order";
import type { RootState } from "@/redux/store";
import type { TChatMessage } from "@/schemas/chat.schema";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ChatComposer from "./components/chat-composer";
import CustomerChatHeader from "./components/customer-chat-header";
import CustomerListPanel from "./components/customer-list-panel";
import MessengerChatThread, {
  type CustomerCareTimelineItem,
} from "./components/messenger-chat-thread";
import {
  buildCustomerCareCustomers,
  filterCustomerCareCustomers,
  isCustomerCareOrderActive,
  toCustomerCareOrder,
  type CustomerCareOrder,
} from "./components/customer-care-utils";

const MESSAGE_PAGE_SIZE = 100;
const CUSTOMER_CARE_PAGE_SIZE = 100;

const CustomerCarePage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { getAllOrders } = useOrder();
  const { getCustomerOrders } = useCustomer();
  const {
    getMessagesForOrders,
    getParticipants,
    sendMessage,
    markMessagesAsRead,
  } = useChat();

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const [customerActivityById, setCustomerActivityById] = useState<
    Record<string, string | null | undefined>
  >({});

  const ordersQuery = getAllOrders();

  const baseOrders = ordersQuery.data?.data.data ?? [];
  const customers = useMemo(
    () => buildCustomerCareCustomers(baseOrders),
    [baseOrders]
  );

  const latestActivityByCustomerId = useMemo(() => {
    const map = new Map<string, string | null | undefined>();

    customers.forEach((customer) => {
      map.set(
        customer.customerId,
        customerActivityById[customer.customerId] ?? customer.latestOrderAt
      );
    });

    return map;
  }, [customerActivityById, customers]);

  const filteredCustomers = useMemo(
    () =>
      filterCustomerCareCustomers(customers, search).sort((a, b) => {
        const aTime = latestActivityByCustomerId.get(a.customerId)
          ? new Date(latestActivityByCustomerId.get(a.customerId)!).getTime()
          : 0;
        const bTime = latestActivityByCustomerId.get(b.customerId)
          ? new Date(latestActivityByCustomerId.get(b.customerId)!).getTime()
          : 0;

        return bTime - aTime;
      }),
    [customers, latestActivityByCustomerId, search]
  );

  useEffect(() => {
    if (filteredCustomers.length === 0) {
      setSelectedCustomerId(undefined);
      return;
    }

    if (
      !selectedCustomerId ||
      !filteredCustomers.some(
        (customer) => customer.customerId === selectedCustomerId
      )
    ) {
      setSelectedCustomerId(filteredCustomers[0].customerId);
    }
  }, [filteredCustomers, selectedCustomerId]);

  const selectedCustomer = customers.find(
    (customer) => customer.customerId === selectedCustomerId
  );

  const customerOrdersQuery = getCustomerOrders(selectedCustomerId, {
    pageNumber: 1,
    pageSize: CUSTOMER_CARE_PAGE_SIZE,
  });

  const selectedOrders = useMemo<CustomerCareOrder[]>(() => {
    const apiOrders = customerOrdersQuery.data?.data.data;

    if (apiOrders?.length && selectedCustomer) {
      return apiOrders
        .filter((order) => isCustomerCareOrderActive(order.status))
        .map((order) =>
          toCustomerCareOrder(order, {
            customerId: selectedCustomer.customerId,
            customerName: selectedCustomer.customerName,
          })
        );
    }

    return selectedCustomer?.orders ?? [];
  }, [customerOrdersQuery.data, selectedCustomer]);

  const orderIds = useMemo(
    () => selectedOrders.map((order) => order.orderId),
    [selectedOrders]
  );

  useChatSignalR(orderIds);

  const messageQueries = getMessagesForOrders(orderIds, {
    pageNumber: 1,
    pageSize: MESSAGE_PAGE_SIZE,
  });
  const participantQuery = getParticipants(selectedOrderId);

  useEffect(() => {
    if (
      selectedOrderId &&
      !selectedOrders.some((order) => order.orderId === selectedOrderId)
    ) {
      setSelectedOrderId(undefined);
    }
  }, [selectedOrders, selectedOrderId]);

  const messagesByOrderId = useMemo(() => {
    const map = new Map<string, TChatMessage[]>();

    orderIds.forEach((orderId, index) => {
      const messages = messageQueries[index]?.data?.data.data ?? [];
      map.set(
        orderId,
        [...messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    });

    return map;
  }, [messageQueries, orderIds]);

  const timelineItems = useMemo<CustomerCareTimelineItem[]>(() => {
    return selectedOrders
      .flatMap((order) =>
        (messagesByOrderId.get(order.orderId) ?? []).map((message) => ({
          order,
          message,
        }))
      )
      .sort(
        (a, b) =>
          new Date(a.message.createdAt).getTime() -
          new Date(b.message.createdAt).getTime()
      );
  }, [messagesByOrderId, selectedOrders]);

  const latestTimelineMessageAt = useMemo(
    () => timelineItems[timelineItems.length - 1]?.message.createdAt,
    [timelineItems]
  );

  useEffect(() => {
    if (!selectedCustomerId || !latestTimelineMessageAt) return;

    setCustomerActivityById((current) => {
      const currentActivityAt = current[selectedCustomerId];
      const currentTime = currentActivityAt
        ? new Date(currentActivityAt).getTime()
        : 0;
      const nextTime = new Date(latestTimelineMessageAt).getTime();

      if (Number.isNaN(nextTime) || nextTime <= currentTime) return current;

      return {
        ...current,
        [selectedCustomerId]: latestTimelineMessageAt,
      };
    });
  }, [latestTimelineMessageAt, selectedCustomerId]);

  const isMessagesLoading = messageQueries.some((query) => query.isLoading);

  const selectedOrder = selectedOrders.find(
    (order) => order.orderId === selectedOrderId
  );

  useEffect(() => {
    if (!selectedOrderId) return;
    markMessagesAsRead.mutate(selectedOrderId);
  }, [selectedOrderId]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOrderId(undefined);
  };

  const handleSendMessage = async (messageContent: string) => {
    const receiverId = participantQuery.data?.data.customerUserId;

    if (!selectedOrderId || !receiverId) return;

    try {
      const response = await sendMessage.mutateAsync({
        orderId: selectedOrderId,
        data: {
          receiverId,
          messageContent,
        },
      });
      const sentAt = response.data?.createdAt;

      if (sentAt && selectedCustomerId) {
        setCustomerActivityById((current) => ({
          ...current,
          [selectedCustomerId]: sentAt,
        }));
      }
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
          customers={filteredCustomers}
          selectedCustomerId={selectedCustomerId}
          search={search}
          isLoading={ordersQuery.isLoading}
          latestActivityByCustomerId={latestActivityByCustomerId}
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
                items={timelineItems}
                selectedOrderId={selectedOrderId}
                hasSelectedOrder={!!selectedOrder}
                isLoading={isMessagesLoading}
                currentUserId={user?.userId}
                onSelectOrder={setSelectedOrderId}
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
