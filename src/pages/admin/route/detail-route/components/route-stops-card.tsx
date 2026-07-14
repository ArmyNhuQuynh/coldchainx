import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoute } from "@/hooks/use-route";
import { handleApiError } from "@/lib/error";
import {
  RouteStopFormSchema,
  type TRouteStop,
} from "@/schemas/route.schema";
import { ChevronLeft, ChevronRight, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  routeId: string;
};

const PAGE_SIZE = 10;

const RouteStopsCard = ({ routeId }: Props) => {
  const {
    getRouteStops,
    createRouteStop,
    updateRouteStop,
    deleteRouteStop,
  } = useRoute();
  const [pageIndex, setPageIndex] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<TRouteStop | null>(null);
  const [stopName, setStopName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const stopsQuery = getRouteStops(routeId, {
    pageIndex,
    pageSize: PAGE_SIZE,
  });
  const response = stopsQuery.data?.data;
  const stops = response?.data ?? [];
  const totalPages = response?.totalPages ?? 0;
  const totalRecords = response?.totalRecords ?? 0;
  const isSubmitting = createRouteStop.isPending || updateRouteStop.isPending;

  const openCreateDialog = () => {
    setEditingStop(null);
    setStopName("");
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (stop: TRouteStop) => {
    setEditingStop(stop);
    setStopName(stop.stopName);
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    resetDialog();
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingStop(null);
    setStopName("");
    setFormError(null);
  };

  const handleSubmit = async () => {
    const parsed = RouteStopFormSchema.safeParse({ stopName });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Tên điểm dừng không hợp lệ");
      return;
    }

    try {
      if (editingStop) {
        await updateRouteStop.mutateAsync({
          routeId,
          stopId: editingStop.stopId,
          data: parsed.data,
        });
        toast.success("Cập nhật điểm dừng thành công");
      } else {
        await createRouteStop.mutateAsync({
          routeId,
          data: parsed.data,
        });
        toast.success("Thêm điểm dừng thành công");
      }

      resetDialog();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (stop: TRouteStop) => {
    const confirmed = window.confirm(`Xóa điểm dừng ${stop.stopName}?`);
    if (!confirmed) return;

    try {
      await deleteRouteStop.mutateAsync({ routeId, stopId: stop.stopId });
      toast.success("Xóa điểm dừng thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Card className="rounded-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Điểm dừng của tuyến</h2>
            <p className="text-sm text-muted-foreground">
              Quản lý các điểm trả hàng/dropoff thuộc tuyến này.
            </p>
          </div>
          <Button className="rounded-md" onClick={openCreateDialog}>
            <CirclePlus className="mr-2 h-4 w-4" />
            Thêm điểm dừng
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Tên điểm dừng</TableHead>
                <TableHead className="w-[180px] text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stopsQuery.isFetching && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Đang tải điểm dừng...
                  </TableCell>
                </TableRow>
              )}

              {!stopsQuery.isFetching && stops.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Chưa có điểm dừng nào cho tuyến này.
                  </TableCell>
                </TableRow>
              )}

              {!stopsQuery.isFetching &&
                stops.map((stop) => (
                  <TableRow key={stop.stopId}>
                    <TableCell className="font-medium">
                      {stop.stopName}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(stop)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteRouteStop.isPending}
                          onClick={() => handleDelete(stop)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Tổng {totalRecords.toLocaleString("vi-VN")} điểm dừng
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pageIndex <= 1 || stopsQuery.isFetching}
              onClick={() => setPageIndex((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Trang {pageIndex} / {Math.max(totalPages, 1)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={
                pageIndex >= Math.max(totalPages, 1) || stopsQuery.isFetching
              }
              onClick={() =>
                setPageIndex((current) => Math.min(totalPages, current + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStop ? "Chỉnh sửa điểm dừng" : "Thêm điểm dừng"}
            </DialogTitle>
            <DialogDescription>
              Điểm dừng này sẽ được dùng làm dropoff khi tạo order theo tuyến.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="route-stop-name">
              Tên điểm dừng
            </label>
            <Input
              id="route-stop-name"
              value={stopName}
              placeholder="VD: Phong kham Seed Pharma Quan 1"
              onChange={(event) => {
                setStopName(event.target.value);
                setFormError(null);
              }}
            />
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={closeDialog}
            >
              Hủy
            </Button>
            <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RouteStopsCard;
