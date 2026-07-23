import FilePreview from "@/components/file-preview";
import { Badge } from "@/components/ui/badge";
import type { TIncidentEvidence } from "@/schemas/incident.schema";
import { getIncidentEvidenceTypeLabel } from "@/types/enums/incident-evidence-type.enum";
import { FileText } from "lucide-react";

type Props = {
  evidences: TIncidentEvidence[];
  emptyText?: string;
};

const IncidentEvidenceList = ({
  evidences,
  emptyText = "Chưa có ảnh hoặc chứng từ được gửi lên.",
}: Props) => {
  if (evidences.length === 0) {
    return (
      <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <FileText className="h-7 w-7" />
        <p className="mt-2 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {evidences.map((evidence) => {
        const evidenceLabel = getIncidentEvidenceTypeLabel(evidence.evidenceType);

        return (
          <div key={evidence.evidenceId} className="overflow-hidden rounded-lg border">
            <FilePreview
              fileUrl={evidence.fileUrl}
              alt={evidenceLabel}
              className="h-36 w-full rounded-none border-0"
            />
            <div className="space-y-2 border-t p-3">
              <Badge variant="outline" className="rounded-md bg-transparent">
                {evidenceLabel}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IncidentEvidenceList;
