export type TNotification = {
  notificationId: string;
  userId?: string | null;
  senderId?: string | null;
  templateId?: string | null;
  title: string;
  body: string;
  type?: string | null;
  referenceId?: string | null;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt?: string | null;
  sentAt?: string | null;
  deliveryStatus?: string | null;
};

export type TNotificationListParams = {
  pageNumber?: number;
  pageSize?: number;
  type?: string;
  isRead?: boolean;
};

export type TNotificationPage = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: TNotification[];
};

export type TIncidentRealtimeEvent = {
  eventName: string;
  payload: Record<string, unknown>;
  incidentId?: string | null;
};
