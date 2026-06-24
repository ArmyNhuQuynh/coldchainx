import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveFileUrl } from "@/lib/file-url";
import type { TContractAppendix } from "@/schemas/contract-appendix.schema";
import { APPENDIX_STATUS, getAppendixStatusLabel } from "@/types/enums/appendix-status.enum";
import { ExternalLink, Loader2, Pencil, Save, Send } from "lucide-react";

type Props = {
  appendix: TContractAppendix;
  html: string;
  isEditing: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  isSending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (html: string) => Promise<void>;
  onSend: () => void;
};

const AppendixEditorDialog = ({
  appendix,
  html,
  isEditing,
  isRefreshing,
  isUpdating,
  isSending,
  onEdit,
  onCancelEdit,
  onUpdate,
  onSend,
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const status = getAppendixStatusLabel(appendix.status);
  const canModify = appendix.status === APPENDIX_STATUS.DRAFT;

  const handleFrameLoad = () => {
    const document = iframeRef.current?.contentDocument;
    if (!document?.body) return;

    document.designMode = isEditing ? "on" : "off";
    document.body.contentEditable = isEditing ? "true" : "false";
    document.body.spellcheck = isEditing;
  };

  const handleSave = async () => {
    const document = iframeRef.current?.contentDocument;
    if (!document?.documentElement) return;

    const doctype = document.doctype
      ? `<!DOCTYPE ${document.doctype.name}>\n`
      : "";
    await onUpdate(`${doctype}${document.documentElement.outerHTML}`);
  };

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <DialogTitle>Phụ lục hợp đồng</DialogTitle>
          <Badge className={status.className}>{status.label}</Badge>
          {isRefreshing && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <DialogDescription>
          Số phụ lục: {appendix.appendixNumber}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-hidden rounded-md border bg-white">
        <iframe
          key={isEditing ? "appendix-editor" : "appendix-preview"}
          ref={iframeRef}
          title={`Phụ lục ${appendix.appendixNumber}`}
          srcDoc={html}
          sandbox="allow-same-origin"
          onLoad={handleFrameLoad}
          className="h-[58vh] min-h-[360px] w-full bg-white"
        />
      </div>

      <DialogFooter className="items-center sm:justify-between">
        <div>
          {appendix.pdfUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={resolveFileUrl(appendix.pdfUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Mở PDF
              </a>
            </Button>
          )}
        </div>

        {canModify ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={isSending}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button onClick={onSend} disabled={isSending}>
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Gửi customer
                </Button>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Phụ lục hiện không ở trạng thái DRAFT.
          </p>
        )}
      </DialogFooter>
    </>
  );
};

export default AppendixEditorDialog;
