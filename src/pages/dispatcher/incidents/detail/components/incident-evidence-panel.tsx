import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IncidentEvidenceList from "@/components/incidents/incident-evidence-list";
import type { TIncidentEvidence } from "@/schemas/incident.schema";

const IncidentEvidencePanel = ({ evidences }: { evidences: TIncidentEvidence[] }) => (
  <Card className="gap-0 rounded-lg py-0">
    <CardHeader className="border-b px-5 py-4">
      <CardTitle className="text-lg">Ảnh và chứng từ sự cố</CardTitle>
      <p className="mt-1 text-sm text-muted-foreground">
        Ảnh hiện trường, hóa đơn tài xế và ảnh xác nhận sang hàng
      </p>
    </CardHeader>
    <CardContent className="p-5">
      <IncidentEvidenceList evidences={evidences} />
    </CardContent>
  </Card>
);

export default IncidentEvidencePanel;
