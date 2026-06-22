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

const OrderDocuments = ({ order }: Props) => {
    const { getContractByOrderId } = useContract();
    const hasAcceptedQuotation = order.quotations.some(
        (quotation) => quotation.status === QUOTATION_STATUS.ACCEPTED
    );
    const { data: contractResponse } = getContractByOrderId(
        order.orderId,
        hasAcceptedQuotation
    );
    const signedContract = contractResponse?.data;
    const hasSignedContract = Boolean(signedContract?.signedFileUrl?.trim());

    if (order.documents.length === 0 && !hasSignedContract) {
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
                    {order.documents.map((doc) => (
                        <div key={doc.docId} className="flex items-start gap-4">
                            <FilePreview
                                fileUrl={doc.imageUrl}
                                alt={doc.docType}
                                className="h-24 w-24 shrink-0"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-sm uppercase">{doc.docType}</p>
                                <p className="text-xs text-muted-foreground">{doc.imageUrl}</p>
                                <Badge
                                    className={
                                        doc.status === "PENDING"
                                            ? "text-yellow-600 bg-yellow-50 border border-yellow-200 w-fit"
                                            : doc.status === "APPROVED"
                                                ? "text-green-600 bg-green-50 border border-green-200 w-fit"
                                                : "text-red-600 bg-red-50 border border-red-200 w-fit"
                                    }
                                >
                                    {doc.status === "PENDING"
                                        ? "Chờ duyệt"
                                        : doc.status === "APPROVED"
                                            ? "Đã duyệt"
                                            : doc.status ?? "Chưa cập nhật"}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                    Tải lên: {doc.createdAt
                                        ? format(new Date(doc.createdAt), "dd/MM/yyyy")
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    ))}

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
