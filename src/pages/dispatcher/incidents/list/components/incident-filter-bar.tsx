import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INCIDENT_SEVERITY_FILTER_OPTIONS } from "@/types/enums/incident-severity.enum";
import { INCIDENT_STATUS_FILTER_OPTIONS } from "@/types/enums/incident-status.enum";
import { RefreshCw, Search } from "lucide-react";

type Props = {
  search: string;
  status: string;
  severity: string;
  rescue: string;
  isRefreshing?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  onRescueChange: (value: string) => void;
  onRefresh: () => void;
};

const IncidentFilterBar = ({
  search,
  status,
  severity,
  rescue,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onSeverityChange,
  onRescueChange,
  onRefresh,
}: Props) => (
  <div className="grid gap-3 rounded-lg border bg-background p-4 lg:grid-cols-[minmax(240px,1fr)_190px_170px_170px_auto]">
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

    <Select value={severity} onValueChange={onSeverityChange}>
      <SelectTrigger><SelectValue placeholder="Mức độ" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tất cả mức độ</SelectItem>
        {INCIDENT_SEVERITY_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
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
