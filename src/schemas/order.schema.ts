import { z } from "zod";
import { ORDER_CATEGORY } from "../types/enums/order-category.enum";
import { ORDER_STATUS } from "../types/enums/order-status.enum";

// ===== QUERY PARAMS =====
export interface TGetOrdersQuery {
  pageNumber?: number;
  pageSize?: number;
}

// ===== ENUM =====
export const OrderStatusEnum = z.union([
  z.literal(ORDER_STATUS.PENDING_REVIEW, { message: "Trạng thái đơn hàng không hợp lệ" }),
  z.literal(ORDER_STATUS.APPROVED,       { message: "Trạng thái đơn hàng không hợp lệ" }),
  z.literal(ORDER_STATUS.REJECTED,       { message: "Trạng thái đơn hàng không hợp lệ" }),
  z.literal(ORDER_STATUS.IN_PROGRESS,    { message: "Trạng thái đơn hàng không hợp lệ" }),
  z.literal(ORDER_STATUS.COMPLETED,      { message: "Trạng thái đơn hàng không hợp lệ" }),
  z.literal(ORDER_STATUS.CANCELLED,      { message: "Trạng thái đơn hàng không hợp lệ" }),
]);

export const OrderCategoryEnum = z.union([
  z.literal(ORDER_CATEGORY.MEAT_SEAFOOD,          { message: "Loại hàng không hợp lệ" }),
  z.literal(ORDER_CATEGORY.FROZEN_FRUITS_VEGGIES, { message: "Loại hàng không hợp lệ" }),
  z.literal(ORDER_CATEGORY.ICE_CREAM_BEVERAGES,   { message: "Loại hàng không hợp lệ" }),
  z.literal(ORDER_CATEGORY.PHARMACEUTICALS,       { message: "Loại hàng không hợp lệ" }),
  z.literal(ORDER_CATEGORY.RAW_MATERIALS_OTHERS,  { message: "Loại hàng không hợp lệ" }),
]);

// ===== DESTINATION =====
export const OrderDestinationSchema = z.object({
  locationId: z.string().uuid({ message: "ID địa điểm không hợp lệ" }),
  address:    z.string({ message: "Địa chỉ không hợp lệ" }),
  latitude:   z.number({ message: "Vĩ độ không hợp lệ" }),
  longitude:  z.number({ message: "Kinh độ không hợp lệ" }),
});

// ===== DOCUMENT =====
export const OrderDocumentSchema = z.object({
  docId:     z.string().uuid({ message: "ID tài liệu không hợp lệ" }),
  docType:   z.string({ message: "Loại tài liệu không hợp lệ" }),
  imageUrl:  z.string({ message: "URL ảnh không hợp lệ" }),
  status:    z.string({ message: "Trạng thái không hợp lệ" }),
  createdAt: z.string({ message: "Thời gian tạo không hợp lệ" }),
});

// ===== QUOTATION =====
export const OrderQuotationSchema = z.object({
  quotationId: z.string().uuid({ message: "ID báo giá không hợp lệ" }).optional(),
  vasAmount:   z.number({ message: "Số tiền không hợp lệ" }).nullable().optional(),
  note:        z.string({ message: "Ghi chú không hợp lệ" }).nullable().optional(),
  createdAt:   z.string({ message: "Thời gian tạo không hợp lệ" }).optional(),
});

// ===== ORDER =====
export const OrderSchema = z.object({
  orderId:          z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  trackingCode:     z.string({ message: "Mã tracking không hợp lệ" }),
  customerId:       z.string().uuid({ message: "ID khách hàng không hợp lệ" }),
  customerName:     z.string({ message: "Tên khách hàng không hợp lệ" }),
  itemName:         z.string({ message: "Tên hàng hóa không hợp lệ" }),
  category:         OrderCategoryEnum,
  quantity:         z.number({ message: "Số lượng không hợp lệ" }).int(),
  packingType:      z.string({ message: "Loại đóng gói không hợp lệ" }),
  tempCondition:    z.string({ message: "Nhiệt độ bảo quản không hợp lệ" }),
  expectedWeightKg: z.number({ message: "Cân nặng dự kiến không hợp lệ" }),
  actualWeightKg:   z.number({ message: "Cân nặng thực tế không hợp lệ" }).nullable(),
  expectedCbm:      z.number({ message: "Thể tích dự kiến không hợp lệ" }).nullable(),
  actualCbm:        z.number({ message: "Thể tích thực tế không hợp lệ" }).nullable(),
  cargoValue:       z.number({ message: "Giá trị hàng hóa không hợp lệ" }),
  status:           OrderStatusEnum,
  createdAt:        z.string({ message: "Thời gian tạo không hợp lệ" }),
  destination:      OrderDestinationSchema,
  documents:        z.array(OrderDocumentSchema, { message: "Danh sách tài liệu không hợp lệ" }),
  quotations:       z.array(OrderQuotationSchema, { message: "Danh sách báo giá không hợp lệ" }),
});

// ===== ORDER LIST RESPONSE =====
export const OrderListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    totalRecords: z.number(),
    totalPages:   z.number(),
    currentPage:  z.number(),
    pageSize:     z.number(),
    data:         z.array(OrderSchema, { message: "Danh sách đơn hàng không hợp lệ" }),
  }),
});

//====== ORDER REVIEW =====
export const ReviewOrderSchema = z.object({
  action: z.union([
    z.literal("APPROVE", { message: "Action không hợp lệ" }),
    z.literal("REJECT",  { message: "Action không hợp lệ" }),
  ]),
  rejectReason: z.string({ message: "Lý do từ chối không hợp lệ" }).nullable().optional(),
});

// ===== EXPORT TYPES =====
export type TOrder             = z.infer<typeof OrderSchema>;
export type TOrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type TOrderDestination  = z.infer<typeof OrderDestinationSchema>;
export type TOrderDocument     = z.infer<typeof OrderDocumentSchema>;
export type TReviewOrder       = z.infer<typeof ReviewOrderSchema>;
export type TOrderQuotation    = z.infer<typeof OrderQuotationSchema>;