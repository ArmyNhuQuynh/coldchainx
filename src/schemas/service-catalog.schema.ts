import { z } from "zod";

export const ServiceCatalogSchema = z.object({
  serviceCatalogId: z.string().uuid("ID dịch vụ không hợp lệ"),
  serviceCode: z.string({ message: "Mã dịch vụ không hợp lệ" }),
  serviceName: z.string({ message: "Tên dịch vụ không hợp lệ" }),
  description: z.string().nullable().optional(),
  defaultPrice: z.number({ message: "Giá mặc định không hợp lệ" }),
  isMandatory: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const ServiceCatalogFormSchema = z.object({
  serviceCode: z
    .string()
    .trim()
    .min(2, "Mã dịch vụ phải từ 2 ký tự")
    .max(50, "Mã dịch vụ không được quá 50 ký tự")
    .transform((value) => value.toUpperCase()),
  serviceName: z
    .string()
    .trim()
    .min(1, "Tên dịch vụ không được để trống")
    .max(200, "Tên dịch vụ không được quá 200 ký tự"),
  description: z.string().trim().optional(),
  defaultPrice: z.number().min(0, "Giá mặc định không được âm"),
  isMandatory: z.boolean(),
  isActive: z.boolean(),
});

export const ServiceCatalogCreateRequestSchema = ServiceCatalogFormSchema;

export const ServiceCatalogUpdateRequestSchema = ServiceCatalogFormSchema.omit({
  serviceCode: true,
});

export type TServiceCatalog = z.infer<typeof ServiceCatalogSchema>;
export type TServiceCatalogFormValues = z.infer<typeof ServiceCatalogFormSchema>;
export type TServiceCatalogCreateRequest = z.infer<
  typeof ServiceCatalogCreateRequestSchema
>;
export type TServiceCatalogUpdateRequest = z.infer<
  typeof ServiceCatalogUpdateRequestSchema
>;

export const SERVICE_CATALOG_FORM_DEFAULTS: TServiceCatalogFormValues = {
  serviceCode: "",
  serviceName: "",
  description: "",
  defaultPrice: 0,
  isMandatory: false,
  isActive: true,
};
