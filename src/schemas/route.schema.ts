import { z } from "zod";
import { ROUTE_STATUS } from "@/types/enums/route-status.enum";

export const RouteSchema = z.object({
  routeId: z.string().uuid("ID tuyến không hợp lệ"),
  routeCode: z.string({ message: "Mã tuyến không hợp lệ" }),
  originCity: z.string({ message: "Điểm đi không hợp lệ" }),
  destCity: z.string({ message: "Điểm đến không hợp lệ" }),
  transitTime: z.string({ message: "Thời gian vận chuyển không hợp lệ" }),
  status: z.string({ message: "Trạng thái tuyến không hợp lệ" }),
  createdAt: z.string().nullable().optional(),
});

export const RouteListParamsSchema = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  originCity: z.string().optional(),
  destCity: z.string().optional(),
  status: z.enum([ROUTE_STATUS.ACTIVE, ROUTE_STATUS.INACTIVE]).optional(),
});

export const RouteRequestSchema = z.object({
  routeCode: z.string().min(2).max(30),
  originCity: z.string().min(1).max(80),
  destCity: z.string().min(1).max(80),
  transitTime: z.string().min(1).max(80),
});

export const UpdateRouteRequestSchema = RouteRequestSchema.extend({
  status: z.enum([ROUTE_STATUS.ACTIVE, ROUTE_STATUS.INACTIVE]),
});

const routeCodePattern = /^[A-Z0-9-]+$/;

export const RouteFormSchema = z.object({
  routeCode: z
    .string()
    .trim()
    .min(2, "Mã tuyến phải từ 2 ký tự")
    .max(30, "Mã tuyến không được quá 30 ký tự")
    .transform((value) => value.toUpperCase())
    .refine((value) => routeCodePattern.test(value), {
      message: "Mã tuyến chỉ gồm chữ in hoa, số và dấu gạch ngang",
    }),
  originCity: z
    .string()
    .trim()
    .min(1, "Điểm đi không được để trống")
    .max(80, "Điểm đi không được quá 80 ký tự"),
  destCity: z
    .string()
    .trim()
    .min(1, "Điểm đến không được để trống")
    .max(80, "Điểm đến không được quá 80 ký tự"),
  transitTime: z
    .string()
    .trim()
    .min(1, "Thời gian vận chuyển không được để trống")
    .max(80, "Thời gian vận chuyển không được quá 80 ký tự"),
  status: z.enum([ROUTE_STATUS.ACTIVE, ROUTE_STATUS.INACTIVE]),
});

export const RouteStopSchema = z.object({
  stopId: z.string().uuid("ID điểm dừng không hợp lệ"),
  routeId: z.string().uuid("ID tuyến không hợp lệ"),
  stopName: z.string({ message: "Tên điểm dừng không hợp lệ" }),
  createdAt: z.string().nullable().optional(),
});

export const RouteStopRequestSchema = z.object({
  stopName: z.string().trim().min(1).max(120),
});

export const RouteStopFormSchema = z.object({
  stopName: z
    .string()
    .trim()
    .min(1, "Tên điểm dừng không được để trống")
    .max(120, "Tên điểm dừng không được quá 120 ký tự"),
});

export const RouteOriginWarehouseSchema = z.object({
  warehouseId: z.string().uuid("ID kho không hợp lệ"),
  warehouseName: z.string({ message: "Tên kho không hợp lệ" }),
  address: z.string().nullable().optional(),
});

export type TRoute = z.infer<typeof RouteSchema>;
export type TRouteListParams = z.infer<typeof RouteListParamsSchema>;
export type TRouteRequest = z.infer<typeof RouteRequestSchema>;
export type TUpdateRouteRequest = z.infer<typeof UpdateRouteRequestSchema>;
export type TRouteFormValues = z.infer<typeof RouteFormSchema>;
export type TRouteStop = z.infer<typeof RouteStopSchema>;
export type TRouteStopRequest = z.infer<typeof RouteStopRequestSchema>;
export type TRouteStopFormValues = z.infer<typeof RouteStopFormSchema>;
export type TRouteOriginWarehouse = z.infer<typeof RouteOriginWarehouseSchema>;

export type TRouteStopListParams = {
  pageIndex: number;
  pageSize: number;
};

export type TRouteStopListResponse = {
  data: TRouteStop[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export const ROUTE_LIST_DEFAULT_PARAMS: TRouteListParams = {
  pageNumber: 1,
  pageSize: 10,
  originCity: "",
  destCity: "",
  status: undefined,
};

export const ROUTE_FORM_DEFAULTS: TRouteFormValues = {
  routeCode: "",
  originCity: "",
  destCity: "",
  transitTime: "",
  status: ROUTE_STATUS.ACTIVE,
};

export const ROUTE_STOP_FORM_DEFAULTS: TRouteStopFormValues = {
  stopName: "",
};
