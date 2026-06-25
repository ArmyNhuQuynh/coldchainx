import { BadgeCheck, Boxes, FileText, LockKeyhole, Route } from "lucide-react";

const steps = [
  { title: "Ghép chuyến", icon: Boxes, active: true },
  { title: "LIFO & Lộ trình", icon: Route },
  { title: "Kẹp chì", icon: LockKeyhole },
  { title: "Giấy đi đường", icon: FileText },
];

const DispatchStepper = () => {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className={
                step.active
                  ? "flex items-center gap-3 rounded-md bg-primary px-4 py-3 text-primary-foreground"
                  : "flex items-center gap-3 rounded-md border bg-background px-4 py-3 text-muted-foreground"
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-xs font-semibold text-foreground">
                {step.active ? <BadgeCheck className="h-4 w-4" /> : index + 1}
              </span>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DispatchStepper;
