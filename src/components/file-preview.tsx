import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileQuestion, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

type FilePreviewProps = {
  fileUrl?: string | null;
  alt: string;
  className?: string;
  openLabel?: string;
  showOpenButton?: boolean;
};

const PDF_FILE_PATTERN = /\.pdf(?:$|[?#])/i;

const FilePreview = ({
  fileUrl,
  alt,
  className,
  openLabel = "Mở tệp",
  showOpenButton = false,
}: FilePreviewProps) => {
  const normalizedUrl = fileUrl?.trim() ?? "";
  const resolvedUrl = useMemo(
    () => (normalizedUrl ? resolveFileUrl(normalizedUrl) : ""),
    [normalizedUrl]
  );
  const [imageFailed, setImageFailed] = useState(false);
  const isPdf = PDF_FILE_PATTERN.test(resolvedUrl);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedUrl]);

  if (!resolvedUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border bg-muted/30 text-muted-foreground",
          className
        )}
      >
        <FileQuestion className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isPdf && showOpenButton ? (
        <div
          className={cn(
            "overflow-hidden rounded-lg border bg-white",
            className
          )}
        >
          <iframe
            src={resolvedUrl}
            title={alt}
            className="h-full min-h-64 w-full"
          />
        </div>
      ) : (
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex overflow-hidden rounded-lg border bg-muted/30",
            className
          )}
          aria-label={`${openLabel}: ${alt}`}
        >
          {isPdf ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <FileText className="h-8 w-8" />
              <span className="text-xs font-medium">PDF</span>
            </div>
          ) : imageFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-muted-foreground">
              <FileQuestion className="h-7 w-7" />
              <span className="text-xs">Mở tệp</span>
            </div>
          ) : (
            <img
              src={resolvedUrl}
              alt={alt}
              className="h-full w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          )}
        </a>
      )}

      {showOpenButton && (
        <Button variant="outline" size="sm" asChild>
          <a href={resolvedUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {openLabel}
          </a>
        </Button>
      )}
    </div>
  );
};

export default FilePreview;
