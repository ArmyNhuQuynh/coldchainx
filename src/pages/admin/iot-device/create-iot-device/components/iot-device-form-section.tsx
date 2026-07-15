import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
};

const IotDeviceFormSection = ({
  icon: Icon,
  title,
  description,
  children,
}: Props) => (
  <Card>
    <CardHeader className="space-y-1 pb-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </CardContent>
  </Card>
);

export default IotDeviceFormSection;
