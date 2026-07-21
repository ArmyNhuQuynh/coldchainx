import { ScrollArea } from "@/components/ui/scroll-area";
import type { TChatMessage } from "@/schemas/chat.schema";
import ChatMessageBubble from "./chat-message-bubble";
import type { CustomerCareOrder } from "./customer-care-utils";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

export type CustomerCareTimelineItem = {
  order: CustomerCareOrder;
  message: TChatMessage;
};

type Props = {
  conversationKey: string;
  items: CustomerCareTimelineItem[];
  selectedOrderId?: string;
  hasSelectedOrder?: boolean;
  isLoading?: boolean;
  isLoadingOlder?: boolean;
  hasOlderMessages?: boolean;
  currentUserId?: string | null;
  onSelectOrder: (orderId: string) => void;
  onLoadOlder: () => Promise<unknown>;
};

const MessengerChatThread = ({
  conversationKey,
  items,
  selectedOrderId,
  hasSelectedOrder,
  isLoading,
  isLoadingOlder,
  hasOlderMessages,
  currentUserId,
  onSelectOrder,
  onLoadOlder,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const onLoadOlderRef = useRef(onLoadOlder);
  const loadingOlderRef = useRef(false);
  const initialScrollPendingRef = useRef(true);
  const previousItemCountRef = useRef(0);

  useEffect(() => {
    onLoadOlderRef.current = onLoadOlder;
  }, [onLoadOlder]);

  const getViewport = useCallback(
    () =>
      rootRef.current?.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]'
      ),
    []
  );

  useEffect(() => {
    initialScrollPendingRef.current = true;
    previousItemCountRef.current = 0;
  }, [conversationKey]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport || isLoading || items.length === 0) return;

    if (initialScrollPendingRef.current) {
      initialScrollPendingRef.current = false;
      requestAnimationFrame(() => {
        viewport.scrollTop = viewport.scrollHeight;
      });
    } else if (
      items.length > previousItemCountRef.current &&
      !loadingOlderRef.current &&
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 160
    ) {
      requestAnimationFrame(() => {
        viewport.scrollTop = viewport.scrollHeight;
      });
    }

    previousItemCountRef.current = items.length;
  }, [getViewport, isLoading, items.length]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    const handleScroll = async () => {
      if (
        viewport.scrollTop > 80 ||
        !hasOlderMessages ||
        isLoadingOlder ||
        loadingOlderRef.current
      ) {
        return;
      }

      loadingOlderRef.current = true;
      const previousHeight = viewport.scrollHeight;
      const previousTop = viewport.scrollTop;

      try {
        await onLoadOlderRef.current();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            viewport.scrollTop =
              viewport.scrollHeight - previousHeight + previousTop;
            loadingOlderRef.current = false;
          });
        });
      } catch {
        loadingOlderRef.current = false;
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [getViewport, hasOlderMessages, isLoadingOlder]);

  return (
    <ScrollArea
      ref={rootRef}
      className="min-h-0 flex-1 bg-gradient-to-b from-sky-50 via-blue-50 to-emerald-50"
    >
      <div className="min-h-full px-8 py-6">
        {isLoading ? (
          <div className="flex h-full min-h-[360px] items-center justify-center text-sm text-muted-foreground">
            Đang tải tin nhắn...
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full min-h-[360px] items-center justify-center text-center">
            <div>
              <p className="text-lg font-semibold">
                {hasSelectedOrder
                  ? "Chưa có tin nhắn cho order này"
                  : "Chọn đơn hàng để bắt đầu tư vấn"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hasSelectedOrder
                  ? "Bạn có thể nhập tin nhắn ở ô bên dưới để bắt đầu trao đổi với khách."
                  : "Bấm nút dấu cộng bên dưới để chọn một order đang hoạt động của khách."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {isLoadingOlder && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang tải tin nhắn cũ
              </div>
            )}
            {items.map((item, index) => {
              const previous = items[index - 1];
              const shouldShowDivider =
                !previous || previous.order.orderId !== item.order.orderId;
              const isSelected = selectedOrderId === item.order.orderId;

              return (
                <div key={item.message.id} className="space-y-3">
                  {shouldShowDivider && (
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 py-3 text-xs font-semibold text-muted-foreground"
                      onClick={() => onSelectOrder(item.order.orderId)}
                    >
                      <span className="h-px flex-1 bg-border/80" />
                      <span
                        className={
                          isSelected
                            ? "rounded-full bg-blue-600 px-3 py-1 text-white"
                            : "rounded-full bg-white/80 px-3 py-1 text-foreground shadow-sm"
                        }
                      >
                        {item.order.trackingCode}
                      </span>
                      <span className="h-px flex-1 bg-border/80" />
                    </button>
                  )}

                  <ChatMessageBubble
                    message={item.message}
                    currentUserId={currentUserId}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessengerChatThread;
