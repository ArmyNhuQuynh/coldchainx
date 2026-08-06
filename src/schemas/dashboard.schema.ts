export type TStatusCount = {
  status: string;
  count: number;
};

export type TDateRangeDashboardParams = {
  fromDate: string;
  toDate: string;
};

export type TSalesKpis = {
  pendingReviewOrders: number;
  needsUpdateOrders: number;
  draftQuotations: number;
  sentQuotations: number;
  draftContracts: number;
  pendingCustomerSignature: number;
  pendingSalesVerification: number;
  unreadMessages: number;
};

export type TSalesFunnelItem = {
  key: string;
  label: string;
  count: number;
  conversionRate: number;
};

export type TQuotationValueByMonth = {
  month: string;
  sentValue: number;
  acceptedValue: number;
};

export type TSalesPriorityWorkItem = {
  type: string;
  referenceId: string;
  orderId?: string | null;
  trackingCode?: string | null;
  customerName?: string | null;
  waitingHours: number;
  isOverdue: boolean;
};

export type TSalesOverview = {
  fromDate: string;
  toDate: string;
  kpis: TSalesKpis;
  overdueKpis: TSalesKpis;
  funnel: TSalesFunnelItem[];
  quotationStatusDistribution: TStatusCount[];
  quotationValuesByMonth: TQuotationValueByMonth[];
  averageProcessingTimes: {
    orderToQuotationSentHours?: number | null;
    signedUploadToVerificationHours?: number | null;
  };
  reviewReasons: Array<{ reason: string; count: number }>;
  priorityWorkItems: TSalesPriorityWorkItem[];
  workDistribution: Array<{ key: string; label: string; count: number }>;
  orderVolumeSeries: Array<{ period: string; totalOrders: number }>;
  discrepancySummary: {
    totalOrders: number;
    discrepancyOrders: number;
    discrepancyRate: number;
  };
  discrepancySeries: Array<{
    period: string;
    pending: number;
    appendixSent: number;
    resolved: number;
  }>;
};

export type TDispatcherDashboardParams = {
  date: string;
  warehouseId?: string;
  scheduleRange?: "DAY" | "WEEK";
};

export type TDispatcherKpis = {
  readyLpns: number;
  plannedTrips: number;
  pickingTrips: number;
  readyToSealTrips: number;
  inTransitTrips: number;
  lateOrRiskTrips: number;
  availableVehicles: number;
  availableDrivers: number;
  redeliveryLpns: number;
  pendingDispatcherClaims: number;
};

export type TDashboardAlert = {
  alertId: string;
  severity: string;
  alertType: string;
  tripId?: string | null;
  tripCode?: string | null;
  vehiclePlate?: string | null;
  message: string;
  status?: string | null;
  createdAt?: string | null;
  actionType: string;
};

export type TDashboardWorkItem = {
  type: string;
  referenceId: string;
  referenceCode?: string | null;
  code?: string | null;
  tripId?: string | null;
  message: string;
  isOverdue: boolean;
  slaDeadline?: string | null;
};

export type TDispatcherOverview = {
  kpis: TDispatcherKpis;
  tripStatusDistribution: TStatusCount[];
  tripUtilization: Array<{
    tripId: string;
    tripCode: string;
    vehiclePlate?: string | null;
    weightUtilizationPercent: number;
    volumeUtilizationPercent: number;
  }>;
  deliveryPerformance: {
    onTimeTrips: number;
    lateTrips: number;
  };
  priorityAlerts: TDashboardAlert[];
  priorityWorkItems: TDashboardWorkItem[];
  readyLpnsByWarehouse: TWarehouseResourceCount[];
  availableVehiclesByWarehouse: TWarehouseResourceCount[];
  vehicleStatusDistribution: TStatusCount[];
  availableDriversByWarehouse: TWarehouseResourceCount[];
  driverStatusDistribution: TStatusCount[];
  scheduleReadiness: Array<{
    scheduleId: string;
    scheduleName: string;
    routeId: string;
    routeName: string;
    departureAt: string;
    totalOrders: number;
    readyOrders: number;
    notReadyOrders: number;
  }>;
};

export type TWarehouseResourceCount = {
  warehouseId?: string | null;
  warehouseName: string;
  count: number;
};

export type TAdminDashboardParams = TDateRangeDashboardParams & {
  warehouseId?: string;
  routeId?: string;
};

export type TAdminKpis = {
  activeTrips: number;
  lateTrips: number;
  tripsWithTemperatureAlerts: number;
  totalVehicles: number;
  vehiclesOnTrip: number;
  vehiclesUnderMaintenance: number;
  availableDrivers: number;
  driversOnTrip: number;
  driversRelaxing: number;
  onlineIotDevices: number;
  offlineIotDevices: number;
  unassignedIotDevices: number;
  expiringDocuments: number;
  expiredDocuments: number;
  expiringVehicleDocuments: number;
  expiredVehicleDocuments: number;
  expiringDriverDocuments: number;
  expiredDriverDocuments: number;
  openIncidents: number;
  openClaims: number;
  overdueClaims: number;
  activeUsers: number;
  inactiveUsers: number;
};

export type TAdminOverview = {
  kpis: TAdminKpis;
  vehicleStatusDistribution: TStatusCount[];
  iotStatusDistribution: TStatusCount[];
  tripPerformanceByPeriod: Array<{
    period: string;
    completed: number;
    late: number;
    incident: number;
  }>;
  temperatureComplianceByRoute: Array<{
    routeId: string;
    routeName: string;
    complianceRate: number;
  }>;
  incidentDistribution: Array<{ type: string; count: number }>;
  tripsByWarehouse: Array<{
    warehouseId?: string | null;
    warehouseName: string;
    tripCount: number;
    orderCount: number;
  }>;
  fleetUtilization: Array<{
    vehicleId: string;
    vehiclePlate: string;
    tripCount: number;
    utilizationRate: number;
  }>;
  financialSnapshot: {
    recognizedRevenue: number;
    netCashFlow: number;
    claimPayout: number;
    unpaidInvoiceAmount: number;
  };
  priorityWorkItems: TDashboardWorkItem[];
};

export type TAccountantDashboardParams = TDateRangeDashboardParams & {
  groupBy: "DAY" | "MONTH";
};

export type TAccountantKpis = {
  recognizedRevenue: number;
  cashCollected: number;
  codCollected: number;
  receivables: number;
  vatAmount: number;
  claimPayout: number;
  driverReimbursement: number;
  netCashFlow: number;
  pendingAccountantClaims: number;
  pendingVerificationTransactions: number;
};

export type TAccountantPriorityWorkItem = {
  type: string;
  referenceId: string;
  referenceCode: string;
  amount?: number | null;
  createdAt?: string | null;
  dueDate?: string | null;
  isOverdue: boolean;
};

export type TAccountantOverview = {
  kpis: TAccountantKpis;
  receivablesAsOfDate: string;
  cashFlowSeries: Array<{ period: string; cashIn: number; cashOut: number }>;
  invoiceStatusDistribution: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  receivablesAging: Array<{
    bucket: string;
    label: string;
    invoiceCount: number;
    amount: number;
  }>;
  codByPaymentMethod: Array<{
    paymentMethod: string;
    count: number;
    amount: number;
  }>;
  claimPayoutByType: Array<{
    claimType: string;
    count: number;
    amount: number;
  }>;
  topCustomersByRevenue: Array<{
    customerId: string;
    customerName: string;
    amount: number;
  }>;
  topRoutesByRevenue: Array<{
    routeId: string;
    routeName: string;
    amount: number;
  }>;
  priorityWorkItems: TAccountantPriorityWorkItem[];
};
