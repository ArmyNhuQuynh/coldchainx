import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MoreHorizontal, PenSquare, Search } from "lucide-react";
import type { CustomerCareCustomer } from "./customer-care-utils";
import { formatChatDateTime, getCustomerInitial } from "./customer-care-utils";

type Props = {
  customers: CustomerCareCustomer[];
  selectedCustomerId?: string;
  search: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onSelectCustomer: (customerId: string) => void;
};

const CustomerListPanel = ({
  customers,
  selectedCustomerId,
  search,
  isLoading,
  onSearchChange,
  onSelectCustomer,
}: Props) => {
  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Đoạn chat</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-muted/80"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">Tùy chọn</span>
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-muted/80"
            >
              <PenSquare className="h-5 w-5" />
              <span className="sr-only">Tạo tư vấn</span>
            </button>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder="Tìm kiếm trên Messenger"
            className="h-11 rounded-full border-transparent bg-muted pl-9 shadow-none focus-visible:ring-1"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-2 text-sm font-semibold">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700">
            Tất cả
          </span>
          <span className="rounded-full px-4 py-2 text-muted-foreground">
            Chưa đọc
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-1 px-2 pb-4">
          {isLoading ? (
            <div className="rounded-2xl p-4 text-sm text-muted-foreground">
              Đang tải danh sách khách hàng...
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-2xl p-4 text-sm text-muted-foreground">
              Chưa có khách hàng nào có order đang thực hiện.
            </div>
          ) : (
            customers.map((customer) => {
              const isActive = customer.customerId === selectedCustomerId;

              return (
                <button
                  key={customer.customerId}
                  type="button"
                  className={cn(
                    "w-full rounded-xl p-3 text-left transition hover:bg-muted",
                    isActive
                      ? "bg-blue-50"
                      : "bg-transparent"
                  )}
                  onClick={() => onSelectCustomer(customer.customerId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                        {getCustomerInitial(customer.customerName)}
                      </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[15px] font-semibold">
                          {customer.customerName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {customer.activeOrderCount} đơn
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                          {customer.lastMessageContent || "Chưa có tin nhắn"}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatChatDateTime(
                            customer.lastMessageAt ?? customer.latestOrderAt
                          )}
                        </span>
                        {customer.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                            {customer.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default CustomerListPanel;
