import { apiRequest } from "@/lib/http";
import type {
  TContractAppendix,
  TUpdateAppendixDraft,
} from "@/schemas/contract-appendix.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getAppendixByOrderId = async (orderId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TContractAppendix>>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/by-order/${orderId}`
  );
  return response.data;
};

const getAppendixById = async (appendixId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TContractAppendix>>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/${appendixId}`
  );
  return response.data;
};

const getAppendixHtml = async (appendixId: string) => {
  const response = await apiRequest.baseApi.get<string>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/${appendixId}/html`,
    { responseType: "text" }
  );
  return response.data;
};

const updateAppendixDraft = async (
  appendixId: string,
  data: TUpdateAppendixDraft
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TContractAppendix>>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/${appendixId}`,
    data.editedHtmlContent,
    {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
    }
  );
  return response.data;
};

const sendAppendix = async (appendixId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TContractAppendix>>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/${appendixId}/send`
  );
  return response.data;
};

const executeAppendix = async (appendixId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TContractAppendix>>(
    `${API_SUFFIX.CONTRACT_APPENDICES_API}/${appendixId}/execute`
  );
  return response.data;
};

export const contractAppendixApi = {
  getAppendixByOrderId,
  getAppendixById,
  getAppendixHtml,
  updateAppendixDraft,
  sendAppendix,
  executeAppendix,
};
