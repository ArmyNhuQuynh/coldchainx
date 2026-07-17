import { ScrollArea } from "@/components/ui/scroll-area";
import type { TChatMessage } from "@/schemas/chat.schema";
import ChatMessageBubble from "./chat-message-bubble";
import type { CustomerCareOrder } from "./customer-care-utils";

export type CustomerCareTimelineItem = {
  order: CustomerCareOrder;
  message: TChatMessage;
};

type Props = {
  items: CustomerCareTimelineItem[];
  selectedOrderId?: string;
  hasSelectedOrder?: boolean;
  isLoading?: boolean;
  currentUserId?: string | null;
  onSelectOrder: (orderId: string) => void;
};

const MessengerChatThread = ({
  items,
  selectedOrderId,
  hasSelectedOrder,
  isLoading,
  currentUserId,
  onSelectOrder,
}: Props) => {
  return (
    <ScrollArea className="min-h-0 flex-1 bg-gradient-to-b from-sky-50 via-blue-50 to-emerald-50">
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
