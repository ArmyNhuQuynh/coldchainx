import type { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Badge } from "../ui/badge";
import { SortableHeader } from "./sortable-header";

export const createFormattedCell = (
  content: ReactNode,
  options: {
    align?: "left" | "center" | "right";
    maxWidth?: string;
    className?: string;
    truncate?: boolean;
    tooltip?: string;
  } = {}
) => {
  const {
    align = "center",
    maxWidth = "auto",
    className = "",
    truncate = false,
    tooltip,
  } = options;

  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  };

  const baseClasses = `flex items-center ${alignmentClasses[align]} text-sm`;
  const truncateClasses = truncate ? "truncate" : "";
  const widthStyle = maxWidth !== "auto" ? { maxWidth } : {};

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={widthStyle}
      title={tooltip}
    >
      <div className={truncateClasses}>{content}</div>
    </div>
  );
};

// Format default header
export const createFormattedHeader = (
  title: string,
  column?: any,
  options: {
    sortable?: boolean;
    align?: "left" | "center" | "right";
    className?: string;
  } = {}
) => {
  const { sortable = false, align = "center", className = "" } = options;

  if (sortable && column) {
    return (
      <div className={`flex justify-${align} ${className}`}>
        <SortableHeader column={column}>{title}</SortableHeader>
      </div>
    );
  }

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={`font-semibold text-base ${alignmentClasses[align]} ${className}`}
    >
      {title}
    </div>
  );
};

type StatusBadgeProps = {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

// Format default status badge
export const createSimpleStatusBadge = ({
  isActive,
  activeText = "Hoạt động",
  inactiveText = "Không hoạt động",
  activeClassName = "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactiveClassName = "bg-gray-50 text-gray-600 border border-gray-200",
}: StatusBadgeProps) => {
  return (
    <div className="flex justify-center">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium ${
          isActive ? activeClassName : inactiveClassName
        }`}
      >
        {isActive ? activeText : inactiveText}
      </div>
    </div>
  );
};

export type TStatusConfig = {
  label: string;
  className: string;
};

type TStatusMap = Record<string, TStatusConfig>;

export const createFormattedVariantStatusBadge = ({
  status,
  statusMap,
}: {
  status: string;
  statusMap: TStatusMap;
}) => {
  const cfg = statusMap[status];

  if (!cfg) return null;

  return (
    <div className="flex justify-center">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium ${cfg.className}`}
      >
        {cfg.label}
      </div>
    </div>
  );
};

// Format default badge with icon
export const createTypeBadge = (
  type: number,
  parentConfig: { icon: ReactNode; text: string; className: string },
  childConfig: { icon: ReactNode; text: string; className: string }
) => {
  const isParent = type === 0;
  const config = isParent ? parentConfig : childConfig;

  return (
    <div className="flex justify-center">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border ${config.className}`}
      >
        {config.icon}
        {config.text}
      </div>
    </div>
  );
};

// Format default action dropdown
export const createActionDropdown = (
  trigger: ReactNode,
  menuItems: Array<{
    label: string;
    icon: ReactNode;
    onClick: () => void;
    className?: string;
  }>,
  menuLabel?: string
) => {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {menuLabel && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {menuLabel}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className={`cursor-pointer ${
                item.className || "hover:bg-gray-50 focus:bg-gray-50"
              }`}
              onClick={item.onClick}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const createFormattedImageCell = ({
  imageUrl,
  size = 10,
  className = "",
}: {
  imageUrl?: string;
  size?: number;
  className?: string;
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {imageUrl ? (
        <PhotoProvider>
          <PhotoView src={imageUrl}>
            <img
              src={imageUrl}
              className={`w-${size} h-${size} object-cover rounded-full hover:cursor-pointer`}
            />
          </PhotoView>
        </PhotoProvider>
      ) : (
        <Badge variant="outline" className="text-base font-normal">
          Chưa có ảnh
        </Badge>
      )}
    </div>
  );
};
