import type { TIncidentExpenseStatus } from "@/types/enums/incident-expense-status.enum";
import type { TIncidentEvidenceType } from "@/types/enums/incident-evidence-type.enum";
import type { TIncidentSeverity } from "@/types/enums/incident-severity.enum";
import type { TIncidentStatus } from "@/types/enums/incident-status.enum";
import type { TIncidentType } from "@/types/enums/incident-type.enum";

export type TIncidentEvidence = {
  evidenceId: string;
  evidenceType: TIncidentEvidenceType;
  fileUrl: string;
  description?: string | null;
  uploadedBy?: string | null;
  uploadedAt?: string | null;
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
  reimbursedAmount?: number | null;
  requiresRescue: boolean;
  expenseStatus: TIncidentExpenseStatus;
  approvedAmount?: number | null;
  approvalNote?: string | null;
  expenseRejectionReason?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  reimbursedBy?: string | null;
  reimbursedAt?: string | null;
  reimbursementNote?: string | null;
  brokenVehicleId?: string | null;
  replacementVehicleId?: string | null;
  rescueDispatchedBy?: string | null;
  rescueDispatchedAt?: string | null;
  transloadConfirmedBy?: string | null;
  transloadConfirmedAt?: string | null;
  transloadTemperature?: number | null;
  transloadNote?: string | null;
  status: TIncidentStatus;
  reportedBy: string;
  reportedByUsername: string;
  reportedAt?: string | null;
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
  deviceId: string;
  deviceCode: string;
  isIotOnline: boolean;
  lastPingTime?: string | null;
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
  handoverTemperature?: number;
  note?: string;
  photos: File[];
};

export type TConfirmTransloadResult = {
  incidentId: string;
  tripId: string;
  tripStatus: string;
  vehicleId: string;
  truckPlate: string;
  deviceCode: string;
  transferredLpnCount: number;
  confirmedAt: string;
  handoverTemperature?: number | null;
  evidences: TIncidentEvidence[];
};

export type TReviewIncidentExpenseRequest =
  | {
      action: 1;
      approvedAmount: number;
      note?: string;
    }
  | {
      action: 2;
      rejectionReason: string;
      note?: string;
    };

export type TReimburseIncidentExpenseRequest = {
  reimbursedAmount: number;
  note?: string;
  receiptFile: File;
};
