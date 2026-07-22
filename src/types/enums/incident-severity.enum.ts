export const INCIDENT_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type TIncidentSeverity =
  (typeof INCIDENT_SEVERITY)[keyof typeof INCIDENT_SEVERITY];

export const normalizeIncidentSeverity = (
  severity?: string | null
): TIncidentSeverity | null => {
  if (!severity) return null;

  const normalized = severity.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case INCIDENT_SEVERITY.LOW:
      return INCIDENT_SEVERITY.LOW;
    case INCIDENT_SEVERITY.MEDIUM:
      return INCIDENT_SEVERITY.MEDIUM;
    case INCIDENT_SEVERITY.HIGH:
      return INCIDENT_SEVERITY.HIGH;
    case INCIDENT_SEVERITY.CRITICAL:
      return INCIDENT_SEVERITY.CRITICAL;
    default:
      return null;
  }
};

export const getIncidentSeverityLabel = (severity?: string | null) => {
  switch (normalizeIncidentSeverity(severity)) {
    case INCIDENT_SEVERITY.LOW:
      return {
        label: "Thấp",
        className: "border-sky-500 bg-transparent text-sky-700",
      };
    case INCIDENT_SEVERITY.MEDIUM:
      return {
        label: "Trung bình",
        className: "border-amber-500 bg-transparent text-amber-700",
      };
    case INCIDENT_SEVERITY.HIGH:
      return {
        label: "Cao",
        className: "border-orange-500 bg-transparent text-orange-700",
      };
    case INCIDENT_SEVERITY.CRITICAL:
      return {
        label: "Nghiêm trọng",
        className: "border-rose-600 bg-transparent text-rose-700",
      };
    default:
      return {
        label: severity || "Không xác định",
        className: "border-muted-foreground/40 bg-transparent text-muted-foreground",
      };
  }
};

export const INCIDENT_SEVERITY_FILTER_OPTIONS = Object.values(
  INCIDENT_SEVERITY
).map((value) => ({
  value,
  label: getIncidentSeverityLabel(value).label,
}));
