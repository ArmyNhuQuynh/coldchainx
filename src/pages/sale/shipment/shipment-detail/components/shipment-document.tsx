import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FilePreview from "@/components/file-preview";
import { useContract } from "@/hooks/use-contract";
import type { TOrder } from "@/schemas/order.schema";
import { QUOTATION_STATUS } from "@/types/enums/quotation-status.enum";
import { FileImage } from "lucide-react";
import { format } from "date-fns";

type Props = {
    order: TOrder;
};

const DOCUMENT_LABELS: Record<string, string> = {
    LEGAL_DOCUMENT: "Giấy tờ pháp lý",
    ITEM_IMAGE: "Hình ảnh kiện hàng",
    DISCREPANCY_REPORT: "Biên bản sai lệch",
    DELIVERY_NOTE: "Phiếu giao hàng",
    VAT_INVOICE: "Hóa đơn VAT",
    INTERNAL_TRANSFER: "Phiếu vận chuyển nội bộ",
    PHYSICAL_POD: "Biên bản giao nhận",
};

const getDocumentLabel = (docType: string) =>
    DOCUMENT_LABELS[docType.trim().toUpperCase()] ?? docType;

const getDocumentBadge = (status: string | null | undefined, hasFile: boolean) => {
    if (!hasFile) {
        return {
            label: "Chưa có tệp",
            className: "w-fit border border-slate-300 bg-transparent text-slate-600",
        };
    }

    switch (status?.trim().toUpperCase()) {
        case "PENDING":
            return {
                label: "Chờ duyệt",
                className: "w-fit border border-amber-300 bg-transparent text-amber-700",
            };
        case "APPROVED":
            return {
                label: "Đã duyệt",
                className: "w-fit border border-emerald-300 bg-transparent text-emerald-700",
            };
        case "REJECTED":
            return {
                label: "Bị từ chối",
                className: "w-fit border border-rose-300 bg-transparent text-rose-700",
            };
        default:
            return {
                label: "Đã tải lên",
                className: "w-fit border border-sky-300 bg-transparent text-sky-700",
            };
    }
};

const OrderDocuments = ({ order }: Props) => {
    const { getContractByOrderId } = useContract();
    const quotations = order.quotations ?? [];
    const documents = order.documents ?? [];
    const hasAcceptedQuotation = quotations.some(
        (quotation) => quotation.status === QUOTATION_STATUS.ACCEPTED
    );
    const { data: contractResponse } = getContractByOrderId(
        order.orderId,
        hasAcceptedQuotation
    );
    const signedContract = contractResponse?.data;
    const hasSignedContract = Boolean(signedContract?.signedFileUrl?.trim());

    if (documents.length === 0 && !hasSignedContract) {
        return (
            <Card>
                <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Tài liệu đính kèm
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground italic text-sm">Không có tài liệu</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="font-semibold text-lg pb-2 flex flex-row items-center gap-2">
                <FileImage className="h-5 w-5" />
                Tài liệu đính kèm
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {documents.map((doc) => {
                        const hasFile = Boolean(doc.imageUrl?.trim());
                        const badge = getDocumentBadge(doc.status, hasFile);

                        return (
                            <div key={doc.docId} className="flex items-start gap-4">
                                <FilePreview
                                    fileUrl={doc.imageUrl}
                                    alt={getDocumentLabel(doc.docType)}
                                    className="h-24 w-24 shrink-0"
                                />
                                <div className="flex min-w-0 flex-col gap-1">
                                    <p className="text-sm font-semibold uppercase">
                                        {getDocumentLabel(doc.docType)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {hasFile
                                            ? "Bấm vào bản xem trước để mở tài liệu"
                                            : "Hệ thống mới tạo mục tài liệu, chưa có tệp được tải lên"}
                                    </p>
                                    <Badge className={badge.className}>{badge.label}</Badge>
                                    <p className="text-xs text-muted-foreground">
                                        Tạo lúc: {doc.createdAt
                                            ? format(new Date(doc.createdAt), "dd/MM/yyyy")
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {hasSignedContract && signedContract && (
                        <div className="flex items-start gap-4">
                            <FilePreview
                                fileUrl={signedContract.signedFileUrl}
                                alt={`Hợp đồng đã ký ${signedContract.contractNumber}`}
                                className="h-24 w-24 shrink-0"
                                openLabel="Mở bản hợp đồng đã ký"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-sm uppercase">
                                    HỢP ĐỒNG KHÁCH ĐÃ KÝ
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {signedContract.contractNumber}
                                </p>
                                <Badge className="w-fit border border-green-200 bg-green-50 text-green-600">
                                    Đã tải lên
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                    Tải lên: {signedContract.uploadedSignedAt
                                        ? format(new Date(signedContract.uploadedSignedAt), "dd/MM/yyyy")
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderDocuments;
