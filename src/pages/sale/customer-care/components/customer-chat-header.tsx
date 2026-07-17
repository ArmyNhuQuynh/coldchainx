import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TChatParticipant } from "@/schemas/chat.schema";
import { Info, Phone, Video } from "lucide-react";
import type { CustomerCareCustomer, CustomerCareOrder } from "./customer-care-utils";
import { getCustomerInitial } from "./customer-care-utils";

type Props = {
  customer?: CustomerCareCustomer;
  orders: CustomerCareOrder[];
  participant?: TChatParticipant;
};

const CustomerChatHeader = ({ customer, orders, participant }: Props) => {
  if (!customer) {
    return (
      <div className="flex h-20 items-center border-b bg-background px-6">
        <div>
          <h2 className="text-lg font-semibold">Chọn đoạn chat</h2>
          <p className="text-sm text-muted-foreground">
            Chọn khách hàng để bắt đầu tư vấn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-20 items-center justify-between border-b bg-background px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getCustomerInitial(customer.customerName)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">{customer.customerName}</h2>
          <p className="truncate text-sm text-muted-foreground">
            Đang hoạt động · {orders.length} order đang xử lý
            {participant?.customerEmail ? ` · ${participant.customerEmail}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-blue-600">
        <button className="rounded-full p-2 hover:bg-blue-50" type="button">
          <Phone className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-blue-50" type="button">
          <Video className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-blue-50" type="button">
          <Info className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomerChatHeader;
