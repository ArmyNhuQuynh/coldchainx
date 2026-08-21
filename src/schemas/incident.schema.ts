import type { TIncidentExpenseStatus } from "@/types/enums/incident-expense-status.enum";
import type { TIncidentEvidenceType } from "@/types/enums/incident-evidence-type.enum";
import type { TIncidentSeverity } from "@/types/enums/incident-severity.enum";
import type { TIncidentStatus } from "@/types/enums/incident-status.enum";
import type { TIncidentType } from "@/types/enums/incident-type.enum";
import type {
  TIncidentRisk,
  TTemperatureSource,
} from "@/types/enums/incident-risk.enum";

export type TIncidentEvidence = {
  evidenceId: string;
  evidenceType: TIncidentEvidenceType;
  fileUrl: string;
};

export type TExternalReeferPlan = {
  rentalProvider: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone?: string | null;
  destinationWarehouseId: string;
  destinationWarehouseName?: string | null;
  destinationWarehouseAddress?: string | null;
  routeDestinationCity?: string | null;
  agreedTemperature: number;
  originalTripId?: string | null;
  dispatchedAt?: string | null;
  expectedWarehouseArrivalAt?: string | null;
  arrivedAt?: string | null;
  sealNumber: string;
  lpnIds: string[];
  dispatchEvidenceUrls?: string[];
  inboundReceiptIds?: string[];
  recordedBy?: string | null;
  arrivalConfirmedBy?: string | null;
  redispatchTripId?: string | null;
  redispatchPlannedAt?: string | null;
  dispatchNote?: string | null;
  arrivalNote?: string | null;
};

export type TTransloadRecord = {
  lpnIds: string[];
  sealNumber?: string | null;
  transferTemperature?: number | null;
  transferredAt: string;
  latitude?: number | null;
  longitude?: number | null;
  locationDescription?: string | null;
  evidenceUrls: string[];
  confirmedBy: string;
};

export type TIncident = {
  incidentId: string;
  tripId?: string | null;
  tripCode?: string | null;
  incidentType: TIncidentType;
  severity: TIncidentSeverity;
  riskLevel?: TIncidentRisk | string | null;
  description: string;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  driverPaidAmount: number;
  requiresRescue: boolean;
  temperatureSource?: TTemperatureSource | string | null;
  latestTemperature?: number | null;
  temperatureMeasuredAt?: string | null;
  temperatureTolerance?: number | null;
  temperatureThresholdBreached?: boolean;
  containmentConfirmedAt?: string | null;
  remainingSafeTimeMinutes?: number | null;
  safeTimeCalculation?: string | null;
  directDeliveryLocked?: boolean;
  previousIncidentId?: string | null;
  slaDueAt?: string | null;
  lastSlaEscalatedAt?: string | null;
  rescuePlanType?: string | null;
  rescuePlanDetails?: string | null;
  externalReeferPlan?: TExternalReeferPlan | null;
  redispatchPlan?: string | null;
  approvedAmount?: number | null;
  reimbursedAmount?: number | null;
  expenseStatus?: TIncidentExpenseStatus | null;
  status: TIncidentStatus;
  reportedBy: string;
  reportedByUsername: string;
  reportedAt?: string | null;
  handledBy?: string | null;
  handledAt?: string | null;
  handlingNote?: string | null;
  brokenVehicleId?: string | null;
  replacementVehicleId?: string | null;
  maintenanceTicketId?: string | null;
  rescueDispatchedAt?: string | null;
  transloadConfirmedBy?: string | null;
  transloadConfirmedAt?: string | null;
  transloadNote?: string | null;
  transloadDetails?: TTransloadRecord | null;
  expenseApprovedBy?: string | null;
  expenseApprovedAt?: string | null;
  expenseApprovalNote?: string | null;
  reimbursedBy?: string | null;
  reimbursedAt?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  evidences: TIncidentEvidence[];
};

export type TIncidentListParams = {
  tripId?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TIncidentPage = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: TIncident[];
};

export type TRescueCandidate = {
  vehicleId: string;
  truckPlate: string;
  vehicleType: string;
  warehouseId?: string | null;
  warehouseName?: string | null;
  warehouseAddress?: string | null;
  distanceKm?: number | null;
  maxWeight: number;
  maxCbm: number;
  minTemp: number;
  maxTemp: number;
  iotDeviceCount: number;
  onlineIotDeviceCount: number;
  hasOnlineIot: boolean;
  estimatedArrivalMinutes?: number | null;
  canArriveWithinSafeTime?: boolean | null;
  remainingSafeTimeMinutes?: number | null;
  remainingWeightCapacity?: number;
  remainingCbmCapacity?: number;
  transferCount?: number;
  recommended?: boolean;
  recommendationReason?: string;
  label: string;
};

export type TDispatchRescueRequest = {
  replacementVehicleId: string;
  planType: "DIRECT_RESCUE" | "WAREHOUSE_RESCUE";
  destinationWarehouseId?: string | null;
  transloadMinutes?: number;
  note?: string;
};

