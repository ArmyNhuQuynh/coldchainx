import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { CustomerCareOrder } from "./customer-care-utils";
import { Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { getOrderStatusLabel } from "@/types/enums/order-status.enum";

type Props = {
  orders: CustomerCareOrder[];
  selectedOrder?: CustomerCareOrder;
  canSend: boolean;
  isSending?: boolean;
  disabledReason?: string;
  onSelectOrder: (orderId: string) => void;
  onSend: (message: string) => Promise<void>;
};

const ChatComposer = ({
  orders,
  selectedOrder,
  canSend,
  isSending,
  disabledReason,
  onSelectOrder,
  onSend,
}: Props) => {
  const [message, setMessage] = useState("");
  const [orderPickerOpen, setOrderPickerOpen] = useState(false);

  const handleSend = async () => {
    const content = message.trim();
    if (!content || !selectedOrder || !canSend || isSending) return;

    await onSend(content);
    setMessage("");
  };

  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <Popover open={orderPickerOpen} onOpenChange={setOrderPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 shrink-0 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              {orderPickerOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              <span className="sr-only">Chọn order</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="top"
            sideOffset={10}
            className="w-96 rounded-2xl p-2 shadow-xl"
          >
            <div className="px-3 py-2">
              <p className="font-semibold">Chọn order đang tư vấn</p>
              <p className="text-xs text-muted-foreground">
                Tin nhắn sẽ được gửi vào order được chọn.
              </p>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto p-1">
              {orders.length === 0 ? (
                <div className="rounded-xl p-3 text-sm text-muted-foreground">
                  Khách này chưa có order đang hoạt động.
                </div>
              ) : (
                orders.map((order) => {
                  const status = getOrderStatusLabel(order.status);
                  const isSelected = order.orderId === selectedOrder?.orderId;

                  return (
                    <button
                      key={order.orderId}
                      type="button"
                      className={
                        isSelected
                          ? "w-full rounded-xl bg-blue-50 p-3 text-left"
                          : "w-full rounded-xl p-3 text-left hover:bg-muted"
                      }
                      onClick={() => {
                        onSelectOrder(order.orderId);
                        setOrderPickerOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {order.trackingCode}
                          </p>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {order.itemName}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="min-w-0 flex-1">
          {selectedOrder && (
            <div className="mb-1 truncate px-3 text-xs text-blue-700">
              Đang trả lời: {selectedOrder.trackingCode}
            </div>
          )}
          {disabledReason && (
            <div className="mb-1 truncate px-3 text-xs text-amber-700">
              {disabledReason}
            </div>
          )}
          <Input
            value={message}
            placeholder={selectedOrder ? "Aa" : "Chọn order trước khi nhắn"}
            className="h-11 rounded-full border-transparent bg-muted px-4 shadow-none focus-visible:ring-1"
            disabled={!selectedOrder || isSending}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSend();
              }
            }}
          />
        </div>
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700"
          disabled={!message.trim() || !selectedOrder || !canSend || isSending}
          onClick={() => void handleSend()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Gửi</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatComposer;
