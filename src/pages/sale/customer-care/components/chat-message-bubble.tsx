import { cn } from "@/lib/utils";
import type { TChatMessage } from "@/schemas/chat.schema";
import { formatMessageTime } from "./customer-care-utils";

type Props = {
  message: TChatMessage;
  currentUserId?: string | null;
};

const isCustomerRole = (role?: string | null) =>
  role?.trim().toLowerCase() === "customer";

const ChatMessageBubble = ({ message, currentUserId }: Props) => {
  const isMine = currentUserId
    ? message.senderId === currentUserId
    : !isCustomerRole(message.senderRole);

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[72%] rounded-3xl px-4 py-2 text-[15px] shadow-sm",
          isMine
            ? "bg-blue-600 text-white"
            : "bg-white text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.messageContent}
        </p>
        <div
          className={cn(
            "mt-1 flex items-center gap-2 text-[11px]",
            isMine ? "justify-end text-white/80" : "text-muted-foreground"
          )}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isMine && <span>{message.isRead ? "đã xem" : "đã gửi"}</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
