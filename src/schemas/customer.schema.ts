import { z } from "zod";

export const CustomerSchema = z.object({
  customerId: z.string().uuid({ message: "ID khách hàng không hợp lệ" }),
  companyName: z.string({ message: "Tên khách hàng không hợp lệ" }),
  taxCode: z.string({ message: "Mã số thuế không hợp lệ" }),
  address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  paymentTerm: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  orderCount: z.number({ message: "Số đơn hàng không hợp lệ" }),
  contractCount: z.number({ message: "Số hợp đồng không hợp lệ" }),
});

export const CustomerOrderSummarySchema = z.object({
  orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  trackingCode: z.string({ message: "Mã tracking không hợp lệ" }),
  itemName: z.string({ message: "Tên hàng hóa không hợp lệ" }),
  category: z.string({ message: "Loại hàng không hợp lệ" }),
  quantity: z.number({ message: "Số lượng không hợp lệ" }),
  packingType: z.string({ message: "Loại đóng gói không hợp lệ" }),
  tempCondition: z.string({ message: "Nhiệt độ bảo quản không hợp lệ" }),
  expectedWeightKg: z.number({ message: "Cân nặng dự kiến không hợp lệ" }),
  expectedCbm: z.number({ message: "Thể tích dự kiến không hợp lệ" }),
  status: z.string({ message: "Trạng thái đơn hàng không hợp lệ" }),
  createdAt: z.string().nullable().optional(),
});

export type TCustomer = z.infer<typeof CustomerSchema>;
export type TCustomerOrderSummary = z.infer<typeof CustomerOrderSummarySchema>;

export interface TGetCustomersQuery {
  pageNumber?: number;
  pageSize?: number;
}

export interface TGetCustomerOrdersQuery {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
}
