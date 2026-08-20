import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INCIDENT_RISK_OPTIONS } from "@/types/enums/incident-risk.enum";
import { INCIDENT_STATUS_FILTER_OPTIONS } from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE_OPTIONS } from "@/types/enums/incident-type.enum";
import { RefreshCw, Search } from "lucide-react";

type Props = {
  search: string;
  status: string;
  risk: string;
  incidentType: string;
  queue: string;
  rescue: string;
  isRefreshing?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRiskChange: (value: string) => void;
  onIncidentTypeChange: (value: string) => void;
  onQueueChange: (value: string) => void;
  onRescueChange: (value: string) => void;
  onRefresh: () => void;
};

const IncidentFilterBar = ({
  search,
  status,
  risk,
  incidentType,
  queue,
  rescue,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onRiskChange,
  onIncidentTypeChange,
  onQueueChange,
  onRescueChange,
  onRefresh,
}: Props) => (
  <div className="grid gap-3 rounded-lg border bg-background p-4 xl:grid-cols-[minmax(220px,1fr)_180px_150px_180px_190px_160px_auto]">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        className="pl-9"
        placeholder="Tìm trip, người báo, mô tả..."
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>

    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="UNRESOLVED">Đang xử lý</SelectItem>
        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
        {INCIDENT_STATUS_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={risk} onValueChange={onRiskChange}>
      <SelectTrigger><SelectValue placeholder="Risk" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả risk</SelectItem>
        {INCIDENT_RISK_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={incidentType} onValueChange={onIncidentTypeChange}>
      <SelectTrigger><SelectValue placeholder="Loại sự cố" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả loại</SelectItem>
        {INCIDENT_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={queue} onValueChange={onQueueChange}>
      <SelectTrigger><SelectValue placeholder="Hàng đợi" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả hàng đợi</SelectItem>
        <SelectItem value="DISPATCHER_ACTION">Chờ Dispatcher xử lý</SelectItem>
      </SelectContent>
    </Select>

    <Select value={rescue} onValueChange={onRescueChange}>
      <SelectTrigger><SelectValue placeholder="Cứu hộ" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả yêu cầu</SelectItem>
        <SelectItem value="REQUIRED">Cần điều xe</SelectItem>
        <SelectItem value="NOT_REQUIRED">Không cần điều xe</SelectItem>
      </SelectContent>
    </Select>

    <Button
      type="button"
      variant="outline"
      size="icon"
      title="Tải lại dữ liệu"
      disabled={isRefreshing}
      onClick={onRefresh}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </Button>
  </div>
);

export default IncidentFilterBar;
