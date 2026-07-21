import { ROUTE_SCHEDULE_STATUS } from "@/types/enums/route-schedule-status.enum";
import { z } from "zod";

export const RouteScheduleSchema = z.object({
  scheduleId: z.guid("ID lịch đi không hợp lệ"),
  routeId: z.guid("ID tuyến không hợp lệ"),
  scheduleName: z.string({ message: "Tên lịch đi không hợp lệ" }),
  departureDate: z.string({ message: "Ngày đi không hợp lệ" }),
  departureTime: z.string({ message: "Giờ đi không hợp lệ" }),
  cutOffTime: z.string({ message: "Giờ cut-off không hợp lệ" }),
  status: z.string({ message: "Trạng thái lịch đi không hợp lệ" }),
  createdAt: z.string().nullable().optional(),
});

export const RouteScheduleCreateRequestSchema = z.object({
  departureDate: z.string().min(1, "Ngày đi không được để trống"),
  departureTime: z.string().min(1, "Giờ đi không được để trống"),
  cutOffTime: z.string().min(1, "Giờ cut-off không được để trống"),
});

export const RouteScheduleUpdateRequestSchema =
  RouteScheduleCreateRequestSchema.extend({
    status: z.enum([
      ROUTE_SCHEDULE_STATUS.ACTIVE,
      ROUTE_SCHEDULE_STATUS.INACTIVE,
    ]),
  });

export const RouteScheduleFormSchema = RouteScheduleUpdateRequestSchema.extend({
  routeId: z.guid("Chọn tuyến vận chuyển"),
});

export type TRouteSchedule = z.infer<typeof RouteScheduleSchema>;
export type TRouteScheduleCreateRequest = z.infer<
  typeof RouteScheduleCreateRequestSchema
>;
export type TRouteScheduleUpdateRequest = z.infer<
  typeof RouteScheduleUpdateRequestSchema
>;
export type TRouteScheduleFormValues = z.infer<typeof RouteScheduleFormSchema>;

export type TRouteScheduleListParams = {
  pageIndex: number;
  pageSize: number;
};

export type TRouteScheduleListResponse = {
  data: TRouteSchedule[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export const ROUTE_SCHEDULE_PAGE_SIZE = 10;

export const ROUTE_SCHEDULE_FORM_DEFAULTS: TRouteScheduleFormValues = {
  routeId: "",
  departureDate: "",
  departureTime: "",
  cutOffTime: "",
  status: ROUTE_SCHEDULE_STATUS.ACTIVE,
};
