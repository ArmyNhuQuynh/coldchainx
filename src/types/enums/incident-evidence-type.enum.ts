export const INCIDENT_EVIDENCE_TYPE = {
  INCIDENT_ATTACHMENT: "INCIDENT_ATTACHMENT",
  SCENE_PHOTO: "SCENE_PHOTO",
  DRIVER_RECEIPT: "DRIVER_RECEIPT",
  TRANSLOAD_PHOTO: "TRANSLOAD_PHOTO",
  REIMBURSEMENT_RECEIPT: "REIMBURSEMENT_RECEIPT",
  RESOLUTION_PDF: "RESOLUTION_PDF",
} as const;

export type TIncidentEvidenceType =
  (typeof INCIDENT_EVIDENCE_TYPE)[keyof typeof INCIDENT_EVIDENCE_TYPE];

export const normalizeIncidentEvidenceType = (
  type?: string | null
): TIncidentEvidenceType | null => {
  if (!type) return null;

  const normalized = type.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case INCIDENT_EVIDENCE_TYPE.INCIDENT_ATTACHMENT:
      return INCIDENT_EVIDENCE_TYPE.INCIDENT_ATTACHMENT;
    case INCIDENT_EVIDENCE_TYPE.SCENE_PHOTO:
      return INCIDENT_EVIDENCE_TYPE.SCENE_PHOTO;
    case INCIDENT_EVIDENCE_TYPE.DRIVER_RECEIPT:
      return INCIDENT_EVIDENCE_TYPE.DRIVER_RECEIPT;
    case INCIDENT_EVIDENCE_TYPE.TRANSLOAD_PHOTO:
      return INCIDENT_EVIDENCE_TYPE.TRANSLOAD_PHOTO;
    case INCIDENT_EVIDENCE_TYPE.REIMBURSEMENT_RECEIPT:
      return INCIDENT_EVIDENCE_TYPE.REIMBURSEMENT_RECEIPT;
    case INCIDENT_EVIDENCE_TYPE.RESOLUTION_PDF:
      return INCIDENT_EVIDENCE_TYPE.RESOLUTION_PDF;
    default:
      return null;
  }
};

export const getIncidentEvidenceTypeLabel = (type?: string | null) => {
  switch (normalizeIncidentEvidenceType(type)) {
    case INCIDENT_EVIDENCE_TYPE.INCIDENT_ATTACHMENT:
      return "Tệp đính kèm sự cố";
    case INCIDENT_EVIDENCE_TYPE.SCENE_PHOTO:
      return "Ảnh hiện trường";
    case INCIDENT_EVIDENCE_TYPE.DRIVER_RECEIPT:
      return "Hóa đơn tài xế";
    case INCIDENT_EVIDENCE_TYPE.TRANSLOAD_PHOTO:
      return "Ảnh sang hàng";
    case INCIDENT_EVIDENCE_TYPE.REIMBURSEMENT_RECEIPT:
      return "Chứng từ hoàn tiền";
    case INCIDENT_EVIDENCE_TYPE.RESOLUTION_PDF:
      return "Biên bản xử lý";
    default:
      return type || "Không xác định";
  }
};
