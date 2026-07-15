import type {
  TMaintenanceTicket,
  TMaintenanceTicketPage,
} from "@/schemas/vehicle.schema";

type RawMaintenancePage = Partial<TMaintenanceTicketPage> & {
  data?: TMaintenanceTicket[];
  items?: TMaintenanceTicket[];
  currentPage?: number;
  totalCount?: number;
};

export const normalizeMaintenanceTicketPage = (
  payload: RawMaintenancePage | TMaintenanceTicket[] | null | undefined
): TMaintenanceTicketPage => {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      pageNumber: 1,
      pageSize: payload.length,
      totalRecords: payload.length,
      totalPages: 1,
    };
  }

  const items = payload?.items ?? payload?.data ?? [];
  const pageNumber = payload?.pageNumber ?? payload?.currentPage ?? 1;
  const pageSize = payload?.pageSize ?? items.length;
  const totalRecords = payload?.totalRecords ?? payload?.totalCount ?? items.length;

  return {
    items,
    pageNumber,
    pageSize,
    totalRecords,
    totalPages:
      payload?.totalPages ??
      (pageSize > 0 ? Math.max(1, Math.ceil(totalRecords / pageSize)) : 1),
  };
};
