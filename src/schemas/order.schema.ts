import { z } from "zod";
import { ORDER_CATEGORY } from "../types/enums/order-category.enum";

// ===== QUERY PARAMS =====
export interface TGetOrdersQuery {
  pageNumber?: number;
  pageSize?: number;
}

// ===== ENUM =====
// BE lưu trạng thái Order dưới dạng string và có nhiều trạng thái theo từng
// nghiệp vụ (QUOTING, CONTRACT_PENDING, CONTRACT_SIGNED, IN_WAREHOUSE, ...).
export const OrderStatusSchema = z.string({ message: "Trạng thái đơn hàng không hợp lệ" });

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
  status:    z.string({ message: "Trạng thái không hợp lệ" }).nullable(),
  createdAt: z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
});

// ===== ROUTE =====
export const OrderRouteSchema = z.object({
  routeId:     z.string().uuid({ message: "ID tuyến đường không hợp lệ" }),
  routeCode:   z.string({ message: "Mã tuyến đường không hợp lệ" }),
  originCity:  z.string({ message: "Điểm đi không hợp lệ" }),
  destCity:    z.string({ message: "Điểm đến không hợp lệ" }),
  transitTime: z.string({ message: "Thời gian vận chuyển không hợp lệ" }),
  cutOffTime:  z.string({ message: "Thời gian cut-off không hợp lệ" }),
});

// ===== QUOTATION =====
export const OrderQuotationSchema = z.object({
  quoteId:             z.string().uuid({ message: "ID báo giá không hợp lệ" }),
  baseFreight:         z.number({ message: "Cước cơ bản không hợp lệ" }),
  lastMileSurcharge:   z.number({ message: "Phụ phí chặng cuối không hợp lệ" }).nullable(),
  vatPercentage:       z.number({ message: "Phần trăm VAT không hợp lệ" }).nullable(),
  vatAmount:           z.number({ message: "Tiền VAT không hợp lệ" }),
  finalAmount:         z.number({ message: "Tổng tiền không hợp lệ" }),
  fileUrl:             z.string({ message: "URL báo giá không hợp lệ" }).nullable(),
  status:              z.string({ message: "Trạng thái báo giá không hợp lệ" }),
  createdAt:           z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
});

// ===== ORDER =====
export const OrderSchema = z.object({
  orderId:          z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  trackingCode:     z.string({ message: "Mã tracking không hợp lệ" }),
  customerId:       z.string().uuid({ message: "ID khách hàng không hợp lệ" }).nullable(),
  customerName:     z.string({ message: "Tên khách hàng không hợp lệ" }).nullable(),
  itemName:         z.string({ message: "Tên hàng hóa không hợp lệ" }),
  category:         OrderCategoryEnum,
  quantity:         z.number({ message: "Số lượng không hợp lệ" }).int(),
  packingType:      z.string({ message: "Loại đóng gói không hợp lệ" }),
  tempCondition:    z.string({ message: "Nhiệt độ bảo quản không hợp lệ" }),
  expectedWeightKg: z.number({ message: "Cân nặng dự kiến không hợp lệ" }),
  actualWeightKg:   z.number({ message: "Cân nặng thực tế không hợp lệ" }),
  expectedCbm:      z.number({ message: "Thể tích dự kiến không hợp lệ" }),
  actualCbm:        z.number({ message: "Thể tích thực tế không hợp lệ" }).nullable(),
  cargoValue:       z.number({ message: "Giá trị hàng hóa không hợp lệ" }),
  status:           OrderStatusSchema,
  createdAt:        z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
  route:             OrderRouteSchema.nullable(),
  destination:      OrderDestinationSchema.nullable(),
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
    z.literal("REQUEST_UPDATE", { message: "Action không hợp lệ" }),
    z.literal("COMPLIANCE_REJECT", { message: "Action không hợp lệ" }),
  ]),
  customerNote: z.string({ message: "Ghi chú cho khách hàng không hợp lệ" }).nullable().optional(),
});

export const ReviewOrderResponseSchema = z.object({
  orderId:              z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  trackingCode:         z.string({ message: "Mã tracking không hợp lệ" }),
  status:               z.string({ message: "Trạng thái đơn hàng không hợp lệ" }),
  quoteId:              z.string().uuid({ message: "ID báo giá không hợp lệ" }).nullable(),
  baseFreight:          z.number({ message: "Cước cơ bản không hợp lệ" }).nullable(),
  lastMileSurcharge:    z.number({ message: "Phụ phí chặng cuối không hợp lệ" }).nullable(),
  vatAmount:            z.number({ message: "Tiền VAT không hợp lệ" }).nullable(),
  finalAmount:          z.number({ message: "Tổng tiền không hợp lệ" }).nullable(),
});

// ===== EXPORT TYPES =====
export type TOrder             = z.infer<typeof OrderSchema>;
export type TOrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type TOrderDestination  = z.infer<typeof OrderDestinationSchema>;
export type TOrderDocument     = z.infer<typeof OrderDocumentSchema>;
export type TReviewOrder       = z.infer<typeof ReviewOrderSchema>;
export type TReviewOrderResponse = z.infer<typeof ReviewOrderResponseSchema>;
export type TOrderQuotation    = z.infer<typeof OrderQuotationSchema>;
export type TOrderRoute        = z.infer<typeof OrderRouteSchema>;
