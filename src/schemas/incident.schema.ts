import type { TIncidentExpenseStatus } from "@/types/enums/incident-expense-status.enum";
import type { TIncidentEvidenceType } from "@/types/enums/incident-evidence-type.enum";
import type { TIncidentSeverity } from "@/types/enums/incident-severity.enum";
import type { TIncidentStatus } from "@/types/enums/incident-status.enum";
import type { TIncidentType } from "@/types/enums/incident-type.enum";

export type TIncidentEvidence = {
  evidenceId: string;
  evidenceType: TIncidentEvidenceType;
  fileUrl: string;
};

export type TIncident = {
  incidentId: string;
  tripId?: string | null;
  tripCode?: string | null;
  incidentType: TIncidentType;
  severity: TIncidentSeverity;
  description: string;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  driverPaidAmount: number;
  requiresRescue: boolean;
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
  maxWeight: number;
  maxCbm: number;
  minTemp: number;
  maxTemp: number;
  iotDeviceCount: number;
  onlineIotDeviceCount: number;
  hasOnlineIot: boolean;
  label: string;
};

export type TDispatchRescueRequest = {
  replacementVehicleId: string;
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
