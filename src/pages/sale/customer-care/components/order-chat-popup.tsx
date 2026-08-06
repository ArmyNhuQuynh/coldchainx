import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat, useChatSignalR } from "@/hooks/use-chat";
import type { RootState } from "@/redux/store";
import type { TChatMessage } from "@/schemas/chat.schema";
import { LoaderCircle, MessageCircle, Minus, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import MessengerChatThread, {
  type CustomerCareTimelineItem,
} from "./messenger-chat-thread";

type OrderChatPopupProps = {
  orderId: string;
  trackingCode: string;
  customerName?: string | null;
};

type OrderChatPopupContentProps = OrderChatPopupProps;

const MESSAGE_PAGE_SIZE = 30;

const OrderChatPopupContent = ({
  orderId,
  trackingCode,
}: OrderChatPopupContentProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { getMessages, getParticipants, sendMessage, markMessagesAsRead } =
    useChat();
  const messagesQuery = getMessages(orderId, MESSAGE_PAGE_SIZE);
  const participantQuery = getParticipants(orderId);
  const [messageContent, setMessageContent] = useState("");
  const lastReadMarkerRef = useRef<string>();

  useChatSignalR();

  const messages = useMemo(() => {
    const byId = new Map<string, TChatMessage>();

    messagesQuery.data?.pages.forEach((page) => {
      page.data.data.forEach((message) => byId.set(message.id, message));
    });

    return Array.from(byId.values()).sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  }, [messagesQuery.data]);

  const timelineItems = useMemo<CustomerCareTimelineItem[]>(
    () =>
      messages.map((message) => ({
        order: { orderId, trackingCode },
        message,
      })),
    [messages, orderId, trackingCode]
  );

  const latestMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (!latestMessageId || lastReadMarkerRef.current === latestMessageId) return;

    lastReadMarkerRef.current = latestMessageId;
    markMessagesAsRead.mutate(orderId);
  }, [latestMessageId, orderId]);

  const receiverId = participantQuery.data?.data.customerUserId;
  const handleSend = async () => {
    const content = messageContent.trim();
    if (!content || !receiverId || sendMessage.isPending) return;

    try {
      await sendMessage.mutateAsync({
        orderId,
        data: { receiverId, messageContent: content },
      });
      setMessageContent("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.Message ||
          error?.message ||
          "Không gửi được tin nhắn"
      );
    }
  };

  const disabledReason = participantQuery.isLoading
    ? "Đang kiểm tra tài khoản khách hàng"
    : !receiverId
      ? "Không tìm thấy tài khoản khách hàng để nhận tin"
      : undefined;

  return (
    <>
      <div className="min-h-0 flex-1">
        {messagesQuery.isError ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-rose-700">
            Không tải được tin nhắn của order này.
          </div>
        ) : (
          <MessengerChatThread
            conversationKey={orderId}
            items={timelineItems}
            selectedOrderId={orderId}
            hasSelectedOrder
            isLoading={messagesQuery.isLoading}
            isLoadingOlder={messagesQuery.isFetchingNextPage}
            hasOlderMessages={messagesQuery.hasNextPage}
            currentUserId={user?.userId}
            onSelectOrder={() => undefined}
            onLoadOlder={() => messagesQuery.fetchNextPage()}
          />
        )}
      </div>

      <div className="border-t bg-background p-3">
        {disabledReason && (
          <p className="mb-1 px-3 text-xs text-amber-700">{disabledReason}</p>
        )}
        <div className="flex items-center gap-2">
          <Input
            value={messageContent}
            placeholder="Aa"
            className="h-10 rounded-full border-transparent bg-muted px-4 shadow-none"
            disabled={!receiverId || sendMessage.isPending}
            onChange={(event) => setMessageContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSend();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700"
            disabled={!messageContent.trim() || !receiverId || sendMessage.isPending}
            onClick={() => void handleSend()}
          >
            {sendMessage.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Gửi tin nhắn</span>
          </Button>
        </div>
      </div>
    </>
  );
};

const OrderChatPopup = ({
  orderId,
  trackingCode,
  customerName,
}: OrderChatPopupProps) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Nhắn khách hàng
      </Button>

      {open && (
        <aside
          className={`fixed bottom-4 left-4 right-4 z-50 ml-auto overflow-hidden rounded-lg border bg-background shadow-2xl sm:left-auto sm:right-20 sm:w-[380px] ${
            minimized ? "h-auto" : "h-[min(620px,calc(100vh-2rem))]"
          }`}
          aria-label={`Chat order ${trackingCode}`}
        >
          <header className="flex h-14 items-center gap-3 border-b px-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {customerName || "Khách hàng"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {trackingCode}
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={() => setMinimized((current) => !current)}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">
                {minimized ? "Mở rộng" : "Thu nhỏ"}
              </span>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </Button>
          </header>

          {!minimized && (
            <div className="flex h-[calc(100%-3.5rem)] min-h-0 flex-col">
              <OrderChatPopupContent
                orderId={orderId}
                trackingCode={trackingCode}
                customerName={customerName}
              />
            </div>
          )}
        </aside>
      )}
    </>
  );
};

export default OrderChatPopup;