export type TDispatchRescueResult = {
  incidentId: string;
  incidentStatus: string;
  tripId: string;
  tripStatus: string;
  brokenVehicleId: string;
  brokenVehiclePlate: string;
  brokenVehicleStatus: string;
  maintenanceTicketId?: string | null;
  rescueVehicleId: string;
  rescueVehiclePlate: string;
  rescueVehicleStatus: string;
  transloadLpnCount: number;
  etaMethod: string;
  updatedStops: Array<{
    stopId: string;
    stopSequence: number;
    address?: string | null;
    oldEta: string;
    newEta: string;
    delayMinutes: number;
    notifiedCustomers: number;
  }>;
  notifiedCustomerCount: number;
  message: string;
};

export type TConfirmTransloadRequest = {
  confirmationNote: string;
  lpnIds: string[];
  sealNumber?: string;
  transferTemperature?: number;
  transferredAt?: string;
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  evidenceUrls: string[];
};

export type TContinueTripRequest = {
  handlingNote: string;
  expectedDelayMinutes: number;
};

export type TAssessIncidentRiskRequest = {
  riskLevel: TIncidentRisk;
  temperatureSource: TTemperatureSource;
  measuredTemperature?: number;
  measuredAt?: string;
  temperatureStable: boolean;
  canSafelyRepairOnSite?: boolean | null;
  containmentConfirmed: boolean;
  note?: string;
};

export type TIncidentRiskAssessmentResult = {
  incidentId: string;
  requestedRiskLevel: TIncidentRisk | string;
  effectiveRiskLevel: TIncidentRisk | string;
  incidentStatus: string;
  escalatedToCritical: boolean;
  decisionReason: string;
  targetTemperature: number;
  temperatureTolerance: number;
  latestTemperature?: number | null;
  temperatureMeasuredAt?: string | null;
  temperatureSource: string;
  hasTrustedTemperatureSource: boolean;
  temperatureThresholdBreached: boolean;
  directDeliveryLocked: boolean;
  requiresRescue: boolean;
  remainingSafeTimeMinutes?: number | null;
  safeTimeCalculation: string;
};

export type TInternalColdStorageOption = {
  warehouseId: string;
  warehouseName: string;
  address?: string | null;
  distanceKm?: number | null;
  estimatedArrivalMinutes?: number | null;
  canArriveWithinSafeTime?: boolean | null;
  minTemperature?: number | null;
  maxTemperature?: number | null;
  availablePalletPositions: number;
  isNearby: boolean;
  isRouteDestinationWarehouse: boolean;
};

export type TIncidentRescuePlan = {
  incidentId: string;
  tripId: string;
  targetTemperature: number;
  remainingSafeTimeMinutes?: number | null;
  temperatureThresholdBreached: boolean;
  directDeliveryLocked: boolean;
  recommendedAction:
    | "DIRECT_RESCUE"
    | "WAREHOUSE_RESCUE"
    | "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE"
    | "INTERNAL_COLD_STORAGE"
    | "MANUAL_ESCALATION"
    | string;
  recommendationReason: string;
  vehicles: TRescueCandidate[];
  internalColdStorages: TInternalColdStorageOption[];
  routeDestinationWarehouse?: TInternalColdStorageOption | null;
  requiresExternalVehicleRental: boolean;
  requiresManualEscalation: boolean;
};

export type TDispatchExternalReeferRequest = {
  externalVehicleConfirmed: true;
  rentalProvider: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  destinationWarehouseId: string;
  agreedTemperature: number;
  expectedWarehouseArrivalAt: string | null;
  sealNumber: string;
  lpnIds: string[];
  evidenceUrls: string[];
  note: string;
};

export type TInboundRouteWarehouseRequest = {
  sealNumber: string;
};

export type TExternalReeferWorkflowResult = {
  incidentId: string;
  tripId: string;
  incidentStatus: string;
  tripStatus: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  externalVehiclePlate?: string | null;
  lpnCount: number;
  warehouseInboundReady: boolean;
  requiredWarehouseAction:
    | "INBOUND_RESCUE_BY_SEAL"
    | "CREATE_REDISPATCH_TRIP";
  message?: string;
};

export type TRecordRescueFallbackRequest = {
  planType: "INTERNAL_COLD_STORAGE" | "MANUAL_ESCALATION";
  warehouseId?: string;
  redispatchPlan?: string;
  note: string;
};

export type TRescueFallbackResult = {
  incidentId: string;
  tripId: string;
  incidentStatus: string;
  tripStatus: string;
  planType: string;
  planDetails: string;
  incidentRemainsOpen: boolean;
};

export type TIncidentWorkflowResult = {
  incidentId: string;
  incidentStatus: string;
  tripId: string;
  tripStatus: string;
  vehicleId: string;
  vehiclePlate: string;
  confirmedAt: string;
  message: string;
};

export type TApproveIncidentExpenseRequest = {
  approvedAmount: number;
  approvalNote?: string;
};

export type TReimburseIncidentExpenseRequest = {
  reimbursedAmount: number;
  note?: string;
  receiptFile: File;
};

export type TResolveIncidentRequest = {
  resolutionNote: string;
};
