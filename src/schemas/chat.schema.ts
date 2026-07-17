import { z } from "zod";

export const ChatMessageSchema = z.object({
  id: z.string().uuid({ message: "ID tin nhắn không hợp lệ" }),
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  senderId: z.string().uuid({ message: "ID người gửi không hợp lệ" }),
  senderName: z.string().nullable().optional(),
  senderEmail: z.string().nullable().optional(),
  senderRole: z.string().nullable().optional(),
  receiverId: z.string().uuid({ message: "ID người nhận không hợp lệ" }),
  receiverName: z.string().nullable().optional(),
  receiverEmail: z.string().nullable().optional(),
  receiverRole: z.string().nullable().optional(),
  messageContent: z.string({ message: "Nội dung tin nhắn không hợp lệ" }),
  createdAt: z.string({ message: "Thời gian gửi không hợp lệ" }),
  isRead: z.boolean({ message: "Trạng thái đọc không hợp lệ" }),
});

export const SendChatMessageSchema = z.object({
  receiverId: z.string().uuid({ message: "Người nhận không hợp lệ" }),
  messageContent: z
    .string({ message: "Nội dung tin nhắn không hợp lệ" })
    .trim()
    .min(1, "Tin nhắn không được để trống"),
});

export const ChatParticipantSchema = z.object({
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  customerId: z.string().uuid({ message: "ID khách hàng không hợp lệ" }).nullable(),
  customerUserId: z
    .string()
    .uuid({ message: "ID tài khoản khách hàng không hợp lệ" })
    .nullable(),
  customerName: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional(),
});

export const MarkChatMessagesReadSchema = z.object({
  updatedCount: z.number({ message: "Số lượng đã đọc không hợp lệ" }),
});

export const ChatUnreadCountSchema = z.object({
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  unreadCount: z.number({ message: "Số tin chưa đọc không hợp lệ" }),
});

export type TChatMessage = z.infer<typeof ChatMessageSchema>;
export type TSendChatMessage = z.infer<typeof SendChatMessageSchema>;
export type TChatParticipant = z.infer<typeof ChatParticipantSchema>;
export type TMarkChatMessagesRead = z.infer<typeof MarkChatMessagesReadSchema>;
export type TChatUnreadCount = z.infer<typeof ChatUnreadCountSchema>;
