import type { TCustomerOrderSummary } from "@/schemas/customer.schema";
import type { TOrder } from "@/schemas/order.schema";
import type { TChatCustomerSummary } from "@/schemas/chat.schema";
import { ORDER_STATUS } from "@/types/enums/order-status.enum";

export type CustomerCareOrder = Pick<
  TCustomerOrderSummary,
  | "orderId"
  | "trackingCode"
  | "itemName"
  | "category"
  | "quantity"
  | "packingType"
  | "tempCondition"
  | "expectedWeightKg"
  | "expectedCbm"
  | "status"
  | "createdAt"
> & {
  customerId?: string | null;
  customerName?: string | null;
};

export type CustomerCareCustomer = {
  customerId: string;
  customerName: string;
  latestOrderAt?: string | null;
  lastMessageAt?: string | null;
  lastMessageContent?: string | null;
  lastMessageOrderId?: string | null;
  activeOrderCount: number;
  unreadCount: number;
  orders: CustomerCareOrder[];
};

const TERMINAL_ORDER_STATUSES = new Set([
  ORDER_STATUS.REJECTED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.RETURNED,
]);

export const isCustomerCareOrderActive = (status?: string | null) => {
  if (!status) return false;
  return !TERMINAL_ORDER_STATUSES.has(
    status.trim().toUpperCase() as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
  );
};

export const toCustomerCareOrder = (
  order: TOrder | TCustomerOrderSummary,
  customer?: { customerId?: string | null; customerName?: string | null }
): CustomerCareOrder => ({
  orderId: order.orderId,
  trackingCode: order.trackingCode,
  itemName: order.itemName,
  category: order.category,
  quantity: order.quantity,
  packingType: order.packingType,
  tempCondition: order.tempCondition,
  expectedWeightKg: order.expectedWeightKg,
  expectedCbm: order.expectedCbm,
  status: order.status,
  createdAt: order.createdAt,
  customerId: "customerId" in order ? order.customerId : customer?.customerId,
  customerName: "customerName" in order ? order.customerName : customer?.customerName,
});

export const toCustomerCareCustomer = (
  customer: TChatCustomerSummary
): CustomerCareCustomer => ({
  customerId: customer.customerId,
  customerName: customer.customerName,
  latestOrderAt: customer.latestOrderAt,
  lastMessageAt: customer.lastMessageAt,
  lastMessageContent: customer.lastMessageContent,
  lastMessageOrderId: customer.lastMessageOrderId,
  activeOrderCount: customer.activeOrderCount,
  unreadCount: customer.unreadCount,
  orders: [],
});

export const formatChatDateTime = (value?: string | null) => {
  if (!value) return "Chưa có thời gian";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có thời gian";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatMessageTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCustomerInitial = (name: string) =>
  name.trim().charAt(0).toUpperCase() || "K";
