import { apiRequest } from "@/lib/http";
import envConfig from "@/schemas/config.schema";
import type {
  TDiscrepancyDetail,
  TPendingDiscrepancy,
  TResolveDiscrepancyRequest,
  TResolveDiscrepancyResponse,
} from "@/schemas/discrepancy.schema";
import { API_SUFFIX } from "./util.api";

type PendingDiscrepancyPayload =
  | TPendingDiscrepancy[]
  | {
      data?: TPendingDiscrepancy[] | { data?: TPendingDiscrepancy[] };
    };

const normalizePendingDiscrepancies = (
  payload: PendingDiscrepancyPayload
): TPendingDiscrepancy[] => {
  if (Array.isArray(payload)) return payload;

  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getPendingDiscrepancies = async () => {
  const response = await apiRequest.baseApi.get<PendingDiscrepancyPayload>(
    `${API_SUFFIX.DISCREPANCY_API}/pending`
  );
  return normalizePendingDiscrepancies(response.data);
};

const getDiscrepancyDetail = async (lpnId: string) => {
  const response = await apiRequest.baseApi.get<TDiscrepancyDetail>(
    `${API_SUFFIX.DISCREPANCY_API}/${lpnId}`
  );
  return response.data;
};

const resolveDiscrepancy = async (data: TResolveDiscrepancyRequest) => {
  const response = await apiRequest.baseApi.post<TResolveDiscrepancyResponse>(
    `${API_SUFFIX.DISCREPANCY_API}/resolve`,
    {
      lpnId: data.lpnId,
      accept: data.accept,
      penaltyAmount: data.penaltyAmount ?? 0,
      penaltyReason: data.penaltyReason ?? "",
    }
  );
  return response.data;
};

const getDiscrepancyPdfUrl = (receiptId: string) => {
  const path = `${API_SUFFIX.DISCREPANCY_API}/${receiptId}/pdf`.replace(
    /^\//,
    ""
  );
  return new URL(path, `${envConfig.VITE_API_BASE_URL}/`).toString();
};

export const discrepancyApi = {
  getPendingDiscrepancies,
  getDiscrepancyDetail,
  resolveDiscrepancy,
  getDiscrepancyPdfUrl,
};
