import { z } from "zod";
import { WAREHOUSE_STATUS } from "@/types/enums/warehouse-status.enum";
import { WAREHOUSE_TYPE } from "@/types/enums/warehouse-type.enum";

export type TWarehouseLookup = {
  warehouseId: string;
  warehouseCode?: string | null;
  warehouseName: string;
  address?: string | null;
  label?: string;
};

export const WarehouseSchema = z.object({
  warehouseId: z.string().uuid("ID kho không hợp lệ"),
  warehouseCode: z.string({ message: "Mã kho không hợp lệ" }),
  warehouseName: z.string({ message: "Tên kho không hợp lệ" }),
  warehouseType: z.string({ message: "Loại kho không hợp lệ" }),
  address: z.string().nullable().optional(),
  maxPallets: z.number({ message: "Sức chứa pallet không hợp lệ" }),
  currentPallets: z.number().nullable().optional(),
  defaultMinTemp: z.number().nullable().optional(),
  defaultMaxTemp: z.number().nullable().optional(),
  status: z.string({ message: "Trạng thái kho không hợp lệ" }),
  createdAt: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const WarehouseListResponseSchema = z.object({
  totalRecords: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  data: z.array(WarehouseSchema),
});

export const WarehouseListParamsSchema = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  search: z.string().optional(),
});

export const WarehouseRequestSchema = z.object({
  warehouseCode: z.string().min(3).max(20),
  warehouseName: z.string().min(1).max(100),
  warehouseType: z.enum([
    WAREHOUSE_TYPE.DRY,
    WAREHOUSE_TYPE.COLD,
    WAREHOUSE_TYPE.BONDED,
    WAREHOUSE_TYPE.CHEMICAL,
  ]),
  address: z.string().nullable().optional(),
  maxPallets: z.number().min(0),
  defaultMinTemp: z.number().nullable().optional(),
  defaultMaxTemp: z.number().nullable().optional(),
  status: z.enum([
    WAREHOUSE_STATUS.ACTIVE,
    WAREHOUSE_STATUS.INACTIVE,
    WAREHOUSE_STATUS.MAINTENANCE,
  ]),
});

const warehouseCodePattern = /^[A-Z0-9-]+$/;

export const WarehouseFormSchema = z
  .object({
    warehouseCode: z
      .string()
      .trim()
      .min(3, "Mã kho phải từ 3 ký tự")
      .max(20, "Mã kho không được quá 20 ký tự")
      .transform((value) => value.toUpperCase())
      .refine((value) => warehouseCodePattern.test(value), {
        message: "Mã kho chỉ gồm chữ in hoa, số và dấu gạch ngang",
      }),
    warehouseName: z
      .string()
      .trim()
      .min(1, "Tên kho không được để trống")
      .max(100, "Tên kho không được quá 100 ký tự"),
    warehouseType: z.enum([
      WAREHOUSE_TYPE.DRY,
      WAREHOUSE_TYPE.COLD,
      WAREHOUSE_TYPE.BONDED,
      WAREHOUSE_TYPE.CHEMICAL,
    ]),
    address: z
      .string()
      .trim()
      .max(100, "Địa chỉ không được quá 100 ký tự")
      .optional(),
    maxPallets: z.number().min(0, "Sức chứa pallet không được âm"),
    defaultMinTemp: z.number().nullable(),
    defaultMaxTemp: z.number().nullable(),
    status: z.enum([
      WAREHOUSE_STATUS.ACTIVE,
      WAREHOUSE_STATUS.INACTIVE,
      WAREHOUSE_STATUS.MAINTENANCE,
    ]),
  })
  .superRefine((values, context) => {
    if (values.warehouseType !== WAREHOUSE_TYPE.COLD) return;

    if (values.defaultMinTemp === null) {
      context.addIssue({
        code: "custom",
        path: ["defaultMinTemp"],
        message: "Kho lạnh cần nhiệt độ tối thiểu",
      });
    }

    if (values.defaultMaxTemp === null) {
      context.addIssue({
        code: "custom",
        path: ["defaultMaxTemp"],
        message: "Kho lạnh cần nhiệt độ tối đa",
      });
    }

    if (
      values.defaultMinTemp !== null &&
      values.defaultMaxTemp !== null &&
      values.defaultMaxTemp <= values.defaultMinTemp
    ) {
      context.addIssue({
        code: "custom",
        path: ["defaultMaxTemp"],
        message: "Nhiệt độ tối đa phải lớn hơn nhiệt độ tối thiểu",
      });
    }
  });

export type TWarehouse = z.infer<typeof WarehouseSchema>;
export type TWarehouseListResponse = z.infer<
  typeof WarehouseListResponseSchema
>;
export type TWarehouseListParams = z.infer<typeof WarehouseListParamsSchema>;
export type TWarehouseRequest = z.infer<typeof WarehouseRequestSchema>;
export type TWarehouseFormValues = z.infer<typeof WarehouseFormSchema>;

export const WAREHOUSE_LIST_DEFAULT_PARAMS: TWarehouseListParams = {
  pageNumber: 1,
  pageSize: 10,
  search: "",
};

export const WAREHOUSE_FORM_DEFAULTS: TWarehouseFormValues = {
  warehouseCode: "",
  warehouseName: "",
  warehouseType: WAREHOUSE_TYPE.COLD,
  address: "",
  maxPallets: 0,
  defaultMinTemp: -18,
  defaultMaxTemp: -5,
  status: WAREHOUSE_STATUS.ACTIVE,
};
