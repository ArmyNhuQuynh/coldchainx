export const INCIDENT_REALTIME_EVENTS = [
  "IncidentReported",
  "IncidentEvidenceAdded",
  "IncidentRiskAssessed",
  "IncidentFallbackRecorded",
  "IncidentRescueDispatched",
  "IncidentTransloadCompleted",
  "ExternalReeferDispatched",
  "IncidentCargoInboundedAtRouteWarehouse",
  "IncidentTripContinued",
  "IncidentRedispatchPlanned",
  "IncidentRedispatchPickingStarted",
  "IncidentRedispatchLpnPicked",
  "IncidentRedispatchLoadingCompleted",
  "IncidentRedispatchSealed",
  "IncidentRedispatchedToCustomer",
  "IncidentExpenseApproved",
  "IncidentExpenseReimbursed",
  "IncidentResolved",
  "IncidentSlaEscalated",
] as const;

const readString = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
};

export const extractIncidentIdFromRealtimePayload = (
  payload: Record<string, unknown>
): string | null => {
  const direct = readString(
    payload,
    "incidentId",
    "IncidentId",
    "referenceId",
    "ReferenceId"
  );
  if (direct) return direct;
  for (const key of ["data", "Data", "payload", "Payload"]) {
    const nested = payload[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const nestedId = extractIncidentIdFromRealtimePayload(
        nested as Record<string, unknown>
      );
      if (nestedId) return nestedId;
    }
  }
  return null;
};
