import { apiRequest } from "@/lib/http";
import type {
  TDispatchLookupEnvelope,
  TManualDispatchRequest,
  TManualDispatchResult,
} from "@/schemas/dispatch.schema";
import { unwrapData } from "./dispatch-api.helpers";
import { API_SUFFIX } from "./util.api";

const manualDispatch = async (data: TManualDispatchRequest) => {
  const formData = new FormData();
  formData.append("WarehouseId", data.warehouseId);
  formData.append("VehicleId", data.vehicleId);
  formData.append("PlannedStartTime", data.plannedStartTime);
  formData.append("PlannedEndTime", data.plannedEndTime);
  data.driverIds.forEach((driverId) => formData.append("DriverIds", driverId));

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TManualDispatchResult> | TManualDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/manual-dispatch`, formData, {
    params: {
      lpnIds: data.lpnIds,
    },
  });

  return unwrapData<TManualDispatchResult>(response.data);
};

export const dispatchApi = {
  manualDispatch,
};
